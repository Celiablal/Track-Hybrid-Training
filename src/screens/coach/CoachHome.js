import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getAthleteWorkoutsForCoach, deleteWorkout, saveTemplate, getMonday, getWeekDays, formatWeekRange, getLogs } from '../../services/workoutService';

const ZONE_LABELS = {
  'head':'Cabeza','neck':'Cuello','l-sho':'Hombro Izq','r-sho':'Hombro Der',
  'chest':'Pecho','abdomen':'Abdomen','l-uarm':'Brazo Izq','r-uarm':'Brazo Der',
  'l-farm':'Antebrazo Izq','r-farm':'Antebrazo Der','l-hip':'Cadera Izq','r-hip':'Cadera Der',
  'l-quad':'Cuádricep Izq','r-quad':'Cuádricep Der','l-knee':'Rodilla Izq','r-knee':'Rodilla Der',
  'l-shin':'Espinilla Izq','r-shin':'Espinilla Der','l-foot':'Pie Izq','r-foot':'Pie Der',
  'b-head':'Cabeza (post)','b-neck':'Cuello (post)','b-l-sho':'Hombro Izq (post)','b-r-sho':'Hombro Der (post)',
  'b-upback':'Espalda Alta','b-lowback':'Lumbar','b-l-uarm':'Brazo Izq (post)','b-r-uarm':'Brazo Der (post)',
  'b-l-farm':'Antebrazo Izq (post)','b-r-farm':'Antebrazo Der (post)','b-l-glute':'Glúteo Izq','b-r-glute':'Glúteo Der',
  'b-l-ham':'Isquiotibial Izq','b-r-ham':'Isquiotibial Der','b-l-knee':'Rodilla Izq (post)','b-r-knee':'Rodilla Der (post)',
  'b-l-calf':'Gemelo Izq','b-r-calf':'Gemelo Der','b-l-foot':'Pie Izq (post)','b-r-foot':'Pie Der (post)',
};

const exportWeeklyCSV = async (athlete, workouts, weekDays) => {
  const weekWorkouts = workouts.filter(w => weekDays.some(d => d.dateStr === w.dateStr));
  if (!weekWorkouts.length) { alert('No hay entrenamientos esta semana para exportar'); return; }

  const painZoneKeys = Object.keys(ZONE_LABELS);
  const headers = [
    'Atleta','Fecha','Día','Sesión','Tipo',
    'Hora inicio','Hora fin','Duración (min)',
    'RPE (Borg)','CMJ (cm)','Comentarios',
    'Sueño (1-5)','Energía (1-5)','Ánimo (1-5)',
    ...painZoneKeys.map(k => `Dolor: ${ZONE_LABELS[k]}`),
  ];

  const rows = [];
  for (const w of weekWorkouts) {
    const logs = await getLogs(w.id);
    if (logs.length === 0) {
      rows.push([athlete.name, w.dateStr, '', w.title, w.type === 'strength' ? 'Fuerza' : 'Carrera',
        '','','','','','','','','',...painZoneKeys.map(() => '')]);
    } else {
      for (const l of logs) {
        rows.push([
          athlete.name, w.dateStr, '', w.title,
          w.type === 'strength' ? 'Fuerza' : 'Carrera',
          l.startTime || '', l.endTime || '', l.duration || '',
          l.borg || '', l.cmj != null ? l.cmj : '',
          (l.comments || '').replace(/"/g, '""'),
          l.wellness?.sleep || '', l.wellness?.energy || '', l.wellness?.mood || '',
          ...painZoneKeys.map(k => l.bodyPain?.[k] || 0),
        ]);
      }
    }
  }

  const csv = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `THT_${athlete.name}_semana.csv`;
  a.click();
  URL.revokeObjectURL(url);
};

export default function CoachHome({ onCreateWorkout, onViewFeedback }) {
  const { userProfile } = useAuth();
  const [workouts, setWorkouts] = useState([]);
  const [monday, setMonday] = useState(getMonday(new Date()));
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedAthlete, setSelectedAthlete] = useState(null);

  const athletes = userProfile?.athletes || [];
  const weekDays = getWeekDays(monday);

  useEffect(() => {
    if (!athletes.length) return;
    if (!selectedAthlete) setSelectedAthlete(athletes[0]);
  }, [athletes]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!userProfile || !selectedAthlete) return;
    return getAthleteWorkoutsForCoach(userProfile.uid, selectedAthlete.uid, setWorkouts);
  }, [userProfile, selectedAthlete]);

  const prevWeek = () => { const d = new Date(monday); d.setDate(d.getDate() - 7); setMonday(d); };
  const nextWeek = () => { const d = new Date(monday); d.setDate(d.getDate() + 7); setMonday(d); };

  const dayWorkouts = workouts.filter(w => w.dateStr === selectedDate);

  const handleSaveTemplate = async (w) => {
    const name = window.prompt(`Nombre de la plantilla para "${w.title}":`, w.title);
    if (!name) return;
    await saveTemplate(userProfile.uid, w, name.trim());
    alert('✅ Plantilla guardada correctamente');
  };

  return (
    <div className="screen">
      {/* Header */}
      <div className="row-between mb-lg">
        <div>
          <div className="fs-lg fw-900">Hola, {userProfile?.name?.split(' ')[0]} 👋</div>
          <div className="text-muted fs-sm">Panel del entrenador</div>
        </div>
        <div className="card" style={{ padding: '8px 12px', textAlign: 'center', borderColor: '#00E67660', cursor: 'pointer' }}
          onClick={() => alert(`Tu código:\n\n${userProfile?.coachCode}`)}>
          <div style={{ fontSize: 9, fontWeight: 700, color: '#00E676', letterSpacing: 1.5 }}>CÓDIGO</div>
          <div style={{ fontSize: 20, fontWeight: 900, color: '#00E676', letterSpacing: 2 }}>{userProfile?.coachCode}</div>
        </div>
      </div>

      {/* Selector atleta */}
      {athletes.length === 0 ? (
        <div className="card mb-lg center" style={{ borderColor: '#FFD60040' }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>👥</div>
          <p className="text-muted fs-sm">Aún no tienes atletas. Comparte tu código <strong style={{ color: '#00E676' }}>{userProfile?.coachCode}</strong> para que se registren.</p>
        </div>
      ) : (
        <>
          <div className="label">ATLETA</div>
          <div className="days-scroll mb-lg">
            {athletes.map(a => (
              <div key={a.uid}
                onClick={() => setSelectedAthlete(a)}
                style={{
                  flexShrink: 0, padding: '8px 16px', borderRadius: 999,
                  background: selectedAthlete?.uid === a.uid ? '#00E676' : '#141414',
                  border: `1px solid ${selectedAthlete?.uid === a.uid ? '#00E676' : '#2A2A2A'}`,
                  color: selectedAthlete?.uid === a.uid ? '#000' : '#AAAAAA',
                  fontWeight: 700, fontSize: 14, cursor: 'pointer', whiteSpace: 'nowrap',
                }}>
                {a.name}
              </div>
            ))}
          </div>
        </>
      )}

      {selectedAthlete && (
        <>
          {/* Navegador de semana */}
          <div className="row-between mb-md" style={{ background: '#1C1C1C', borderRadius: 12, padding: '10px 14px', border: '1px solid #2A2A2A' }}>
            <button onClick={prevWeek} style={{ background: 'none', border: 'none', color: '#00E676', fontSize: 20, cursor: 'pointer', padding: '0 8px' }}>‹</button>
            <div className="center">
              <div className="fw-700 fs-sm">{formatWeekRange(monday)}</div>
            </div>
            <button onClick={nextWeek} style={{ background: 'none', border: 'none', color: '#00E676', fontSize: 20, cursor: 'pointer', padding: '0 8px' }}>›</button>
          </div>
          <button className="btn-ghost btn-sm mb-md" style={{ width: '100%' }}
            onClick={() => exportWeeklyCSV(selectedAthlete, workouts, weekDays)}>
            ⬇ Exportar semana completa (CSV)
          </button>

          {/* Días de la semana */}
          <div className="days-scroll mb-lg">
            {weekDays.map(d => {
              const hasWorkout = workouts.some(w => w.dateStr === d.dateStr);
              const isSelected = selectedDate === d.dateStr;
              const isToday = d.dateStr === new Date().toISOString().split('T')[0];
              return (
                <div key={d.dateStr}
                  onClick={() => setSelectedDate(d.dateStr)}
                  className={`day-chip ${isSelected ? 'active' : ''}`}
                  style={isToday && !isSelected ? { borderColor: '#FFD600' } : {}}>
                  <span style={{ fontSize: 10 }}>{d.short}</span>
                  <span style={{ fontSize: 15, fontWeight: 900 }}>{d.date.getDate()}</span>
                  <span style={{ fontSize: 9 }}>{d.date.toLocaleString('es-ES', { month: 'short' })}</span>
                  {hasWorkout && <div className={`day-dot ${isSelected ? 'active-dot' : ''}`} />}
                </div>
              );
            })}
          </div>

          {/* Entrenamientos del día */}
          <div className="label mb-md">
            {weekDays.find(d => d.dateStr === selectedDate)?.display?.toUpperCase() || selectedDate}
          </div>

          {dayWorkouts.length === 0 ? (
            <div className="empty-box">
              <div style={{ fontSize: 36, marginBottom: 12 }}>📋</div>
              <p className="text-muted mb-lg">Sin entrenamiento para este día</p>
              <button className="btn-primary btn-sm" style={{ width: 'auto', margin: '0 auto', display: 'block' }}
                onClick={() => onCreateWorkout(selectedDate, selectedAthlete, null)}>
                + Añadir sesión
              </button>
            </div>
          ) : (
            <>
              {dayWorkouts.map(w => (
                <div key={w.id} className="card mb-md">
                  <div className="row-between mb-sm">
                    <span className={w.type === 'strength' ? 'chip-green' : 'chip-yellow'}>
                      {w.type === 'strength' ? '🏋️ Fuerza' : '🏃 Carrera'}
                    </span>
                    <div className="row gap-sm">
                      <button className="btn-ghost btn-sm" title="Guardar como plantilla" onClick={() => handleSaveTemplate(w)}>💾</button>
                      <button className="btn-ghost btn-sm" onClick={() => onViewFeedback(w)}>📊</button>
                      <button className="btn-ghost btn-sm" onClick={() => onCreateWorkout(selectedDate, selectedAthlete, w)}>✏️</button>
                      <button className="btn-danger btn-sm" onClick={() => { if (window.confirm('¿Eliminar?')) deleteWorkout(w.id); }}>🗑️</button>
                    </div>
                  </div>
                  <div className="fw-700 fs-md mb-sm">{w.title}</div>
                  {w.type === 'strength' && w.exercises?.map((ex, i) => (
                    <div key={i} className="row-between" style={{ borderTop: '1px solid #2A2A2A', padding: '6px 0' }}>
                      <span className="fs-sm">{ex.name}</span>
                      <span className="fs-sm text-green">
                        {ex.sets}×{ex.reps || (ex.execTime ? `${ex.execTime}s` : '—')}
                        {ex.weight ? ` · ${ex.weight}kg` : ''}
                        {ex.rir !== '' && ex.rir !== undefined ? ` · RIR ${ex.rir}` : ''}
                        {ex.restTime ? ` · 🕐${ex.restTime}s` : ''}
                      </span>
                    </div>
                  ))}
                  {w.type === 'running' && w.series?.map((s, i) => (
                    <div key={i} className="row-between" style={{ borderTop: '1px solid #2A2A2A', padding: '6px 0' }}>
                      <span className="fs-sm">Serie {i + 1}</span>
                      <span className="fs-sm text-yellow">{[s.distance && `${s.distance}m`, s.duration && `${s.duration}min`, s.speed && `${s.speed}km/h`].filter(Boolean).join(' · ')}</span>
                    </div>
                  ))}
                  {w.notes && <p className="text-muted fs-sm mt-sm" style={{ fontStyle: 'italic' }}>📝 {w.notes}</p>}
                </div>
              ))}
              <button className="btn-ghost" onClick={() => onCreateWorkout(selectedDate, selectedAthlete, null)}>+ Añadir otra sesión</button>
            </>
          )}
        </>
      )}
    </div>
  );
}

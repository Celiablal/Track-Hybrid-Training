import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { saveWorkout, updateWorkout, getWeekDays, getMonday } from '../../services/workoutService';

const emptyEx = () => ({ name: '', sets: '', reps: '', weight: '', rir: '', notes: '', videoUrl: '' });
const emptySerie = () => ({ distance: '', duration: '', speed: '' });

export default function CreateWorkout({ initDate, athlete, editWorkout, onBack }) {
  const { userProfile } = useAuth();
  const [dateStr, setDateStr] = useState(initDate || new Date().toISOString().split('T')[0]);
  const [type, setType] = useState(editWorkout?.type || null);
  const [title, setTitle] = useState(editWorkout?.title || '');
  const [notes, setNotes] = useState(editWorkout?.notes || '');
  const [exercises, setExercises] = useState(editWorkout?.exercises || [emptyEx()]);
  const [series, setSeries] = useState(editWorkout?.series || [emptySerie()]);
  const [loading, setLoading] = useState(false);

  // Genera la semana del día seleccionado para el selector de fecha
  const monday = getMonday(new Date(dateStr + 'T12:00:00'));
  const weekDays = getWeekDays(monday);

  const updEx = (i, f, v) => { const u = [...exercises]; u[i] = { ...u[i], [f]: v }; setExercises(u); };
  const updSer = (i, f, v) => { const u = [...series]; u[i] = { ...u[i], [f]: v }; setSeries(u); };

  const handle = async (e) => {
    e.preventDefault();
    if (!type) { alert('Elige el tipo de sesión'); return; }
    setLoading(true);
    try {
      const data = {
        dateStr,
        type, title: title.trim(), notes: notes.trim(),
        athleteName: athlete.name,
        ...(type === 'strength' ? { exercises } : { series })
      };
      if (editWorkout) await updateWorkout(editWorkout.id, data);
      else await saveWorkout(userProfile.uid, athlete.uid, data);
      onBack();
    } catch (e) { alert('Error al guardar: ' + e.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="screen">
      <button onClick={onBack} style={{ background: 'none', border: 'none', color: '#00E676', fontWeight: 600, fontSize: 15, cursor: 'pointer', padding: 0, marginBottom: 20 }}>← Atrás</button>
      <div className="fw-900 fs-lg mb-sm">{editWorkout ? 'Editar sesión' : 'Nueva sesión'}</div>
      <div className="text-muted fs-sm mb-lg">Atleta: <strong style={{ color: '#00E676' }}>{athlete?.name}</strong></div>

      <form onSubmit={handle}>
        {/* Selector de fecha por día de semana */}
        <label className="label">Día</label>
        <div className="days-scroll mb-lg">
          {weekDays.map(d => (
            <div key={d.dateStr}
              className={`day-chip ${dateStr === d.dateStr ? 'active' : ''}`}
              onClick={() => setDateStr(d.dateStr)}
              style={{ minWidth: 64 }}>
              <span style={{ fontSize: 10 }}>{d.short}</span>
              <span style={{ fontSize: 15, fontWeight: 900 }}>{d.date.getDate()}</span>
              <span style={{ fontSize: 9 }}>{d.date.toLocaleString('es-ES', { month: 'short' })}</span>
            </div>
          ))}
        </div>

        {/* Tipo */}
        <label className="label">Tipo de sesión</label>
        <div className="row gap-md mb-lg">
          {[['strength', '🏋️ Fuerza', '#00E676'], ['running', '🏃 Carrera', '#FFD600']].map(([val, lbl, col]) => (
            <div key={val} onClick={() => setType(val)} style={{
              flex: 1, padding: 14, borderRadius: 12, textAlign: 'center', cursor: 'pointer',
              background: type === val ? col : '#141414',
              border: `1.5px solid ${type === val ? col : '#2A2A2A'}`,
              color: type === val ? '#000' : '#AAAAAA', fontWeight: 700,
            }}>{lbl}</div>
          ))}
        </div>

        {/* Título */}
        <label className="label">Título</label>
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Ej: Sentadilla + Press banca" required className="mb-lg" />

        {/* Ejercicios fuerza */}
        {type === 'strength' && (
          <>
            <label className="label">Ejercicios</label>
            {exercises.map((ex, i) => (
              <div key={i} className="card-surface mb-md">
                <div className="row-between mb-sm">
                  <span className="tag text-green" style={{ fontSize: 11 }}>Ejercicio {i + 1}</span>
                  {exercises.length > 1 && <button type="button" className="btn-danger btn-sm" onClick={() => setExercises(exercises.filter((_, idx) => idx !== i))}>✕</button>}
                </div>
                <input value={ex.name} onChange={e => updEx(i, 'name', e.target.value)} placeholder="Nombre del ejercicio" className="mb-sm" />
                <div className="row gap-sm mb-sm">
                  {[['sets','Series'],['reps','Reps'],['weight','Peso (kg)'],['rir','RIR']].map(([key, lbl]) => (
                    <div key={key} style={{ flex: 1 }}>
                      <div style={{ fontSize: 10, color: '#AAAAAA', marginBottom: 4 }}>{lbl}</div>
                      <input value={ex[key]} onChange={e => updEx(i, key, e.target.value)} placeholder="—" type="number" style={{ textAlign: 'center', padding: '8px 4px' }} />
                    </div>
                  ))}
                </div>
                <input value={ex.notes} onChange={e => updEx(i, 'notes', e.target.value)} placeholder="Notas (opcional)" className="mb-sm" />
                <div>
                  <div style={{ fontSize: 10, color: '#AAAAAA', marginBottom: 4 }}>🎬 Link YouTube (opcional)</div>
                  <input value={ex.videoUrl} onChange={e => updEx(i, 'videoUrl', e.target.value)} placeholder="https://youtube.com/watch?v=..." style={{ borderColor: ex.videoUrl ? '#FF4444' : '#2A2A2A' }} />
                </div>
              </div>
            ))}
            <button type="button" className="btn-ghost mb-lg" onClick={() => setExercises([...exercises, emptyEx()])}>+ Añadir ejercicio</button>
          </>
        )}

        {/* Series carrera */}
        {type === 'running' && (
          <>
            <label className="label">Series de carrera</label>
            {series.map((s, i) => (
              <div key={i} className="card-surface mb-md">
                <div className="row-between mb-sm">
                  <span className="tag text-yellow" style={{ fontSize: 11 }}>Serie {i + 1}</span>
                  {series.length > 1 && <button type="button" className="btn-danger btn-sm" onClick={() => setSeries(series.filter((_, idx) => idx !== i))}>✕</button>}
                </div>
                <div className="row gap-sm">
                  {[['distance','Distancia (m)'],['duration','Duración (min)'],['speed','Velocidad (km/h)']].map(([key, lbl]) => (
                    <div key={key} style={{ flex: 1 }}>
                      <div style={{ fontSize: 10, color: '#AAAAAA', marginBottom: 4 }}>{lbl}</div>
                      <input value={s[key]} onChange={e => updSer(i, key, e.target.value)} placeholder="—" type="number" style={{ textAlign: 'center', padding: '8px 4px' }} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <button type="button" className="btn-ghost mb-lg" onClick={() => setSeries([...series, emptySerie()])}>+ Añadir serie</button>
          </>
        )}

        {type && (
          <>
            <label className="label">Notas generales (opcional)</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Indicaciones para el atleta..." rows={3} className="mb-lg" />
          </>
        )}

        <button type="submit" className="btn-primary" disabled={loading || !type}>
          {loading ? 'Guardando...' : '✓ Guardar sesión'}
        </button>
      </form>
    </div>
  );
}

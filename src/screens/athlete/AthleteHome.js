import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getMyWorkouts, getMonday, getWeekDays, formatWeekRange } from '../../services/workoutService';

export default function AthleteHome({ onViewWorkout, onLogWorkout }) {
  const { userProfile } = useAuth();
  const [workouts, setWorkouts] = useState([]);
  const [monday, setMonday] = useState(getMonday(new Date()));
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const weekDays = getWeekDays(monday);
  const todayStr = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (!userProfile?.uid) return;
    return getMyWorkouts(userProfile.uid, setWorkouts);
  }, [userProfile]);

  const prevWeek = () => { const d = new Date(monday); d.setDate(d.getDate() - 7); setMonday(d); };
  const nextWeek = () => { const d = new Date(monday); d.setDate(d.getDate() + 7); setMonday(d); };
  const goToday = () => { setMonday(getMonday(new Date())); setSelectedDate(todayStr); };

  const dayWorkouts = workouts.filter(w => w.dateStr === selectedDate);

  return (
    <div className="screen">
      {/* Header */}
      <div className="row-between mb-lg">
        <div>
          <div className="fs-lg fw-900">Hola, {userProfile?.name?.split(' ')[0]} 💪</div>
          <div className="text-green fs-sm">Entrenador: {userProfile?.coachName}</div>
        </div>
        <div className="avatar" style={{ width: 44, height: 44, fontSize: 18 }}>{userProfile?.name?.[0]?.toUpperCase()}</div>
      </div>

      {/* Navegador semana */}
      <div className="row-between mb-md" style={{ background: '#1C1C1C', borderRadius: 12, padding: '10px 14px', border: '1px solid #2A2A2A' }}>
        <button onClick={prevWeek} style={{ background: 'none', border: 'none', color: '#00E676', fontSize: 20, cursor: 'pointer', padding: '0 8px' }}>‹</button>
        <div className="center" style={{ cursor: 'pointer' }} onClick={goToday}>
          <div className="fw-700 fs-sm">{formatWeekRange(monday)}</div>
          {monday.toISOString().split('T')[0] !== getMonday(new Date()).toISOString().split('T')[0] && (
            <div style={{ fontSize: 11, color: '#00E676', marginTop: 2 }}>Toca para ir a hoy</div>
          )}
        </div>
        <button onClick={nextWeek} style={{ background: 'none', border: 'none', color: '#00E676', fontSize: 20, cursor: 'pointer', padding: '0 8px' }}>›</button>
      </div>

      {/* Días */}
      <div className="days-scroll mb-lg">
        {weekDays.map(d => {
          const hasWorkout = workouts.some(w => w.dateStr === d.dateStr);
          const isSelected = selectedDate === d.dateStr;
          const isToday = d.dateStr === todayStr;
          return (
            <div key={d.dateStr}
              className={`day-chip ${isSelected ? 'active' : ''}`}
              style={isToday && !isSelected ? { borderColor: '#FFD600' } : {}}
              onClick={() => setSelectedDate(d.dateStr)}>
              <span style={{ fontSize: 10 }}>{d.short}</span>
              <span style={{ fontSize: 15, fontWeight: 900 }}>{d.date.getDate()}</span>
              <span style={{ fontSize: 9 }}>{d.date.toLocaleString('es-ES', { month: 'short' })}</span>
              {hasWorkout && <div className={`day-dot ${isSelected ? 'active-dot' : ''}`} />}
            </div>
          );
        })}
      </div>

      {/* Contenido del día */}
      <div className="label mb-md">
        {weekDays.find(d => d.dateStr === selectedDate)?.display?.toUpperCase() || selectedDate}
        {selectedDate === todayStr && <span style={{ color: '#FFD600', marginLeft: 8 }}>· HOY</span>}
      </div>

      {dayWorkouts.length === 0 ? (
        <div className="empty-box">
          <div style={{ fontSize: 48, marginBottom: 12 }}>🧘</div>
          <div className="fw-700 fs-md mb-sm">Día de descanso</div>
          <p className="text-muted">No hay entrenamiento programado para este día</p>
        </div>
      ) : dayWorkouts.map(w => (
        <div key={w.id} className="card mb-md" style={{ cursor: 'pointer' }} onClick={() => onViewWorkout(w)}>
          <div className="row-between mb-sm">
            <span className={w.type === 'strength' ? 'chip-green' : 'chip-yellow'}>
              {w.type === 'strength' ? '🏋️ Fuerza' : '🏃 Carrera'}
            </span>
            <span className="text-muted fs-sm">›</span>
          </div>
          <div className="fw-900 fs-md mb-sm">{w.title}</div>
          <div className="text-muted fs-sm mb-md">
            {w.type === 'strength' ? `${w.exercises?.length || 0} ejercicios` : `${w.series?.length || 0} series`}
          </div>
          <button className="btn-primary" onClick={e => { e.stopPropagation(); onLogWorkout(w); }}>
            ✓ Registrar sesión
          </button>
        </div>
      ))}
    </div>
  );
}

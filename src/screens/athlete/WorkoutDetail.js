import React from 'react';

export default function WorkoutDetail({ workout, onBack, onLog }) {
  return (
    <div className="screen">
      <button onClick={onBack} style={{ background: 'none', border: 'none', color: '#00E676', fontWeight: 600, fontSize: 15, cursor: 'pointer', padding: 0, marginBottom: 20 }}>← Atrás</button>

      <div className="mb-sm">
        <span className={workout.type === 'strength' ? 'chip-green' : 'chip-yellow'} style={{ marginBottom: 8, display: 'inline-flex' }}>
          {workout.type === 'strength' ? '🏋️ FUERZA' : '🏃 CARRERA'}
        </span>
      </div>
      <div className="fw-900 fs-xl mb-lg">{workout.title}</div>

      {workout.type === 'strength' && (
        <>
          <div className="tag text-muted mb-md" style={{ fontSize: 11, letterSpacing: 1.5 }}>EJERCICIOS</div>
          {workout.exercises?.map((ex, i) => (
            <div key={i} className="card mb-md">
              <div className="tag text-green mb-sm" style={{ fontSize: 11 }}>#{i + 1}</div>
              <div className="fw-700 fs-md mb-md">{ex.name || 'Ejercicio'}</div>
              <div className="metrics-grid">
                {[
                  ['Series', ex.sets, '#00E676'],
                  ['Reps', ex.reps, '#00E676'],
                  ex.execTime ? ['T.Ejec', `${ex.execTime}s`, '#69F0AE'] : null,
                  ['Peso', ex.weight ? `${ex.weight}kg` : '—', '#FFD600'],
                  ['RIR', ex.rir !== '' && ex.rir !== undefined ? ex.rir : '—', '#FFD600'],
                  ex.restTime ? ['Descanso', `${ex.restTime}s`, '#AAAAAA'] : null,
                ].filter(Boolean).map(([lbl, val, col]) => (
                  <div key={lbl} className="metric-box">
                    <div className="metric-val" style={{ color: col }}>{val}</div>
                    <div className="metric-lbl">{lbl}</div>
                  </div>
                ))}
              </div>
              {ex.notes && <div className="card-surface mt-sm"><span className="text-muted fs-sm">📝 {ex.notes}</span></div>}
              {ex.videoUrl && (
                <a
                  href={ex.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8, marginTop: 10,
                    background: '#FF000020', border: '1px solid #FF000040',
                    borderRadius: 10, padding: '10px 14px', textDecoration: 'none',
                    color: '#FF4444', fontWeight: 700, fontSize: 14,
                  }}
                >
                  <span style={{ fontSize: 20 }}>▶️</span> Ver vídeo del ejercicio
                </a>
              )}
            </div>
          ))}
        </>
      )}

      {workout.type === 'running' && (
        <>
          <div className="tag text-muted mb-md" style={{ fontSize: 11, letterSpacing: 1.5 }}>SERIES DE CARRERA</div>
          {workout.series?.map((s, i) => (
            <div key={i} className="card mb-md" style={{ borderColor: '#FFD60030' }}>
              <div className="row gap-sm mb-md">
                <div style={{ width: 28, height: 28, borderRadius: 14, background: '#FFD600', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: '#000', fontSize: 14 }}>{i + 1}</div>
                <span className="fw-700">Serie {i + 1}</span>
              </div>
              <div className="metrics-grid">
                {s.distance && <div className="metric-box"><div className="metric-val text-yellow">{s.distance}m</div><div className="metric-lbl">Distancia</div></div>}
                {s.duration && <div className="metric-box"><div className="metric-val text-green">{s.duration}min</div><div className="metric-lbl">Duración</div></div>}
                {s.speed && <div className="metric-box"><div className="metric-val text-green">{s.speed}km/h</div><div className="metric-lbl">Velocidad</div></div>}
              </div>
            </div>
          ))}
        </>
      )}

      {workout.notes && (
        <>
          <div className="tag text-muted mb-md mt-lg" style={{ fontSize: 11, letterSpacing: 1.5 }}>NOTAS DEL ENTRENADOR</div>
          <div className="card" style={{ borderLeft: '3px solid #00E676' }}>
            <p className="text-muted">{workout.notes}</p>
          </div>
        </>
      )}

      <button className="btn-primary mt-lg" onClick={onLog}>✓ Registrar esta sesión</button>
    </div>
  );
}

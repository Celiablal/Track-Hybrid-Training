import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { logSession, getMyLog } from '../../services/workoutService';
import WellnessForm from '../../components/WellnessForm';

const BORG_LABELS = { 1:'Reposo absoluto',2:'Muy muy ligero',3:'Muy ligero',4:'Ligero',5:'Algo duro',6:'Duro',7:'Muy duro',8:'Muy muy duro',9:'Extremadamente duro',10:'Esfuerzo máximo' };
const BORG_COLORS = { 1:'#00E676',2:'#00E676',3:'#69F0AE',4:'#CCFF90',5:'#FFD600',6:'#FFD600',7:'#FFAB40',8:'#FF6D00',9:'#FF3D00',10:'#FF1744' };

export default function LogWorkout({ workout, onBack }) {
  const { userProfile } = useAuth();
  const now = new Date();
  const [step, setStep] = useState(1); // 1 = sesión, 2 = wellness
  const [sessionData, setSessionData] = useState(null);

  const [startDate, setStartDate] = useState(now.toLocaleDateString('es-ES'));
  const [startTime, setStartTime] = useState(now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }));
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');
  const [borg, setBorg] = useState(null);
  const [cmj, setCmj] = useState('');
  const [comments, setComments] = useState('');
  const [loading, setLoading] = useState(false);
  const [alreadyLogged, setAlreadyLogged] = useState(false);

  useEffect(() => {
    getMyLog(workout.id, userProfile.uid).then(existing => {
      if (existing) {
        setAlreadyLogged(true);
        setStartDate(existing.startDate || '');
        setStartTime(existing.startTime || '');
        setEndDate(existing.endDate || '');
        setEndTime(existing.endTime || '');
        setBorg(existing.borg || null);
        setCmj(existing.cmj ? String(existing.cmj) : '');
        setComments(existing.comments || '');
      }
    });
  }, []);

  const setNowTime = (field) => {
    const n = new Date();
    const d = n.toLocaleDateString('es-ES');
    const t = n.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    if (field === 'start') { setStartDate(d); setStartTime(t); }
    else { setEndDate(d); setEndTime(t); }
  };

  const calcDuration = () => {
    try {
      const [sh, sm] = startTime.split(':').map(Number);
      const [eh, em] = endTime.split(':').map(Number);
      const diff = (eh * 60 + em) - (sh * 60 + sm);
      return diff > 0 ? diff : null;
    } catch { return null; }
  };

  // Paso 1: guardar datos de sesión y pasar a wellness
  const handleStep1 = (e) => {
    e.preventDefault();
    if (!borg) { alert('Selecciona tu nivel de esfuerzo (RPE)'); return; }
    setSessionData({ startDate, startTime, endDate, endTime, borg, cmj: cmj ? parseFloat(cmj) : null, comments, duration: calcDuration() });
    setStep(2);
  };

  // Paso 2: guardar wellness + sesión completa
  const handleSaveAll = async ({ wellness, bodyPain }) => {
    setLoading(true);
    try {
      await logSession(workout.id, userProfile.uid, userProfile.name, {
        ...sessionData,
        wellness,
        bodyPain,
      });
      alert('✅ Sesión y wellness registrados correctamente');
      onBack();
    } catch { alert('Error al guardar'); }
    finally { setLoading(false); }
  };

  const handleSkipWellness = async () => {
    setLoading(true);
    try {
      await logSession(workout.id, userProfile.uid, userProfile.name, sessionData);
      alert('✅ Sesión registrada correctamente');
      onBack();
    } catch { alert('Error al guardar'); }
    finally { setLoading(false); }
  };

  // ── PASO 2: Wellness ─────────────────────────────────────────────────────
  if (step === 2) return <WellnessForm onSave={handleSaveAll} onSkip={handleSkipWellness} />;

  // ── PASO 1: Sesión ───────────────────────────────────────────────────────
  return (
    <div className="screen">
      <button onClick={onBack} style={{ background: 'none', border: 'none', color: '#00E676', fontWeight: 600, fontSize: 15, cursor: 'pointer', padding: 0, marginBottom: 20 }}>← Atrás</button>

      {/* Indicador de paso */}
      <div className="row gap-sm mb-lg" style={{ justifyContent: 'center' }}>
        <div style={{ height: 4, width: 60, borderRadius: 2, background: '#00E676' }} />
        <div style={{ height: 4, width: 60, borderRadius: 2, background: '#2A2A2A' }} />
      </div>
      <div className="fw-900 fs-lg mb-sm center">Paso 1 de 2</div>
      <div className="text-muted fs-sm center mb-lg">Datos de la sesión</div>

      <div className="card mb-md" style={{ borderLeft: '3px solid #00E676' }}>
        <div className="tag text-green" style={{ fontSize: 11, letterSpacing: 1.5 }}>{workout.dateStr}</div>
        <div className="fw-700 fs-md mt-sm">{workout.title}</div>
      </div>

      {alreadyLogged && (
        <div className="card mb-md" style={{ background: '#00E67615', borderColor: '#00E67630', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="text-green">✓</span>
          <span className="text-green fs-sm">Ya registraste esta sesión — puedes actualizarla</span>
        </div>
      )}

      <form onSubmit={handleStep1}>
        {/* INICIO */}
        <div className="card mb-md">
          <div className="row-between mb-md">
            <div className="row gap-sm"><span className="text-green">▶</span><span className="label" style={{ margin: 0 }}>INICIO</span></div>
            <button type="button" className="btn-ghost btn-sm" onClick={() => setNowTime('start')}>Ahora</button>
          </div>
          <div className="row gap-md">
            <div className="flex-1"><div className="label">Fecha</div><input value={startDate} onChange={e => setStartDate(e.target.value)} placeholder="DD/MM/AAAA" /></div>
            <div className="flex-1"><div className="label">Hora</div><input value={startTime} onChange={e => setStartTime(e.target.value)} placeholder="HH:MM" /></div>
          </div>
        </div>

        {/* FIN */}
        <div className="card mb-md">
          <div className="row-between mb-md">
            <div className="row gap-sm"><span className="text-error">■</span><span className="label" style={{ margin: 0 }}>FIN</span></div>
            <button type="button" className="btn-ghost btn-sm" onClick={() => setNowTime('end')}>Ahora</button>
          </div>
          <div className="row gap-md">
            <div className="flex-1"><div className="label">Fecha</div><input value={endDate} onChange={e => setEndDate(e.target.value)} placeholder="DD/MM/AAAA" /></div>
            <div className="flex-1"><div className="label">Hora</div><input value={endTime} onChange={e => setEndTime(e.target.value)} placeholder="HH:MM" /></div>
          </div>
        </div>

        {/* BORG */}
        <div className="card mb-md">
          <div className="label mb-sm">PERCEPCIÓN DEL ESFUERZO — ESCALA DE BORG (1–10)</div>
          <div className="borg-grid mb-md">
            {[1,2,3,4,5,6,7,8,9,10].map(n => (
              <button key={n} type="button" className="borg-btn"
                style={borg === n ? { background: BORG_COLORS[n], borderColor: BORG_COLORS[n], color: '#000', transform: 'scale(1.1)' } : {}}
                onClick={() => setBorg(n)}>{n}</button>
            ))}
          </div>
          {borg && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: BORG_COLORS[borg] + '10', border: `1px solid ${BORG_COLORS[borg]}60`, borderRadius: 10, padding: 12 }}>
              <span style={{ fontSize: 36, fontWeight: 900, color: BORG_COLORS[borg] }}>{borg}</span>
              <span style={{ color: BORG_COLORS[borg], fontWeight: 600, fontSize: 15 }}>{BORG_LABELS[borg]}</span>
            </div>
          )}
        </div>

        {/* CMJ */}
        <div className="card mb-md">
          <div className="label mb-sm">ALTURA DE SALTO CMJ (OPCIONAL)</div>
          <div className="row gap-md">
            <input type="number" value={cmj} onChange={e => setCmj(e.target.value)} placeholder="—"
              style={{ fontSize: 28, fontWeight: 900, textAlign: 'center', color: '#FFD600', borderColor: '#FFD60060' }} />
            <div style={{ background: '#FFD60020', border: '1px solid #FFD60040', borderRadius: 10, padding: '12px 20px', flexShrink: 0 }}>
              <span style={{ color: '#FFD600', fontSize: 20, fontWeight: 800 }}>cm</span>
            </div>
          </div>
        </div>

        {/* COMENTARIOS */}
        <div className="card mb-lg">
          <div className="label mb-sm">COMENTARIOS (OPCIONAL)</div>
          <textarea value={comments} onChange={e => setComments(e.target.value)} placeholder="¿Cómo te has sentido?" rows={3} />
        </div>

        <button type="submit" className="btn-primary">
          Siguiente → Morning Wellness
        </button>
      </form>
    </div>
  );
}

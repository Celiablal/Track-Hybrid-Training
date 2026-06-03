import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function RegisterScreen({ onGoLogin }) {
  const [role, setRole] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [coachCode, setCoachCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { registerCoach, registerAthlete } = useAuth();

  const handle = async (e) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) { setError('La contraseña debe tener al menos 6 caracteres'); return; }
    setLoading(true);
    try {
      if (role === 'coach') {
        const p = await registerCoach(email.trim(), password, name.trim());
        alert(`✅ Cuenta creada.\n\nTu código para atletas es:\n\n${p.coachCode}\n\nCompártelo con tus atletas.`);
      } else {
        await registerAthlete(email.trim(), password, name.trim(), coachCode.trim());
      }
    } catch (err) {
      setError(err.message || 'Error al crear la cuenta');
    } finally { setLoading(false); }
  };

  if (!role) return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 24, background: '#0A0A0A' }}>
      <div className="fs-lg fw-900 mb-sm">¿Cuál es tu rol?</div>
      <p className="text-muted mb-lg">Selecciona cómo usarás la app</p>

      <div className="card mb-md" onClick={() => setRole('coach')} style={{ cursor: 'pointer', borderColor: '#00E676', textAlign: 'center' }}>
        <div style={{ fontSize: 40, marginBottom: 8 }}>🏋️</div>
        <div className="fw-900 fs-md mb-sm">Entrenador</div>
        <p className="text-muted fs-sm">Crea y gestiona entrenamientos para tus atletas</p>
      </div>

      <div className="card" onClick={() => setRole('athlete')} style={{ cursor: 'pointer', borderColor: '#FFD600', textAlign: 'center' }}>
        <div style={{ fontSize: 40, marginBottom: 8 }}>🏃</div>
        <div className="fw-900 fs-md mb-sm">Atleta</div>
        <p className="text-muted fs-sm">Consulta tus entrenamientos y registra tus sesiones</p>
      </div>

      <div className="center mt-lg">
        <button onClick={onGoLogin} style={{ background: 'none', border: 'none', color: '#00E676', fontWeight: 700, fontSize: 15, cursor: 'pointer', width: 'auto', padding: 0 }}>
          ← Volver al login
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 24, background: '#0A0A0A' }}>
      <button onClick={() => setRole(null)} style={{ background: 'none', border: 'none', color: '#00E676', fontWeight: 600, fontSize: 15, cursor: 'pointer', width: 'auto', padding: 0, marginBottom: 20, textAlign: 'left' }}>
        ← Atrás
      </button>
      <div className="fs-lg fw-900 mb-lg">{role === 'coach' ? '🏋️ Soy entrenador' : '🏃 Soy atleta'}</div>

      <form onSubmit={handle} className="card flex-col gap-md">
        {[
          { label: 'Nombre completo', val: name, set: setName, type: 'text', ph: 'Tu nombre' },
          { label: 'Email', val: email, set: setEmail, type: 'email', ph: 'tu@email.com' },
          { label: 'Contraseña', val: password, set: setPassword, type: 'password', ph: 'Mínimo 6 caracteres' },
          ...(role === 'athlete' ? [{ label: 'Código del entrenador', val: coachCode, set: setCoachCode, type: 'text', ph: 'Ej: AB3X7Y' }] : []),
        ].map((f, i) => (
          <div key={i}>
            <label className="label">{f.label}</label>
            <input type={f.type} placeholder={f.ph} value={f.val} onChange={e => f.set(e.target.value)} required style={{ textTransform: f.label.includes('Código') ? 'uppercase' : 'none' }} />
          </div>
        ))}
        {error && <p className="text-error fs-sm">{error}</p>}
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Creando cuenta...' : 'Crear cuenta'}
        </button>
      </form>
    </div>
  );
}

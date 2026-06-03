import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function LoginScreen({ onGoRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handle = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try { await login(email.trim(), password); }
    catch { setError('Email o contraseña incorrectos'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 24, background: '#0A0A0A' }}>
      <div className="center mb-lg">
        <div style={{ width: 80, height: 80, borderRadius: 20, background: '#00E676', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, margin: '0 auto 16px' }}>⚡</div>
        <div className="fs-xl fw-900" style={{ letterSpacing: 3 }}>TRACK HYBRID</div>
        <div style={{ color: '#00E676', letterSpacing: 8, fontSize: 13, marginTop: 4 }}>TRAINING</div>
      </div>

      <form onSubmit={handle} className="card flex-col gap-md">
        <div>
          <label className="label">Email</label>
          <input type="email" placeholder="tu@email.com" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div>
          <label className="label">Contraseña</label>
          <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        {error && <p className="text-error fs-sm">{error}</p>}
        <button type="submit" className="btn-primary mt-sm" disabled={loading}>
          {loading ? 'Entrando...' : 'Iniciar sesión'}
        </button>
      </form>

      <div className="center mt-lg">
        <span className="text-muted">¿Sin cuenta? </span>
        <button onClick={onGoRegister} style={{ background: 'none', border: 'none', color: '#00E676', fontWeight: 700, fontSize: 15, cursor: 'pointer', width: 'auto', padding: 0 }}>
          Regístrate
        </button>
      </div>
    </div>
  );
}

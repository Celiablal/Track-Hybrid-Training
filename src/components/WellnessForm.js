import React, { useState } from 'react';
import BodyMap from './BodyMap';

const SLIDERS = [
  { key: 'sleep',  label: '¿Cómo has dormido?',           min: 'Muy Mal',     max: 'Muy Bien',    emoji: '😴' },
  { key: 'energy', label: '¿Cuál es tu nivel de energía?', min: 'Muy Cansado', max: 'Muy Fresco',  emoji: '⚡' },
  { key: 'mood',   label: '¿Cómo está tu estado de ánimo?', min: 'Muy Negativo', max: 'Muy Positivo', emoji: '😊' },
];

const sliderColor = (v) => {
  if (v <= 2) return '#FF5252';
  if (v <= 3) return '#FFD600';
  return '#00E676';
};

export default function WellnessForm({ onSave, onSkip }) {
  const [values, setValues] = useState({ sleep: 3, energy: 3, mood: 3 });
  const [bodyPain, setBodyPain] = useState({});
  const [loading, setLoading] = useState(false);

  const handle = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onSave({ wellness: values, bodyPain });
    setLoading(false);
  };

  return (
    <div className="screen">
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <div style={{ fontSize: 32, marginBottom: 8 }}>🌅</div>
        <div className="fw-900 fs-lg">Morning Wellness</div>
        <p className="text-muted fs-sm mt-sm">Cuéntanos cómo te encuentras hoy</p>
      </div>

      <form onSubmit={handle}>
        {/* Sliders */}
        {SLIDERS.map((s, i) => (
          <div key={s.key} className="card mb-md">
            <div className="fw-700 mb-sm" style={{ fontSize: 15 }}>
              {i + 1}. {s.label}
            </div>
            <div style={{ textAlign: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: 28, fontWeight: 900, color: sliderColor(values[s.key]) }}>
                {values[s.key]}
              </span>
              <span className="text-muted fs-sm"> / 5</span>
            </div>
            <input
              type="range" min="1" max="5" step="1"
              value={values[s.key]}
              onChange={e => setValues({ ...values, [s.key]: parseInt(e.target.value) })}
              style={{
                width: '100%', appearance: 'none', height: 6, borderRadius: 3,
                background: `linear-gradient(to right, ${sliderColor(values[s.key])} ${(values[s.key] - 1) * 25}%, #2A2A2A ${(values[s.key] - 1) * 25}%)`,
                outline: 'none', cursor: 'pointer',
              }}
            />
            <div className="row-between mt-sm">
              <span className="text-muted" style={{ fontSize: 11 }}>{s.min}</span>
              <span className="text-muted" style={{ fontSize: 11 }}>{s.max}</span>
            </div>
          </div>
        ))}

        {/* Mapa corporal */}
        <div className="card mb-lg">
          <div className="fw-700 mb-sm" style={{ fontSize: 15 }}>
            4. ¿Área dolorida, sensible o dolorosa?
          </div>
          <p className="text-muted fs-sm mb-md">
            Toca cada zona para indicar intensidad del dolor (0 = sin dolor, 10 = muy doloroso).
            Cada toque suma 1. Toca de nuevo para seguir aumentando.
          </p>
          <BodyMap values={bodyPain} onChange={setBodyPain} />
        </div>

        {/* Leyenda colores */}
        <div className="card mb-lg" style={{ padding: 12 }}>
          <div className="label mb-sm">LEYENDA DE DOLOR</div>
          <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
            {[0,1,2,3,4,5,6,7,8,9,10].map(n => {
              const cols = ['#2A2A2A','#FFF9C4','#FFF176','#FFD54F','#FFB300','#FF8F00','#FF6D00','#F4511E','#E53935','#C62828','#B71C1C'];
              return (
                <div key={n} style={{ flex: 1, height: 20, background: cols[n], borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: 8, fontWeight: 700, color: n <= 3 ? '#333' : '#fff' }}>{n}</span>
                </div>
              );
            })}
          </div>
          <div className="row-between mt-sm">
            <span style={{ fontSize: 10, color: '#AAAAAA' }}>Sin dolor</span>
            <span style={{ fontSize: 10, color: '#AAAAAA' }}>Máximo dolor</span>
          </div>
        </div>

        <button type="submit" className="btn-primary mb-md" disabled={loading}>
          {loading ? 'Guardando...' : '✓ Guardar todo'}
        </button>
        <button type="button" onClick={onSkip} style={{ background: 'none', border: 'none', color: '#555', fontSize: 14, cursor: 'pointer', width: '100%', padding: 8 }}>
          Omitir cuestionario
        </button>
      </form>
    </div>
  );
}

import React from 'react';

// Color según intensidad 0-10
const zoneColor = (v) => {
  if (!v) return '#2A2A2A';
  const cols = ['#2A2A2A','#FFF9C4','#FFF176','#FFD54F','#FFB300','#FF8F00','#FF6D00','#F4511E','#E53935','#C62828','#B71C1C'];
  return cols[Math.min(v, 10)];
};
const textColor = (v) => (!v ? '#555' : v <= 4 ? '#333' : '#fff');

const FRONT_ZONES = [
  { id: 'head',      label: 'Cabeza',      shape: 'circle', cx: 100, cy: 26, r: 20 },
  { id: 'neck',      label: 'Cuello',      shape: 'rect', x: 89,  y: 46,  w: 22, h: 12 },
  { id: 'l-sho',     label: 'H.Izq',       shape: 'rect', x: 55,  y: 58,  w: 30, h: 22 },
  { id: 'r-sho',     label: 'H.Der',       shape: 'rect', x: 115, y: 58,  w: 30, h: 22 },
  { id: 'chest',     label: 'Pecho',       shape: 'rect', x: 72,  y: 58,  w: 56, h: 32 },
  { id: 'abdomen',   label: 'Abdomen',     shape: 'rect', x: 72,  y: 90,  w: 56, h: 32 },
  { id: 'l-uarm',    label: 'Brazo I',     shape: 'rect', x: 46,  y: 80,  w: 22, h: 36 },
  { id: 'r-uarm',    label: 'Brazo D',     shape: 'rect', x: 132, y: 80,  w: 22, h: 36 },
  { id: 'l-farm',    label: 'A.brazo I',   shape: 'rect', x: 40,  y: 116, w: 20, h: 30 },
  { id: 'r-farm',    label: 'A.brazo D',   shape: 'rect', x: 140, y: 116, w: 20, h: 30 },
  { id: 'l-hip',     label: 'Cadera I',    shape: 'rect', x: 72,  y: 122, w: 26, h: 20 },
  { id: 'r-hip',     label: 'Cadera D',    shape: 'rect', x: 102, y: 122, w: 26, h: 20 },
  { id: 'l-quad',    label: 'Cuad I',      shape: 'rect', x: 74,  y: 142, w: 24, h: 44 },
  { id: 'r-quad',    label: 'Cuad D',      shape: 'rect', x: 102, y: 142, w: 24, h: 44 },
  { id: 'l-knee',    label: 'Rodilla I',   shape: 'rect', x: 74,  y: 186, w: 24, h: 16 },
  { id: 'r-knee',    label: 'Rodilla D',   shape: 'rect', x: 102, y: 186, w: 24, h: 16 },
  { id: 'l-shin',    label: 'Espinilla I', shape: 'rect', x: 76,  y: 202, w: 22, h: 40 },
  { id: 'r-shin',    label: 'Espinilla D', shape: 'rect', x: 104, y: 202, w: 22, h: 40 },
  { id: 'l-foot',    label: 'Pie I',       shape: 'rect', x: 70,  y: 242, w: 26, h: 14 },
  { id: 'r-foot',    label: 'Pie D',       shape: 'rect', x: 100, y: 242, w: 26, h: 14 },
];

const BACK_ZONES = [
  { id: 'b-head',    label: 'Cabeza',      shape: 'circle', cx: 100, cy: 26, r: 20 },
  { id: 'b-neck',    label: 'Cuello',      shape: 'rect', x: 89,  y: 46,  w: 22, h: 12 },
  { id: 'b-l-sho',   label: 'H.Izq',       shape: 'rect', x: 55,  y: 58,  w: 30, h: 22 },
  { id: 'b-r-sho',   label: 'H.Der',       shape: 'rect', x: 115, y: 58,  w: 30, h: 22 },
  { id: 'b-upback',  label: 'Esp.Alta',    shape: 'rect', x: 72,  y: 58,  w: 56, h: 32 },
  { id: 'b-lowback', label: 'Lumbar',      shape: 'rect', x: 72,  y: 90,  w: 56, h: 32 },
  { id: 'b-l-uarm',  label: 'Brazo I',     shape: 'rect', x: 46,  y: 80,  w: 22, h: 36 },
  { id: 'b-r-uarm',  label: 'Brazo D',     shape: 'rect', x: 132, y: 80,  w: 22, h: 36 },
  { id: 'b-l-farm',  label: 'A.brazo I',   shape: 'rect', x: 40,  y: 116, w: 20, h: 30 },
  { id: 'b-r-farm',  label: 'A.brazo D',   shape: 'rect', x: 140, y: 116, w: 20, h: 30 },
  { id: 'b-l-glute', label: 'Glúteo I',    shape: 'rect', x: 72,  y: 122, w: 26, h: 20 },
  { id: 'b-r-glute', label: 'Glúteo D',    shape: 'rect', x: 102, y: 122, w: 26, h: 20 },
  { id: 'b-l-ham',   label: 'Isquio I',    shape: 'rect', x: 74,  y: 142, w: 24, h: 44 },
  { id: 'b-r-ham',   label: 'Isquio D',    shape: 'rect', x: 102, y: 142, w: 24, h: 44 },
  { id: 'b-l-knee',  label: 'Rodilla I',   shape: 'rect', x: 74,  y: 186, w: 24, h: 16 },
  { id: 'b-r-knee',  label: 'Rodilla D',   shape: 'rect', x: 102, y: 186, w: 24, h: 16 },
  { id: 'b-l-calf',  label: 'Gemelo I',    shape: 'rect', x: 76,  y: 202, w: 22, h: 40 },
  { id: 'b-r-calf',  label: 'Gemelo D',    shape: 'rect', x: 104, y: 202, w: 22, h: 40 },
  { id: 'b-l-foot',  label: 'Pie I',       shape: 'rect', x: 70,  y: 242, w: 26, h: 14 },
  { id: 'b-r-foot',  label: 'Pie D',       shape: 'rect', x: 100, y: 242, w: 26, h: 14 },
];

function BodySVG({ zones, values, onChange, label }) {
  const handleClick = (id) => {
    const current = values[id] || 0;
    onChange({ ...values, [id]: current >= 10 ? 0 : current + 1 });
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 11, color: '#AAAAAA', fontWeight: 700, letterSpacing: 1.5, marginBottom: 6 }}>{label}</div>
      <svg viewBox="0 0 200 260" width="100%" style={{ maxWidth: 160, display: 'block', margin: '0 auto' }}>
        {/* Contorno del cuerpo */}
        <ellipse cx="100" cy="26" rx="21" ry="21" fill="none" stroke="#444" strokeWidth="1.5" />
        <rect x="85" y="46" width="30" height="14" rx="4" fill="none" stroke="#444" strokeWidth="1.5" />
        <rect x="52" y="56" width="96" height="70" rx="6" fill="none" stroke="#444" strokeWidth="1.5" />
        <rect x="44" y="78" width="24" height="70" rx="5" fill="none" stroke="#444" strokeWidth="1.5" />
        <rect x="132" y="78" width="24" height="70" rx="5" fill="none" stroke="#444" strokeWidth="1.5" />
        <rect x="70" y="122" width="60" height="26" rx="4" fill="none" stroke="#444" strokeWidth="1.5" />
        <rect x="72" y="144" width="24" height="112" rx="5" fill="none" stroke="#444" strokeWidth="1.5" />
        <rect x="104" y="144" width="24" height="112" rx="5" fill="none" stroke="#444" strokeWidth="1.5" />

        {/* Zonas clickables */}
        {zones.map(z => {
          const val = values[z.id] || 0;
          const fill = zoneColor(val);
          const tc = textColor(val);
          if (z.shape === 'circle') return (
            <g key={z.id} onClick={() => handleClick(z.id)} style={{ cursor: 'pointer' }}>
              <circle cx={z.cx} cy={z.cy} r={z.r} fill={fill} stroke="#555" strokeWidth="1" />
              {val > 0 && <text x={z.cx} y={z.cy + 5} textAnchor="middle" fontSize="11" fontWeight="bold" fill={tc}>{val}</text>}
            </g>
          );
          return (
            <g key={z.id} onClick={() => handleClick(z.id)} style={{ cursor: 'pointer' }}>
              <rect x={z.x} y={z.y} width={z.w} height={z.h} rx="3" fill={fill} stroke="#555" strokeWidth="1" />
              {val > 0 && <text x={z.x + z.w / 2} y={z.y + z.h / 2 + 5} textAnchor="middle" fontSize="10" fontWeight="bold" fill={tc}>{val}</text>}
            </g>
          );
        })}
      </svg>
      <div style={{ fontSize: 10, color: '#555', marginTop: 4 }}>Toca para añadir dolor (0-10)</div>
    </div>
  );
}

export default function BodyMap({ values, onChange }) {
  const frontVals = {};
  const backVals = {};
  FRONT_ZONES.forEach(z => { frontVals[z.id] = values[z.id] || 0; });
  BACK_ZONES.forEach(z => { backVals[z.id] = values[z.id] || 0; });

  const updateFront = (v) => onChange({ ...values, ...v });
  const updateBack  = (v) => onChange({ ...values, ...v });

  const hasAnyPain = Object.values(values).some(v => v > 0);

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
        <div style={{ flex: 1 }}>
          <BodySVG zones={FRONT_ZONES} values={frontVals} onChange={updateFront} label="FRONTAL" />
        </div>
        <div style={{ flex: 1 }}>
          <BodySVG zones={BACK_ZONES} values={backVals} onChange={updateBack} label="POSTERIOR" />
        </div>
      </div>
      {hasAnyPain && (
        <button type="button" onClick={() => {
          const reset = {};
          [...FRONT_ZONES, ...BACK_ZONES].forEach(z => { reset[z.id] = 0; });
          onChange(reset);
        }} style={{ marginTop: 10, background: 'none', border: '1px solid #FF525260', color: '#FF5252', borderRadius: 8, padding: '6px 16px', fontSize: 12, cursor: 'pointer', width: 'auto', display: 'block', margin: '10px auto 0' }}>
          Limpiar todo
        </button>
      )}
    </div>
  );
}

export { FRONT_ZONES, BACK_ZONES };

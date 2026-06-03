import React, { useEffect, useState } from 'react';
import { getLogs } from '../../services/workoutService';

const BORG_COLORS = { 1:'#00E676',2:'#00E676',3:'#69F0AE',4:'#CCFF90',5:'#FFD600',6:'#FFD600',7:'#FFAB40',8:'#FF6D00',9:'#FF3D00',10:'#FF1744' };
const PAIN_COLS = ['','#FFF9C4','#FFF176','#FFD54F','#FFB300','#FF8F00','#FF6D00','#F4511E','#E53935','#C62828','#B71C1C'];

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

const sliderColor = (v) => { if (v <= 2) return '#FF5252'; if (v <= 3) return '#FFD600'; return '#00E676'; };

export default function AthleteFeedback({ workout, onBack }) {
  const [logs, setLogs] = useState([]);
  useEffect(() => { getLogs(workout.id).then(setLogs); }, [workout.id]);

  const avgBorg = logs.length ? (logs.reduce((a, l) => a + (l.borg || 0), 0) / logs.length).toFixed(1) : '—';
  const withCmj = logs.filter(l => l.cmj != null);
  const avgCmj = withCmj.length ? (withCmj.reduce((a, l) => a + l.cmj, 0) / withCmj.length).toFixed(1) : null;

  const exportCSV = () => {
    const painZoneKeys = Object.keys(ZONE_LABELS);
    const headers = [
      'Atleta','Día','Sesión','Tipo',
      'Fecha inicio','Hora inicio','Fecha fin','Hora fin','Duración (min)',
      'RPE (Borg)','CMJ (cm)','Comentarios',
      'Sueño (1-5)','Energía (1-5)','Ánimo (1-5)',
      ...painZoneKeys.map(k => `Dolor: ${ZONE_LABELS[k]}`),
      'Registrado el'
    ];
    const rows = logs.map(l => [
      l.athleteName, workout.dateStr || workout.day, workout.title,
      workout.type === 'strength' ? 'Fuerza' : 'Carrera',
      l.startDate || '', l.startTime || '', l.endDate || '', l.endTime || '',
      l.duration || '', l.borg || '', l.cmj != null ? l.cmj : '',
      (l.comments || '').replace(/"/g, '""'),
      l.wellness?.sleep || '', l.wellness?.energy || '', l.wellness?.mood || '',
      ...painZoneKeys.map(k => l.bodyPain?.[k] || 0),
      l.loggedAt ? new Date(l.loggedAt).toLocaleString('es-ES') : ''
    ]);
    const csv = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n');
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url;
    a.download = `THT_${workout.dateStr || workout.day}_${workout.title}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="screen">
      <div className="row-between mb-lg">
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: '#00E676', fontWeight: 600, fontSize: 15, cursor: 'pointer', padding: 0, width: 'auto' }}>← Atrás</button>
        {logs.length > 0 && <button className="btn-primary btn-sm" onClick={exportCSV}>⬇ Exportar CSV</button>}
      </div>

      <div className="card mb-lg">
        <div className="tag text-green mb-sm" style={{ fontSize: 11, letterSpacing: 1.5 }}>{workout.dateStr || workout.day}</div>
        <div className="fw-900 fs-md mb-sm">{workout.title}</div>
        <span className={workout.type === 'strength' ? 'chip-green' : 'chip-yellow'}>
          {workout.type === 'strength' ? '🏋️ Fuerza' : '🏃 Carrera'}
        </span>
      </div>

      {logs.length > 0 && (
        <div className="row gap-sm mb-lg" style={{ flexWrap: 'wrap' }}>
          <div className="card flex-1 center" style={{ borderColor: '#00E67640', minWidth: 80 }}>
            <div style={{ fontSize: 24, fontWeight: 900, color: '#00E676' }}>{logs.length}</div>
            <div className="text-muted" style={{ fontSize: 10 }}>Completaron</div>
          </div>
          <div className="card flex-1 center" style={{ borderColor: '#FFD60040', minWidth: 80 }}>
            <div style={{ fontSize: 24, fontWeight: 900, color: '#FFD600' }}>{avgBorg}</div>
            <div className="text-muted" style={{ fontSize: 10 }}>RPE Medio</div>
          </div>
          {avgCmj && (
            <div className="card flex-1 center" style={{ borderColor: '#69F0AE40', minWidth: 80 }}>
              <div style={{ fontSize: 24, fontWeight: 900, color: '#69F0AE' }}>{avgCmj}cm</div>
              <div className="text-muted" style={{ fontSize: 10 }}>CMJ Medio</div>
            </div>
          )}
        </div>
      )}

      <div className="label mb-md">RESPUESTAS ({logs.length})</div>

      {logs.length === 0 ? (
        <div className="empty-box">
          <div style={{ fontSize: 32, marginBottom: 12 }}>⏳</div>
          <p className="text-muted">Ningún atleta ha registrado esta sesión aún</p>
        </div>
      ) : logs.map((log, i) => {
        const bc = BORG_COLORS[log.borg] || '#AAAAAA';
        const painEntries = log.bodyPain ? Object.entries(log.bodyPain).filter(([, v]) => v > 0) : [];

        return (
          <div key={i} className="card mb-md">
            {/* Header atleta + RPE */}
            <div className="row-between mb-md">
              <div className="row gap-sm">
                <div className="avatar">{log.athleteName?.[0]?.toUpperCase()}</div>
                <div>
                  <div className="fw-700">{log.athleteName}</div>
                  <div className="text-muted fs-sm">{new Date(log.loggedAt).toLocaleDateString('es-ES')}</div>
                </div>
              </div>
              <div style={{ textAlign: 'center', border: `1.5px solid ${bc}`, borderRadius: 10, padding: '4px 12px', background: bc + '15' }}>
                <div style={{ fontSize: 22, fontWeight: 900, color: bc }}>{log.borg}</div>
                <div style={{ fontSize: 9, fontWeight: 700, color: bc, letterSpacing: 1 }}>RPE</div>
              </div>
            </div>

            {/* Tiempos */}
            <div className="flex-col gap-sm fs-sm text-muted mb-sm">
              {log.startTime && <span>▶ {log.startDate}  {log.startTime}</span>}
              {log.endTime && <span>■ {log.endDate}  {log.endTime}</span>}
              {log.duration && <span>⏱ {log.duration} min</span>}
            </div>

            {/* CMJ */}
            {log.cmj != null && (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#FFD60010', border: '1px solid #FFD60030', borderRadius: 8, padding: '6px 12px', marginBottom: 8 }}>
                <span style={{ color: '#FFD600' }}>📈</span>
                <span className="fs-sm text-muted">CMJ:</span>
                <span style={{ color: '#FFD600', fontWeight: 900 }}>{log.cmj} cm</span>
              </div>
            )}

            {/* Wellness */}
            {log.wellness && (
              <div className="card-surface mb-sm">
                <div className="label mb-sm" style={{ fontSize: 10 }}>🌅 MORNING WELLNESS</div>
                <div className="row gap-md">
                  {[['😴', 'Sueño', log.wellness.sleep], ['⚡', 'Energía', log.wellness.energy], ['😊', 'Ánimo', log.wellness.mood]].map(([em, lbl, val]) => (
                    <div key={lbl} style={{ flex: 1, textAlign: 'center' }}>
                      <div style={{ fontSize: 18 }}>{em}</div>
                      <div style={{ fontSize: 20, fontWeight: 900, color: sliderColor(val) }}>{val}</div>
                      <div style={{ fontSize: 10, color: '#AAAAAA' }}>{lbl}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Dolor */}
            {painEntries.length > 0 && (
              <div className="card-surface mb-sm">
                <div className="label mb-sm" style={{ fontSize: 10 }}>🩹 ZONAS DOLOROSAS</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {painEntries.map(([zone, val]) => (
                    <div key={zone} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: PAIN_COLS[val] + '30', border: `1px solid ${PAIN_COLS[val]}`, borderRadius: 6, padding: '3px 8px' }}>
                      <span style={{ fontSize: 11, color: '#fff' }}>{ZONE_LABELS[zone] || zone}</span>
                      <span style={{ fontSize: 12, fontWeight: 900, color: PAIN_COLS[val] }}>{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Comentarios */}
            {log.comments && (
              <div className="card-surface">
                <span className="text-muted fs-sm">💬 {log.comments}</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { getTemplates, deleteTemplate } from '../../services/workoutService';

export default function TemplateModal({ coachId, onSelect, onClose }) {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTemplates(coachId).then(t => {
      setTemplates(t.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      setLoading(false);
    });
  }, [coachId]);

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm('¿Eliminar esta plantilla?')) return;
    await deleteTemplate(id);
    setTemplates(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)',
      zIndex: 200, display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
    }} onClick={onClose}>
      <div style={{
        background: '#1C1C1C', borderRadius: '20px 20px 0 0',
        width: '100%', maxWidth: 480, padding: 24, paddingBottom: 40,
        maxHeight: '80vh', overflowY: 'auto', borderTop: '1px solid #2A2A2A',
      }} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="row-between mb-lg">
          <div>
            <div className="fw-900 fs-md">📋 Mis plantillas</div>
            <div className="text-muted fs-sm">{templates.length} guardadas</div>
          </div>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', color: '#555',
            fontSize: 22, cursor: 'pointer', width: 'auto', padding: 4,
          }}>✕</button>
        </div>

        {/* Contenido */}
        {loading ? (
          <div style={{ textAlign: 'center', color: '#AAAAAA', padding: 32 }}>Cargando...</div>
        ) : templates.length === 0 ? (
          <div style={{
            background: '#141414', border: '1px dashed #2A2A2A',
            borderRadius: 16, padding: '48px 24px', textAlign: 'center',
          }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>📭</div>
            <p className="text-muted fs-sm">
              Aún no tienes plantillas guardadas.<br />
              Pulsa 💾 en cualquier entrenamiento para guardar una.
            </p>
          </div>
        ) : templates.map(t => (
          <div
            key={t.id}
            onClick={() => onSelect(t)}
            style={{
              background: '#141414', border: '1px solid #2A2A2A',
              borderRadius: 12, padding: '12px 16px', cursor: 'pointer',
              marginBottom: 12, transition: 'border-color 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#00E67660'}
            onMouseLeave={e => e.currentTarget.style.borderColor = '#2A2A2A'}
          >
            <div className="row-between">
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="row gap-sm mb-sm">
                  <span className={t.type === 'strength' ? 'chip-green' : 'chip-yellow'} style={{ fontSize: 11 }}>
                    {t.type === 'strength' ? '🏋️ Fuerza' : '🏃 Carrera'}
                  </span>
                </div>
                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 2 }}>{t.name}</div>
                <div className="text-muted" style={{ fontSize: 12 }}>{t.title}</div>
                <div className="text-muted" style={{ fontSize: 11, marginTop: 2 }}>
                  {t.type === 'strength'
                    ? `${t.exercises?.length || 0} ejercicios`
                    : `${t.series?.length || 0} series`}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0, marginLeft: 12 }}>
                <button
                  onClick={e => handleDelete(e, t.id)}
                  style={{
                    background: 'none', border: 'none', color: '#FF5252',
                    fontSize: 16, cursor: 'pointer', padding: 6, width: 'auto',
                  }}>🗑️</button>
                <div style={{ color: '#00E676', fontSize: 20, fontWeight: 700 }}>›</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

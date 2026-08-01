import React from 'react';
import { Bell } from 'lucide-react';
import './AlertasPendientes.css';

export default function AlertasPendientes({ data }) {
  return (
    <div className="card ap-card">
      <div className="card-title" style={{ display: 'flex', gap: 4 }}>
        <Bell size={12} color="#f59e0b" />
        ALERTAS Y PENDIENTES
        <span className="info-icon" title="Alertas y tareas pendientes del sistema">ℹ</span>
      </div>
      <div className="ap-list">
        {data.map((alerta) => (
          <div key={alerta.tipo} className="ap-item">
            <span className="ap-label">{alerta.tipo}</span>
            <span className="badge" style={{ background: alerta.color }}>
              {alerta.cantidad}
            </span>
          </div>
        ))}
      </div>
      <button className="btn-link" style={{ marginTop: 8 }}>
        <span>Ver todas las alertas</span>
        <span>→</span>
      </button>
    </div>
  );
}

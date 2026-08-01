import React from 'react';
import { AlertTriangle } from 'lucide-react';
import './RiesgosCriticos.css';

export default function RiesgosCriticos({ data }) {
  const max = Math.max(...data.map(r => r.porcentaje));
  return (
    <div className="card rc-card">
      <div className="card-title" style={{ display: 'flex', gap: 4 }}>
        <AlertTriangle size={12} color="#f59e0b" />
        RIESGOS CRÍTICOS
        <span className="info-icon" title="Distribución según evaluación de riesgos">ℹ</span>
      </div>
      <div className="rc-subtitle">Distribución según evaluación de riesgos</div>
      <div className="rc-list">
        {data.map((r) => (
          <div key={r.tipo} className="rc-item">
            <div className="rc-meta">
              <span className="rc-tipo">{r.tipo}</span>
              <span className="rc-pct" style={{ color: r.color }}>{r.porcentaje}%</span>
            </div>
            <div className="progress-bar-wrap">
              <div
                className="progress-bar-fill"
                style={{ width: `${(r.porcentaje / max) * 100}%`, background: r.color }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

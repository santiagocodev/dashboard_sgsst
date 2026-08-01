import React from 'react';
import { CheckCircle2, XCircle, Clock, MinusCircle, Layers, ListChecks } from 'lucide-react';
import './ResumenGeneral.css';

const itemsScope = [
  { label: 'Estándares Evaluados', value: 'estandaresEvaluados', icon: Layers, color: '#3b82f6', bg: '#eff6ff' },
  { label: 'Criterios Evaluados', value: 'criteriosEvaluados', icon: ListChecks, color: '#6366f1', bg: '#eef2ff' },
];

const itemsResults = [
  { label: 'Cumplen', value: 'cumplen', icon: CheckCircle2, color: '#16a34a', bg: '#f0fdf4', highlight: true },
  { label: 'No Cumplen', value: 'noCumplen', icon: XCircle, color: '#dc2626', bg: '#fef2f2', highlight: true },
  { label: 'En Proceso', value: 'enProceso', icon: Clock, color: '#d97706', bg: '#fffbeb', highlight: true },
  { label: 'No Aplica', value: 'noAplica', icon: MinusCircle, color: '#9ca3af', bg: '#f9fafb', highlight: true },
];

export default function ResumenGeneral({ data }) {
  const totalCriterios = data.criteriosEvaluados || 1;

  return (
    <div className="card rg-card">
      <div className="card-title">
        RESUMEN GENERAL
        <span className="info-icon" title="Conteo total de estándares y criterios evaluados según la matriz SG-SST">ℹ</span>
      </div>
      
      <div className="rg-list">
        {/* Bloque Alcance */}
        {itemsScope.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={value} className="rg-item">
            <div className="rg-icon" style={{ background: bg, color }}>
              <Icon size={13} strokeWidth={2.5} />
            </div>
            <span className="rg-label">{label}</span>
            <span className="rg-value" style={{ color: 'var(--text-primary)' }}>
              {data[value]}
            </span>
          </div>
        ))}

        {/* Separador Visual */}
        <div className="rg-divider" />

        {/* Bloque Resultados con % Relativo */}
        {itemsResults.map(({ label, value, icon: Icon, color, bg }) => {
          const val = data[value] || 0;
          const pct = Math.round((val / totalCriterios) * 100);
          return (
            <div key={value} className="rg-item highlight">
              <div className="rg-icon" style={{ background: bg, color }}>
                <Icon size={13} strokeWidth={2.5} />
              </div>
              <span className="rg-label">{label}</span>
              <div className="rg-value-box">
                <span className="rg-value" style={{ color }}>{val}</span>
                <span className="rg-pct-tag">({pct}%)</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

import React from 'react';
import './CumplimientoEstandar.css';

function getColor(pct) {
  if (pct > 85) return '#22c55e'; // Aceptable (Verde > 85%)
  if (pct >= 60) return '#f59e0b'; // Moderado (Naranja 60% - 85%)
  return '#ef4444'; // Crítico (Rojo < 60%)
}

function getSelectedTheme(pct) {
  if (pct > 85) return 'selected-green';
  if (pct >= 60) return 'selected-amber';
  return 'selected-red';
}

function fixNombre(nombre) {
  if (!nombre) return '';
  let str = String(nombre).trim().replace(/^\d+\.\s*/, '');
  const upper = str.toUpperCase();
  if (upper.includes('RECURSO')) return 'Recursos';
  if (upper.includes('INTEGRAL')) return 'Gestión Integral';
  if (upper.includes('SALUD')) return 'Gestión de la Salud';
  if (upper.includes('PELIGRO') || upper.includes('RIESGO')) return 'Gestión de Peligros';
  if (upper.includes('AMENAZA')) return 'Gestión de Amenazas';
  if (upper.includes('RESULTADO') || upper.includes('VERIFICAC')) return 'Gestión y Resultados';
  if (upper.includes('MEJORA')) return 'Mejoramiento';
  return str;
}

export default function CumplimientoEstandar({ estandares, onSelect, selectedId }) {
  return (
    <div className="card ce-card">
      <div className="card-title">
        CUMPLIMIENTO POR ESTÁNDAR
        <span className="info-icon" title="Porcentaje de cumplimiento por cada estándar">ℹ</span>
      </div>
      <div className="ce-list">
        {estandares.map((e) => {
          const color = getColor(e.porcentaje);
          const isSelected = selectedId === e.id;
          const selectedTheme = isSelected ? getSelectedTheme(e.porcentaje) : '';
          const nameClean = fixNombre(e.nombre);
          const hasCount = e.cumplenItems !== undefined && e.totalItems !== undefined;

          return (
            <div
              key={e.id}
              className={`ce-item ${selectedTheme}`}
              onClick={() => onSelect(e.id)}
              role="button"
              tabIndex={0}
              title={`Ver detalle: ${nameClean}`}
            >
              <div className="ce-meta">
                <span className="ce-num">{e.id}.</span>
                <span className="ce-name">{nameClean}</span>
                {hasCount && (
                  <span className="ce-count-tag">({e.cumplenItems}/{e.totalItems})</span>
                )}
                <span className="ce-pct" style={{ color }}>{e.porcentaje}%</span>
              </div>
              <div className="progress-bar-wrap">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${e.porcentaje}%`, background: color }}
                />
              </div>
            </div>
          );
        })}
      </div>
      <button className="btn-link" style={{ marginTop: 6 }}>
        <span>Ver detalle por estándar</span>
        <span>→</span>
      </button>
    </div>
  );
}

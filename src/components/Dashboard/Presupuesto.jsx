import React, { useEffect, useRef } from 'react';
import { Chart, DoughnutController, ArcElement, Tooltip } from 'chart.js';
import './MiniDonutCard.css';

Chart.register(DoughnutController, ArcElement, Tooltip);

function fmt(n) {
  if (n >= 1000000) return `$${(n/1000000).toFixed(0)}M`;
  if (n >= 1000) return `$${(n/1000).toFixed(0)}K`;
  return `$${n}`;
}

export default function Presupuesto({ data }) {
  const chartRef = useRef(null);
  const instanceRef = useRef(null);

  useEffect(() => {
    if (!chartRef.current) return;
    if (instanceRef.current) instanceRef.current.destroy();
    instanceRef.current = new Chart(chartRef.current, {
      type: 'doughnut',
      data: {
        datasets: [{
          data: [data.porcentaje, 100 - data.porcentaje],
          backgroundColor: ['#3b82f6', '#eff6ff'],
          borderWidth: 0,
          borderRadius: [4, 0],
          cutout: '76%',
        }],
      },
      options: {
        responsive: false,
        plugins: { tooltip: { enabled: false }, legend: { display: false } },
        animation: { animateRotate: true, duration: 1000 },
      },
    });
    return () => { if (instanceRef.current) instanceRef.current.destroy(); };
  }, [data]);

  return (
    <div className="card mini-card">
      <div className="card-title">
        PRESUPUESTO
        <span className="info-icon" title="Ejecución presupuestal">ℹ</span>
      </div>
      <div className="mini-card-subtitle">Ejecución presupuestal</div>
      <div className="mini-content">
        <div style={{ position: 'relative', width: 80, height: 80, flexShrink: 0 }}>
          <canvas ref={chartRef} width={80} height={80} />
          <div className="mini-donut-label">
            <span className="mini-pct" style={{ color: '#3b82f6' }}>{data.porcentaje}%</span>
          </div>
        </div>
        <div className="mini-stats">
          <div className="mini-stat-row">
            <span className="mini-stat-label">Presupuesto Total</span>
            <span className="mini-stat-val">{fmt(data.total)}</span>
          </div>
          <div className="mini-stat-row">
            <span className="mini-stat-label" style={{ color: '#3b82f6' }}>Ejecutado</span>
            <span className="mini-stat-val" style={{ color: '#3b82f6' }}>{fmt(data.ejecutado)}</span>
          </div>
          <div className="mini-stat-row">
            <span className="mini-stat-label">Disponible</span>
            <span className="mini-stat-val">{fmt(data.disponible)}</span>
          </div>
        </div>
      </div>
      <button className="btn-link" style={{ marginTop: 8 }}><span>Ver detalle</span><span>→</span></button>
    </div>
  );
}

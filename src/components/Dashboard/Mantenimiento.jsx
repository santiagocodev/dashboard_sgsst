import React, { useEffect, useRef } from 'react';
import { Chart, DoughnutController, ArcElement, Tooltip } from 'chart.js';
import { Wrench } from 'lucide-react';
import './MiniDonutCard.css';

Chart.register(DoughnutController, ArcElement, Tooltip);

export default function Mantenimiento({ data }) {
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
      <div className="card-title" style={{ display: 'flex', gap: 4 }}>
        <Wrench size={12} color="#3b82f6" />
        MANTENIMIENTO
        <span className="info-icon" title="Cumplimiento del plan de mantenimiento">ℹ</span>
      </div>
      <div className="mini-card-subtitle">Cumplimiento del plan de mantenimiento</div>
      <div className="mini-content">
        <div style={{ position: 'relative', width: 80, height: 80, flexShrink: 0 }}>
          <canvas ref={chartRef} width={80} height={80} />
          <div className="mini-donut-label">
            <span className="mini-pct" style={{ color: '#3b82f6' }}>{data.porcentaje}%</span>
          </div>
        </div>
        <div className="mini-stats">
          <div className="mini-stat-row"><span className="mini-stat-label">Planeadas</span><span className="mini-stat-val">{data.planeadas}</span></div>
          <div className="mini-stat-row"><span className="mini-stat-label" style={{ color: '#3b82f6' }}>Ejecutadas</span><span className="mini-stat-val" style={{ color: '#3b82f6' }}>{data.ejecutadas}</span></div>
          <div className="mini-stat-row"><span className="mini-stat-label" style={{ color: '#f59e0b' }}>Pendientes</span><span className="mini-stat-val" style={{ color: '#f59e0b' }}>{data.pendientes}</span></div>
        </div>
      </div>
      <button className="btn-link" style={{ marginTop: 8 }}><span>Ver detalle</span><span>→</span></button>
    </div>
  );
}

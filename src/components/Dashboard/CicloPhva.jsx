import React, { useEffect, useRef } from 'react';
import { Chart, DoughnutController, ArcElement, Tooltip } from 'chart.js';
import './CicloPhva.css';

Chart.register(DoughnutController, ArcElement, Tooltip);

function PhvaDonut({ item, size = 80 }) {
  const ref = useRef(null);
  const inst = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    if (inst.current) inst.current.destroy();

    inst.current = new Chart(ref.current, {
      type: 'doughnut',
      data: {
        datasets: [{
          data: [item.valor, 100 - item.valor],
          backgroundColor: [item.color, '#f0f2f5'],
          borderWidth: 0,
          borderRadius: [4, 0],
          cutout: '74%',
        }],
      },
      options: {
        responsive: false,
        plugins: { tooltip: { enabled: false }, legend: { display: false } },
        animation: { animateRotate: true, duration: 1000, easing: 'easeInOutQuart' },
      },
    });

    return () => { if (inst.current) inst.current.destroy(); };
  }, [item]);

  const cumplenCount = item.cumplenItems !== undefined ? item.cumplenItems : Math.round((item.valor / 100) * 18);
  const totalCount = item.totalItems !== undefined ? item.totalItems : 18;

  return (
    <div className="phva-item">
      <div className="phva-donut-wrap" style={{ width: size, height: size }}>
        <canvas ref={ref} width={size} height={size} />
        <div className="phva-label">
          <span className="phva-pct" style={{ color: item.color }}>{item.valor}%</span>
        </div>
      </div>
      <span className="phva-name">{item.label}</span>
      <span className="phva-subinfo">{cumplenCount} / {totalCount} ítems</span>
    </div>
  );
}

export default function CicloPhva({ data }) {
  return (
    <div className="card phva-card">
      <div className="card-title">
        CICLO PHVA
        <span className="info-icon" title="Cumplimiento por etapa del ciclo PHVA">ℹ</span>
      </div>
      <div className="phva-grid">
        {data.map((item) => (
          <PhvaDonut key={item.label} item={item} size={80} />
        ))}
      </div>
    </div>
  );
}

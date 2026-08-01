import React, { useEffect, useRef } from 'react';
import { Chart, DoughnutController, ArcElement, Tooltip } from 'chart.js';
import { GraduationCap } from 'lucide-react';
import './MiniDonutCard.css';

Chart.register(DoughnutController, ArcElement, Tooltip);

function SmallDonut({ valor, meta, label, color, size = 68 }) {
  const ref = useRef(null);
  const inst = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    if (inst.current) inst.current.destroy();
    inst.current = new Chart(ref.current, {
      type: 'doughnut',
      data: {
        datasets: [{
          data: [valor, 100 - valor],
          backgroundColor: [color, '#f0f2f5'],
          borderWidth: 0,
          borderRadius: [4, 0],
          cutout: '74%',
        }],
      },
      options: {
        responsive: false,
        plugins: { tooltip: { enabled: false }, legend: { display: false } },
        animation: { animateRotate: true, duration: 900 },
      },
    });
    return () => { if (inst.current) inst.current.destroy(); };
  }, [valor, color]);

  return (
    <div className="dual-donut-item">
      <div className="dual-donut-title">{label}</div>
      <div className="dual-donut-inner" style={{ width: size, height: size }}>
        <canvas ref={ref} width={size} height={size} />
        <div className="mini-donut-label">
          <span className="mini-pct" style={{ color, fontSize: 14 }}>{valor}%</span>
        </div>
      </div>
      <div className="dual-donut-meta">
        <span className="meta-label">Meta: {meta}%</span>
      </div>
    </div>
  );
}

export default function Capacitaciones({ data }) {
  return (
    <div className="card mini-card">
      <div className="card-title" style={{ display: 'flex', gap: 4 }}>
        <GraduationCap size={12} color="#3b82f6" />
        PROGRAMA DE CAPACITACIÓN
        <span className="info-icon" title="Programa de capacitación">ℹ</span>
      </div>
      <div className="dual-donuts">
        <SmallDonut
          valor={data.cobertura.valor}
          meta={data.cobertura.meta}
          label="COBERTURA"
          color="#22c55e"
        />
        <SmallDonut
          valor={data.asistenciaPromedio.valor}
          meta={data.asistenciaPromedio.meta}
          label="ASISTENCIA PROMEDIO"
          color="#8b5cf6"
        />
      </div>
      <div className="mini-bottom-stat">
        <span className="mini-bottom-label">Cumplimiento Programa: </span>
        <span className="mini-bottom-val" style={{ color: '#22c55e' }}>{data.cumplimientoPrograma}%</span>
        <span className="mini-bottom-label"> | Meta: {data.metaPrograma}%</span>
      </div>
      <button className="btn-link" style={{ marginTop: 6 }}><span>Ver detalle</span><span>→</span></button>
    </div>
  );
}

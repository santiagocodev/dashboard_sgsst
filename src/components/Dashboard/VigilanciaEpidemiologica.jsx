import React, { useEffect, useRef } from 'react';
import { Chart, DoughnutController, ArcElement, Tooltip } from 'chart.js';
import { HeartPulse } from 'lucide-react';
import './MiniDonutCard.css';

Chart.register(DoughnutController, ArcElement, Tooltip);

function RiesgoDonut({ valor, label, riesgo, color, size = 68 }) {
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

  const riesgoColor = riesgo === 'Moderado' ? '#f59e0b' : riesgo === 'Alto' ? '#ef4444' : '#22c55e';

  return (
    <div className="dual-donut-item">
      <div className="dual-donut-title" style={{ fontSize: 8 }}>{label}</div>
      <div className="dual-donut-inner" style={{ width: size, height: size }}>
        <canvas ref={ref} width={size} height={size} />
        <div className="mini-donut-label">
          <span className="mini-pct" style={{ color, fontSize: 14 }}>{valor}%</span>
        </div>
      </div>
      <div className="dual-donut-meta">
        <span className="meta-label">Cumplimiento</span>
        <span className="meta-label" style={{ color: riesgoColor, fontWeight: 700 }}>
          Nivel de riesgo:<br />{riesgo}
        </span>
      </div>
    </div>
  );
}

export default function VigilanciaEpidemiologica({ data }) {
  return (
    <div className="card mini-card">
      <div className="card-title" style={{ display: 'flex', gap: 4 }}>
        <HeartPulse size={12} color="#ec4899" />
        VIGILANCIA EPIDEMIOLÓGICA
        <span className="info-icon" title="Vigilancia epidemiológica">ℹ</span>
      </div>
      <div className="dual-donuts">
        <RiesgoDonut
          valor={data.osteomuscular.valor}
          label="R. OSTEOMUSCULAR"
          riesgo={data.osteomuscular.nivelRiesgo}
          color="#22c55e"
        />
        <RiesgoDonut
          valor={data.psicosocial.valor}
          label="R. PSICOSOCIAL"
          riesgo={data.psicosocial.nivelRiesgo}
          color="#8b5cf6"
        />
      </div>
      <button className="btn-link" style={{ marginTop: 6 }}><span>Ver detalle</span><span>→</span></button>
    </div>
  );
}

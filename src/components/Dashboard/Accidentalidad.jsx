import React, { useEffect, useRef } from 'react';
import {
  Chart, LineController, LineElement, PointElement,
  CategoryScale, LinearScale, Tooltip, Filler
} from 'chart.js';
import './Accidentalidad.css';

Chart.register(LineController, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Filler);

function KpiMetric({ label, valor, meta, unidad = '', estado }) {
  const isOk = estado === 'Aceptable';
  return (
    <div className="acc-kpi">
      <span className="acc-kpi-label">{label}</span>
      <span className="acc-kpi-valor">{valor}{unidad}</span>
      <span className="acc-kpi-meta">Meta: {'<'} {meta}{unidad}</span>
      <span className={`acc-kpi-estado ${isOk ? 'ok' : 'bad'}`}>{estado}</span>
    </div>
  );
}

export default function Accidentalidad({ data }) {
  const chartRef = useRef(null);
  const instanceRef = useRef(null);

  useEffect(() => {
    if (!chartRef.current) return;
    if (instanceRef.current) instanceRef.current.destroy();

    instanceRef.current = new Chart(chartRef.current, {
      type: 'line',
      data: {
        labels: data.tendencia.labels,
        datasets: [
          {
            label: 'Frecuencia',
            data: data.tendencia.frecuencia,
            borderColor: '#22c55e',
            backgroundColor: 'rgba(34,197,94,0.08)',
            borderWidth: 2,
            pointRadius: 3,
            pointBackgroundColor: '#22c55e',
            fill: true,
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { mode: 'index', intersect: false }
        },
        scales: {
          y: {
            grid: { color: '#f0f2f5' },
            ticks: { font: { size: 8 }, color: '#9ca3af' }
          },
          x: {
            grid: { display: false },
            ticks: { font: { size: 8 }, color: '#9ca3af' }
          }
        },
        animation: { duration: 1000 },
      },
    });
    return () => { if (instanceRef.current) instanceRef.current.destroy(); };
  }, [data]);

  return (
    <div className="card acc-card">
      <div className="card-title">
        INDICADORES DE ACCIDENTALIDAD
        <span className="info-icon" title="Indicadores de accidentalidad">ℹ</span>
      </div>
      <div className="acc-content">
        {/* KPIs */}
        <div className="acc-kpis">
          <KpiMetric label="FRECUENCIA" valor={data.frecuencia.valor} meta={data.frecuencia.meta} estado={data.frecuencia.estado} />
          <KpiMetric label="SEVERIDAD" valor={data.severidad.valor} meta={data.severidad.meta} estado={data.severidad.estado} />
          <KpiMetric label="INCIDENCIA" valor={data.incidencia.valor} meta={data.incidencia.meta} estado={data.incidencia.estado} />
          <KpiMetric label="AUSENTISMO" valor={data.ausentismo.valor} meta={data.ausentismo.meta} unidad="%" estado={data.ausentismo.estado} />
        </div>
        {/* Chart */}
        <div className="acc-chart-area">
          <div className="acc-chart-title">Tendencia últimos 12 meses</div>
          <div className="acc-chart-wrap">
            <canvas ref={chartRef} />
          </div>
        </div>
      </div>
    </div>
  );
}

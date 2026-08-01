import React, { useEffect, useRef } from 'react';
import { Chart, BarController, BarElement, CategoryScale, LinearScale, Tooltip } from 'chart.js';
import { ChevronDown } from 'lucide-react';
import './DetalleEstandar.css';

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip);

function wrapText(text, maxLen = 45) {
  if (!text) return [];
  const words = text.split(' ');
  const lines = [];
  let currentLine = '';

  words.forEach(word => {
    if ((currentLine + word).length > maxLen) {
      lines.push(currentLine.trim());
      currentLine = word + ' ';
    } else {
      currentLine += word + ' ';
    }
  });
  if (currentLine) lines.push(currentLine.trim());
  return lines;
}

function getBarColor(item) {
  if (item.valor === 100) return '#22c55e';
  if (item.valor === 0) {
    if (item.noAplica) return '#9ca3af';
    return '#ef4444';
  }
  return '#f59e0b';
}

function getBadgeConfig(pct) {
  if (pct > 85) {
    return { level: 'Aceptable', color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0', labelColor: '#16a34a' };
  }
  if (pct >= 60) {
    return { level: 'Moderado', color: '#d97706', bg: '#fef3c7', border: '#fde68a', labelColor: '#d97706' };
  }
  return { level: 'Crítico', color: '#dc2626', bg: '#fee2e2', border: '#fca5a5', labelColor: '#dc2626' };
}

export default function DetalleEstandar({ estandares, detalleEstandares, selectedId, onSelectId }) {
  const chartRef = useRef(null);
  const instanceRef = useRef(null);
  const detalle = detalleEstandares[selectedId] || detalleEstandares[3];

  useEffect(() => {
    if (!chartRef.current || !detalle) return;
    if (instanceRef.current) instanceRef.current.destroy();

    const ctx = chartRef.current.getContext('2d');

    // Plugin for drawing percentages above/inside bars safely
    const valueLabelsPlugin = {
      id: 'valueLabelsPlugin',
      afterDatasetsDraw(chart) {
        const { ctx } = chart;
        chart.data.datasets.forEach((dataset, i) => {
          const meta = chart.getDatasetMeta(i);
          meta.data.forEach((bar, index) => {
            const val = dataset.data[index];
            if (val !== undefined && val !== null) {
              ctx.save();
              ctx.font = 'bold 8.5px system-ui, sans-serif';
              
              // If bar is too tall, place label inside the bar in white
              let yPos = bar.y - 4;
              if (yPos < 12) {
                yPos = bar.y + 11;
                ctx.fillStyle = '#ffffff';
              } else {
                ctx.fillStyle = '#334155';
              }
              
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillText(`${val}%`, bar.x, yPos);
              ctx.restore();
            }
          });
        });
      }
    };

    instanceRef.current = new Chart(chartRef.current, {
      type: 'bar',
      data: {
        labels: detalle.criterios.map(c => c.id),
        datasets: [{
          data: detalle.criterios.map(c => c.valor),
          backgroundColor: detalle.criterios.map(c => getBarColor(c)),
          borderRadius: { topLeft: 6, topRight: 6, bottomLeft: 0, bottomRight: 0 },
          borderSkipped: false,
          maxBarThickness: 28,
          minBarLength: 3,
        }],
      },
      plugins: [valueLabelsPlugin],
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        onHover: (event, activeElements, chart) => {
          const points = chart.getElementsAtEventForMode(event, 'index', { intersect: false }, true);
          if (points && points.length > 0) {
            chart.canvas.style.cursor = 'pointer';
          } else {
            chart.canvas.style.cursor = 'default';
          }
        },
        layout: {
          padding: { top: 14, left: 0, right: 0, bottom: 0 }
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#0f172a',
            padding: 10,
            titleFont: { size: 10, weight: 'bold' },
            bodyFont: { size: 10 },
            displayColors: false,
            callbacks: {
              title: () => null,
              label: (ctx) => {
                const index = ctx.dataIndex;
                const criterio = detalle.criterios[index];
                const desc = criterio.descripcion || `Numeral ${criterio.id}`;
                return wrapText(desc, 50);
              }
            }
          }
        },
        scales: {
          y: {
            display: false,
            min: 0,
            max: 125
          },
          x: {
            grid: { display: false },
            ticks: { font: { size: 9, weight: '600' }, color: '#475569' }
          }
        },
        animation: { duration: 800, easing: 'easeInOutQuart' }
      },
    });

    return () => { if (instanceRef.current) instanceRef.current.destroy(); };
  }, [detalle]);

  if (!detalle) return null;

  const badgeConfig = getBadgeConfig(detalle.cumplimiento);

  return (
    <div className="card de-card">
      <div className="card-title">
        CUMPLIMIENTO POR ESTÁNDAR (Detalle)
        <span className="info-icon" title="Detalle de criterios del estándar seleccionado">ℹ</span>
      </div>

      {/* Selector */}
      <div className="de-top">
        <div className="de-selector">
          <select
            value={selectedId}
            onChange={(e) => onSelectId(Number(e.target.value))}
            className="de-select"
          >
            {estandares.map(e => (
              <option key={e.id} value={e.id}>{e.id}. {e.nombre}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Chart */}
      <div className="de-chart-wrap">
        <canvas ref={chartRef} />
      </div>

      {/* Resumen */}
      <div className="de-resumen-container">
        <div className="de-resumen-left">
          <div className="de-resumen-title">RESUMEN GENERAL</div>
          <div className="de-resumen-grid">
            <table className="de-resumen-table">
              <tbody>
                <tr>
                  <td className="de-res-label">Criterios Evaluados</td>
                  <td className="de-res-val">{detalle.criteriosEvaluados}</td>
                </tr>
                <tr>
                  <td className="de-res-label" style={{color:'#16a34a'}}>Cumplen</td>
                  <td className="de-res-val" style={{color:'#16a34a'}}>{detalle.cumplen}</td>
                </tr>
                <tr>
                  <td className="de-res-label" style={{color:'#dc2626'}}>No Cumplen</td>
                  <td className="de-res-val" style={{color:'#dc2626'}}>{detalle.noCumplen}</td>
                </tr>
              </tbody>
            </table>

            <table className="de-resumen-table">
              <tbody>
                <tr>
                  <td className="de-res-label" style={{color:'#d97706'}}>En Proceso</td>
                  <td className="de-res-val" style={{color:'#d97706'}}>{detalle.enProceso}</td>
                </tr>
                <tr>
                  <td className="de-res-label" style={{color:'#9ca3af'}}>No Aplica</td>
                  <td className="de-res-val" style={{color:'#9ca3af'}}>{detalle.noAplica}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="de-resumen-divider" />
        <div className="de-resumen-right">
          <div className="de-big-pct-badge" style={{ backgroundColor: badgeConfig.bg }}>
            <span className="de-big-pct" style={{ color: badgeConfig.color }}>{detalle.cumplimiento}%</span>
            <span className="de-big-pct-label" style={{ color: badgeConfig.labelColor }}>{badgeConfig.level}</span>
          </div>
        </div>
      </div>

      <button className="btn-link" style={{ marginTop: 14 }}>
        <span>Ver todos los criterios del estándar</span>
        <span>→</span>
      </button>
    </div>
  );
}

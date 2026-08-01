import React, { useEffect, useRef } from 'react';
import { Chart, DoughnutController, ArcElement, Tooltip } from 'chart.js';
import './MapaEstandares.css';

Chart.register(DoughnutController, ArcElement, Tooltip);

const COLORS = [
  '#2563eb', // 1 Recursos (Azul)
  '#16a34a', // 2 Gestión Integral (Verde)
  '#d97706', // 3 Gestión de la Salud (Amarillo/Ámbar con alto contraste)
  '#ea580c', // 4 Gestión de Peligros (Naranja Intenso)
  '#dc2626', // 5 Gestión de Amenazas (Rojo)
  '#0d9488', // 6 Gestión y Resultados / Verificación (Verde agua)
  '#7c3aed', // 7 Mejoramiento (Morado)
];

const PESOS = {
  1: 10,
  2: 15,
  3: 20,
  4: 30,
  5: 10,
  6: 5,
  7: 10
};

export default function MapaEstandares({ estandares, onSelect, selectedId }) {
  const chartRef = useRef(null);
  const instanceRef = useRef(null);

  useEffect(() => {
    if (!chartRef.current) return;
    if (instanceRef.current) instanceRef.current.destroy();

    const sliceLabelsPlugin = {
      id: 'sliceLabelsPlugin',
      afterDraw(chart) {
        const { ctx } = chart;
        const meta = chart.getDatasetMeta(0);
        if (!meta || !meta.data) return;

        meta.data.forEach((element, index) => {
          const e = estandares[index];
          if (!e) return;

          const angle = (element.startAngle + element.endAngle) / 2;
          const midRadius = (element.outerRadius + element.innerRadius) / 2;

          const x = element.x + Math.cos(angle) * midRadius;
          const y = element.y + Math.sin(angle) * midRadius;

          ctx.save();
          ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
          ctx.shadowBlur = 3;
          ctx.fillStyle = '#ffffff';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';

          // Número arriba
          ctx.font = 'bold 11px system-ui, sans-serif';
          ctx.fillText(String(e.id), x, y - 6);

          // Nombre abajo (con salto de línea si es largo)
          ctx.font = '700 7px system-ui, sans-serif';
          let nameStr = (e.nombre || '').replace(/^\d+\.\s*/, '').toUpperCase().trim();
          
          if (nameStr.includes('RECURSOS')) nameStr = 'RECURSOS';
          else if (nameStr.includes('INTEGRAL')) nameStr = 'GESTIÓN INTEGRAL';
          else if (nameStr.includes('SALUD')) nameStr = 'GESTIÓN DE LA SALUD';
          else if (nameStr.includes('PELIGROS') || nameStr.includes('RIESGOS')) nameStr = 'GESTIÓN DE PELIGROS';
          else if (nameStr.includes('AMENAZAS')) nameStr = 'GESTIÓN DE AMENAZAS';
          else if (nameStr.includes('RESULTADOS') || nameStr.includes('VERIFICAC')) nameStr = 'GESTIÓN Y RESULTADOS';
          else if (nameStr.includes('MEJORA')) nameStr = 'MEJORAMIENTO';

          const words = nameStr.split(' ');
          if (words.length >= 3) {
            ctx.fillText(`${words[0]} ${words[1]}`, x, y + 2);
            ctx.fillText(words.slice(2).join(' '), x, y + 9);
          } else if (words.length === 2) {
            ctx.fillText(words[0], x, y + 2);
            ctx.fillText(words[1], x, y + 9);
          } else {
            ctx.fillText(words[0], x, y + 4);
          }

          // Porcentaje externo
          const peso = PESOS[e.id] || 0;
          
          // La gráfica por defecto anima el "offset" de la tajada al hacer hover
          // `element.x` y `element.y` ya vienen desplazados (offset) por el plugin interno de Chart.js
          const outerRadiusOffset = element.outerRadius + 14; 
          const outX = element.x + Math.cos(angle) * outerRadiusOffset;
          const outY = element.y + Math.sin(angle) * outerRadiusOffset;

          ctx.shadowBlur = 0; 
          ctx.fillStyle = COLORS[index % COLORS.length]; 
          ctx.font = '900 11px system-ui, sans-serif';
          ctx.fillText(`${peso}%`, outX, outY);

          ctx.restore();
        });
      }
    };

    instanceRef.current = new Chart(chartRef.current, {
      type: 'doughnut',
      data: {
        labels: estandares.map(e => e.nombre),
        datasets: [{
          data: estandares.map(() => 1),
          backgroundColor: COLORS.slice(0, estandares.length),
          borderWidth: 2,
          borderColor: '#ffffff',
          hoverBorderWidth: 2,
          hoverBorderColor: '#ffffff',
          hoverOffset: 8,
          cutout: '40%',
          offset: estandares.map(e => (e.id === selectedId ? 6 : 0)),
        }],
      },
      plugins: [sliceLabelsPlugin],
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: 22
        },
        plugins: {
          legend: { display: false },
          tooltip: { enabled: false }
        },
        onHover: (event, activeElements, chart) => {
          if (activeElements && activeElements.length > 0) {
            chart.canvas.style.cursor = 'pointer';
          } else {
            chart.canvas.style.cursor = 'default';
          }
        },
        onClick: (event, elements) => {
          if (elements.length > 0) {
            const idx = elements[0].index;
            onSelect(estandares[idx].id);
          }
        },
        animation: { animateRotate: true, duration: 800 },
      },
    });

    return () => { if (instanceRef.current) instanceRef.current.destroy(); };
  }, [estandares]);

  return (
    <div className="card me-card">
      <div className="card-title">
        MAPA DE ESTÁNDARES
        <span className="info-icon" title="Haga clic en un estándar para ver el detalle">ℹ</span>
      </div>

      <div className="me-body">
        <div className="me-donut-wrap">
          <canvas ref={chartRef} />
          <div className="me-center-circle">
            <span className="me-count">{estandares.length}</span>
            <span className="me-text">ESTÁNDARES</span>
          </div>
        </div>
      </div>

      <div className="me-hint-wrap">
        <button className="btn-link">
          <span>Ver detalle por estándar</span>
          <span>→</span>
        </button>
      </div>
    </div>
  );
}

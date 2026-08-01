import React, { useEffect, useRef } from 'react';
import { Chart, DoughnutController, ArcElement, Tooltip } from 'chart.js';
import { Trophy, AlertTriangle, ShieldCheck, Clock, ArrowRight } from 'lucide-react';
import './CumplimientoGlobal.css';

Chart.register(DoughnutController, ArcElement, Tooltip);

function formatFechaLarga(fechaStr) {
  if (!fechaStr) return 'Agosto 1 de 2026';
  const parts = fechaStr.split('/');
  if (parts.length === 3) {
    const day = parts[0];
    const monthIndex = parseInt(parts[1], 10) - 1;
    const year = parts[2];
    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const mesNombre = meses[monthIndex] || 'Agosto';
    return `${mesNombre} ${day} de ${year}`;
  }
  return fechaStr;
}

export default function CumplimientoGlobal({ data }) {
  const chartRef = useRef(null);
  const instanceRef = useRef(null);

  const pct = data.porcentaje || 0;

  // Lógica dinámica de nivel, color e ícono
  // Lógica dinámica según umbrales del usuario:
  // Crítico < 60% (Rojo), Moderado 60% - 85% (Naranja), Aceptable > 85% (Verde)
  let statusConfig;

  if (pct > 85) {
    statusConfig = {
      label: 'ACEPTABLE',
      badgeText: 'Nivel Aceptable',
      actionMessage: 'Mantenga y mejore continuamente con auditorías y capacitaciones.',
      color: '#15803d',
      bgColor: '#dcfce7',
      donutColor: '#22c55e',
      donutBg: '#e8f5e9',
      Icon: Trophy,
    };
  } else if (pct >= 60) {
    statusConfig = {
      label: 'MODERADO',
      badgeText: 'Nivel Moderado',
      actionMessage: 'Formule un plan de mejora con metas para alcanzar el nivel aceptable.',
      color: '#d97706',
      bgColor: '#fef3c7',
      donutColor: '#f59e0b',
      donutBg: '#fef3c7',
      Icon: ShieldCheck,
    };
  } else {
    statusConfig = {
      label: 'CRÍTICO',
      badgeText: 'Nivel Crítico',
      actionMessage: 'Elabore e implemente un plan de mejora inmediato.',
      color: '#b91c1c',
      bgColor: '#fee2e2',
      donutColor: '#ef4444',
      donutBg: '#fef2f2',
      Icon: AlertTriangle,
    };
  }

  const { Icon } = statusConfig;

  useEffect(() => {
    if (!chartRef.current) return;

    if (instanceRef.current) instanceRef.current.destroy();

    instanceRef.current = new Chart(chartRef.current, {
      type: 'doughnut',
      data: {
        datasets: [{
          data: [pct, 100 - pct],
          backgroundColor: [statusConfig.donutColor, statusConfig.donutBg],
          borderWidth: 0,
          borderRadius: [6, 0],
          cutout: '78%',
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { tooltip: { enabled: false }, legend: { display: false } },
        animation: { animateRotate: true, duration: 1200, easing: 'easeInOutQuart' },
      },
    });

    return () => { if (instanceRef.current) instanceRef.current.destroy(); };
  }, [pct, statusConfig.donutColor, statusConfig.donutBg]);

  return (
    <div className="card cg-card">
      <div className="cg-header-group">
        <div className="card-title" style={{ marginBottom: 2 }}>
          CUMPLIMIENTO GLOBAL DEL SG-SST
          <span className="info-icon" title="Porcentaje global de cumplimiento del sistema según Resolución 0312">ℹ</span>
        </div>
        <span className="cg-subtitle-date">Última actualización: {formatFechaLarga(data.ultimaEvaluacion)}</span>
      </div>

      <div className="cg-body">
        <div className="cg-top-row">
          {/* Donut Chart (Izquierda) */}
          <div className="cg-donut-wrap">
            <canvas ref={chartRef} />
            <div className="cg-donut-label">
              <span className="cg-pct" style={{ color: statusConfig.color }}>{pct}%</span>
              <span className="cg-sublabel">Cumplimiento<br />General</span>
            </div>
          </div>

          {/* Panel Informativo: Texto e Indicador */}
          <div className="cg-info">
            <span className="cg-intro-text">Su sistema de gestión se encuentra en</span>
            <div className="cg-badge" style={{ backgroundColor: statusConfig.bgColor, color: statusConfig.color }}>
              <Icon size={15} />
              <span>{statusConfig.badgeText}</span>
            </div>
          </div>
        </div>
        
        {/* Mensaje de Acción en caja de alerta sutil */}
        <div className="cg-action-box" style={{ backgroundColor: statusConfig.bgColor, borderColor: statusConfig.color }}>
          <Icon size={15} style={{ color: statusConfig.color, flexShrink: 0 }} />
          <p className="cg-action-msg" style={{ color: statusConfig.color }}>
            {statusConfig.actionMessage}
          </p>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { menuItems } from '../../data/dashboardData';
import {
  LayoutDashboard, ClipboardCheck, ListChecks, CalendarDays,
  BookOpen, DollarSign, GraduationCap, HeartPulse, Search,
  Wrench, AlertTriangle, FileBarChart, FolderOpen, Settings,
  User, Shield
} from 'lucide-react';
import logoImg from '../../assets/logo.png';
import './Sidebar.css';

const iconMap = {
  LayoutDashboard, ClipboardCheck, ListChecks, CalendarDays,
  BookOpen, DollarSign, GraduationCap, HeartPulse, Search,
  Wrench, AlertTriangle, FileBarChart, FolderOpen, Settings,
};

const menuSections = [
  {
    title: 'PRINCIPAL',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
      { id: 'evaluacion', label: 'Evaluación SG-SST', icon: 'ClipboardCheck' },
      { id: 'criterios', label: 'Criterios y Estándares', icon: 'ListChecks' },
    ]
  },
  {
    title: 'GESTIÓN Y CONTROL',
    items: [
      { id: 'plan-trabajo', label: 'Plan de Trabajo', icon: 'CalendarDays' },
      { id: 'programas', label: 'Programas', icon: 'BookOpen' },
      { id: 'presupuesto', label: 'Presupuesto', icon: 'DollarSign' },
      { id: 'capacitaciones', label: 'Capacitaciones', icon: 'GraduationCap' },
      { id: 'vigilancia', label: 'Vigilancia Epidemiológica', icon: 'HeartPulse' },
      { id: 'inspecciones', label: 'Inspecciones', icon: 'Search' },
      { id: 'mantenimiento', label: 'Mantenimiento', icon: 'Wrench' },
      { id: 'accidentalidad', label: 'Accidentalidad', icon: 'AlertTriangle' },
    ]
  },
  {
    title: 'REPORTES Y SISTEMA',
    items: [
      { id: 'reportes', label: 'Reportes', icon: 'FileBarChart' },
      { id: 'documentos', label: 'Documentos', icon: 'FolderOpen' },
      { id: 'configuracion', label: 'Configuración', icon: 'Settings' },
    ]
  }
];

export default function Sidebar({ activeItem, onItemClick }) {
  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="logo-circle-wrap">
          <img src={logoImg} alt="Safe Group Logo" className="logo-img-circle" />
        </div>
        <div className="logo-text">
          <div className="logo-brand-row">
            <span className="logo-brand">SAFE GROUP</span>
            <span className="logo-badge">SG-SST</span>
          </div>
          <span className="logo-sub">Especialistas en SG-SST</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {menuSections.map((sec) => (
          <div key={sec.title} className="sidebar-section">
            <div className="sidebar-section-title">{sec.title}</div>
            {sec.items.map((item) => {
              const Icon = iconMap[item.icon] || LayoutDashboard;
              const isActive = activeItem === item.id;
              return (
                <button
                  key={item.id}
                  className={`sidebar-item ${isActive ? 'active' : ''}`}
                  onClick={() => onItemClick(item.id)}
                  title={item.label}
                >
                  <Icon size={15} strokeWidth={isActive ? 2.5 : 2} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer User */}
      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="user-avatar">
            <User size={14} />
          </div>
          <div className="user-info">
            <div className="user-name-row">
              <span className="user-name">Ricardo López</span>
              <span className="user-online-dot" title="En línea" />
            </div>
            <span className="user-role">Administrador del Sistema</span>
          </div>
        </div>
        <div className="sidebar-version">Versión 1.0.0</div>
      </div>
    </aside>
  );
}

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

export default function Sidebar({ activeItem, onItemClick }) {
  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="logo-circle-wrap">
          <img src={logoImg} alt="Safe Group Logo" className="logo-img-circle" />
        </div>
        <div className="logo-text">
          <span className="logo-brand">SAFE GROUP</span>
          <span className="logo-sub">Especialistas en SG-SST</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {menuItems.map((item) => {
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
      </nav>

      {/* Footer User */}
      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="user-avatar">
            <User size={14} />
          </div>
          <div className="user-info">
            <span className="user-name">Ricardo López</span>
            <span className="user-role">Administrador del Sistema</span>
          </div>
        </div>
        <div className="sidebar-version">Versión 1.0.0</div>
      </div>
    </aside>
  );
}

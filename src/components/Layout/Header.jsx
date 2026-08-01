import React, { useState } from 'react';
import { Calendar, Building2, Filter, ChevronDown, RefreshCw, Database, Check, AlertCircle, Menu } from 'lucide-react';
import { Shield } from 'lucide-react';
import logoImg from '../../assets/logo.png';
import './Header.css';

const empresas = ['Empresa Demo S.A.S.', 'Empresa A Ltda.', 'Empresa B S.A.S.'];
const procesos = ['Todos los procesos', 'Proceso 1', 'Proceso 2', 'Proceso 3'];

export default function Header({
  fecha,
  empresa,
  onEmpresaChange,
  proceso,
  onProcesoChange,
  sheetId,
  onSyncSheet,
  isLoadingSheet,
  lastSyncTime,
  syncError,
  onMenuToggle
}) {
  const [showEmpresa, setShowEmpresa] = useState(false);
  const [showProceso, setShowProceso] = useState(false);
  const [showSheetModal, setShowSheetModal] = useState(false);
  const [inputSheetId, setInputSheetId] = useState(sheetId || '');

  const handleSyncSubmit = (e) => {
    e.preventDefault();
    onSyncSheet(inputSheetId);
    setShowSheetModal(false);
  };

  return (
    <header className="app-header">
      {/* Botón de Menú Móvil */}
      <button className="mobile-menu-btn" onClick={onMenuToggle} aria-label="Abrir menú">
        <Menu size={24} />
      </button>

      {/* Titulo */}
      <div className="header-titles">
        <h1 className="header-title">SISTEMA DE GESTIÓN DE SEGURIDAD Y SALUD EN EL TRABAJO</h1>
        <span className="header-subtitle">DASHBOARD GENERAL</span>
      </div>

      {/* Filtros / Acciones */}
      <div className="header-filters">
        {/* Badge de Estado de Conexión a Google Sheets */}
        <button
          className={`sheet-status-pill ${sheetId ? 'connected' : 'disconnected'} ${isLoadingSheet ? 'loading' : ''}`}
          onClick={() => setShowSheetModal(true)}
          title={sheetId ? 'Google Sheets Conectado - Clic para cambiar o re-sincronizar' : 'Conectar con Google Sheets'}
        >
          <span className={`status-dot ${sheetId ? 'green' : 'red'}`} />
          <span>{sheetId ? 'Conectado' : 'Desconectado'}</span>
          <RefreshCw size={12} className={isLoadingSheet ? 'spin' : ''} style={{ marginLeft: 2 }} />
        </button>
      </div>

      {/* MODAL CONFIGURACIÓN GOOGLE SHEETS */}
      {showSheetModal && (
        <div className="modal-overlay" onClick={() => setShowSheetModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <Database size={18} color="#22c55e" />
              <h3>Conectar con Google Sheets</h3>
            </div>
            
            <form onSubmit={handleSyncSubmit}>
              <div className="modal-body">
                <label className="input-label">URL o ID de tu Google Sheet:</label>
                <input
                  type="text"
                  className="modal-input"
                  placeholder="https://docs.google.com/spreadsheets/d/1ABC.../edit"
                  value={inputSheetId}
                  onChange={e => setInputSheetId(e.target.value)}
                  required
                />

                <div className="modal-instructions">
                  <strong>Paso requerido en tu Google Sheet:</strong>
                  <ol>
                    <li>Abre tu hoja de cálculo en Google Sheets.</li>
                    <li>Haz clic en <strong>Archivo &gt; Compartir &gt; Publicar en la web</strong> (o pon los permisos en "Cualquier persona con el enlace").</li>
                    <li>Copia el enlace de la barra de direcciones y pégalo arriba.</li>
                  </ol>
                </div>

                {syncError && (
                  <div className="modal-error">
                    <AlertCircle size={14} />
                    <span>{syncError}</span>
                  </div>
                )}

                {lastSyncTime && !syncError && (
                  <div className="modal-success">
                    <Check size={14} />
                    <span>Última sincronización exitosa: {lastSyncTime}</span>
                  </div>
                )}
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setShowSheetModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary" disabled={isLoadingSheet}>
                  {isLoadingSheet ? 'Cargando...' : 'Sincronizar Datos'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
}

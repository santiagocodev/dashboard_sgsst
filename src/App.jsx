import React, { useState, useEffect } from 'react';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import CumplimientoGlobal from './components/Dashboard/CumplimientoGlobal';
import CicloPhva from './components/Dashboard/CicloPhva';
import ResumenGeneral from './components/Dashboard/ResumenGeneral';
import CumplimientoEstandar from './components/Dashboard/CumplimientoEstandar';
import MapaEstandares from './components/Dashboard/MapaEstandares';
import DetalleEstandar from './components/Dashboard/DetalleEstandar';
import Presupuesto from './components/Dashboard/Presupuesto';
import Capacitaciones from './components/Dashboard/Capacitaciones';
import VigilanciaEpidemiologica from './components/Dashboard/VigilanciaEpidemiologica';
import Inspecciones from './components/Dashboard/Inspecciones';
import Mantenimiento from './components/Dashboard/Mantenimiento';
import RiesgosCriticos from './components/Dashboard/RiesgosCriticos';
import Accidentalidad from './components/Dashboard/Accidentalidad';
import AlertasPendientes from './components/Dashboard/AlertasPendientes';
import { dashboardData as initialData } from './data/dashboardData';
import { fetchSheetData, mapSheetToDashboardData } from './services/googleSheets';
import { Shield } from 'lucide-react';
import './App.css';

export default function App() {
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [selectedEstandar, setSelectedEstandar] = useState(3);
  const [empresa, setEmpresa] = useState(initialData.empresa);
  const [proceso, setProceso] = useState('Todos los procesos');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Estado de Datos y Google Sheets
  const [currentData, setCurrentData] = useState(initialData);
  const [sheetId, setSheetId] = useState(() => localStorage.getItem('sgsst_sheet_id') || 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSnTVND_lN19n-I0a56VlQOOwnUdL_dr8eavrihJn6udl3OksQPa9eQTZvfI8k1xLLNIoD109xkwQZL/pubhtml');
  const [isLoadingSheet, setIsLoadingSheet] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState('');
  const [syncError, setSyncError] = useState('');

  // Carga inicial si hay Sheet ID guardado
  useEffect(() => {
    if (sheetId) {
      syncWithGoogleSheets(sheetId);
    }
  }, []);

  const syncWithGoogleSheets = async (inputUrlOrId) => {
    if (!inputUrlOrId || inputUrlOrId.trim() === '') {
      setSyncError('Por favor introduce un enlace o ID válido de Google Sheets');
      return;
    }

    setIsLoadingSheet(true);
    setSyncError('');

    try {
      const { rows } = await fetchSheetData(inputUrlOrId);
      const updatedData = mapSheetToDashboardData(rows, initialData);

      setCurrentData(updatedData);
      setSheetId(inputUrlOrId.trim());
      localStorage.setItem('sgsst_sheet_id', inputUrlOrId.trim());
      setLastSyncTime(new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }));
    } catch (err) {
      console.error('Error sincronizando con Google Sheets:', err);
      setSyncError(err.message || 'Error al conectar con la hoja de cálculo');
    } finally {
      setIsLoadingSheet(false);
    }
  };

  const handleEstandarSelect = (id) => {
    setSelectedEstandar(id);
  };

  return (
    <div className="app-layout">
      <Sidebar activeItem={activeMenu} onItemClick={setActiveMenu} isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
      <div className="main-wrapper">
        <Header
          onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          fecha={currentData.fechaCorte}
          empresa={empresa}
          onEmpresaChange={setEmpresa}
          proceso={proceso}
          onProcesoChange={setProceso}
          sheetId={sheetId}
          onSyncSheet={syncWithGoogleSheets}
          isLoadingSheet={isLoadingSheet}
          lastSyncTime={lastSyncTime}
          syncError={syncError}
        />

        <div className="content-area">
          {/* ====== ROW 1: Cumplimiento Global + PHVA + Resumen (ALIMENTADOS POR GSHEETS) ====== */}
          <div className="dashboard-row row-1">
            <CumplimientoGlobal data={currentData.cumplimientoGlobal} />
            <CicloPhva data={currentData.phva} />
            <ResumenGeneral data={currentData.resumenGeneral} />
          </div>

          {/* ====== ROW 2: Por Estándar + Mapa + Detalle (ALIMENTADOS POR GSHEETS) ====== */}
          <div className="dashboard-row row-2">
            <CumplimientoEstandar
              estandares={currentData.estandares}
              onSelect={handleEstandarSelect}
              selectedId={selectedEstandar}
            />
            <MapaEstandares
              estandares={currentData.estandares}
              onSelect={handleEstandarSelect}
              selectedId={selectedEstandar}
            />
            <DetalleEstandar
              estandares={currentData.estandares}
              detalleEstandares={currentData.detalleEstandares}
              selectedId={selectedEstandar}
              onSelectId={handleEstandarSelect}
            />
          </div>

          {/* ====== ROW 3: Presupuesto + Capacitaciones + Vigilancia + Inspecciones + Mantenimiento ====== */}
          <div className="dashboard-row row-3">
            <Presupuesto data={currentData.presupuesto} />
            <Capacitaciones data={currentData.capacitaciones} />
            <VigilanciaEpidemiologica data={currentData.vigilanciaEpidemiologica} />
            <Inspecciones data={currentData.inspecciones} />
            <Mantenimiento data={currentData.mantenimiento} />
          </div>

          {/* ====== ROW 4: Riesgos + Accidentalidad + Alertas ====== */}
          <div className="dashboard-row row-4">
            <RiesgosCriticos data={currentData.riesgosCriticos} />
            <Accidentalidad data={currentData.accidentalidad} />
            <AlertasPendientes data={currentData.alertas} />
          </div>
        </div>

        {/* Footer */}
        <footer className="app-footer">
          <Shield size={12} color="#22c55e" />
          <span>SG-SST • Cumplimiento Resolución 0312 de 2019 • Mejora continua para la seguridad y salud de todos</span>
        </footer>
      </div>
    </div>
  );
}

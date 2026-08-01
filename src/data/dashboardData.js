// ============================================================
// DATOS MOCK - Dashboard SG-SST Safe Group
// ============================================================

export const dashboardData = {
  empresa: 'Empresa Demo S.A.S.',
  fechaCorte: '14/06/2026',
  version: '1.0.0',
  responsable: 'Ricardo López',
  cargo: 'Administrador del Sistema',

  // ---- CUMPLIMIENTO GLOBAL ----
  cumplimientoGlobal: {
    porcentaje: 84,
    nivel: 'ACEPTABLE',
    ultimaEvaluacion: '14/06/2026',
  },

  // ---- RESUMEN GENERAL ----
  resumenGeneral: {
    estandaresEvaluados: 7,
    criteriosEvaluados: 60,
    cumplen: 50,
    noCumplen: 7,
    enProceso: 3,
    noAplica: 0,
  },

  // ---- CICLO PHVA ----
  phva: [
    { label: 'PLANEAR', valor: 59, cumplenItems: 13, totalItems: 22, color: '#518bd6' },
    { label: 'HACER', valor: 87, cumplenItems: 27, totalItems: 31, color: '#33a55c' },
    { label: 'VERIFICAR', valor: 75, cumplenItems: 6, totalItems: 8, color: '#f5b53a' },
    { label: 'ACTUAR', valor: 75, cumplenItems: 3, totalItems: 4, color: '#d56362' },
  ],

  // ---- ESTÁNDARES ----
  estandares: [
    { id: 1, nombre: 'Recursos', porcentaje: 75, cumplenItems: 6, totalItems: 8, color: '#22C55E' },
    { id: 2, nombre: 'Gestión Integral', porcentaje: 93, cumplenItems: 14, totalItems: 15, color: '#22C55E' },
    { id: 3, nombre: 'Gestión de la Salud', porcentaje: 80, cumplenItems: 8, totalItems: 10, color: '#F59E0B' },
    { id: 4, nombre: 'Gestión de Peligros', porcentaje: 87, cumplenItems: 13, totalItems: 15, color: '#22C55E' },
    { id: 5, nombre: 'Gestión de Amenazas', porcentaje: 100, cumplenItems: 3, totalItems: 3, color: '#22C55E' },
    { id: 6, nombre: 'Gestión y Resultados', porcentaje: 75, cumplenItems: 3, totalItems: 4, color: '#F59E0B' },
    { id: 7, nombre: 'Mejoramiento', porcentaje: 100, cumplenItems: 5, totalItems: 5, color: '#22C55E' },
  ],

  // ---- DETALLE POR ESTÁNDAR ----
  detalleEstandares: {
    3: {
      nombre: 'GESTIÓN DE LA SALUD',
      cumplimiento: 78,
      criteriosEvaluados: 8,
      cumplen: 6,
      noCumplen: 1,
      enProceso: 1,
      noAplica: 0,
      criterios: [
        { id: '3.1.1', valor: 95, cumple: true },
        { id: '3.1.2', valor: 80, cumple: true },
        { id: '3.1.3', valor: 70, cumple: true },
        { id: '3.2.1', valor: 100, cumple: true },
        { id: '3.2.2', valor: 65, cumple: false },
        { id: '3.3.1', valor: 85, cumple: true },
        { id: '3.3.2', valor: 45, enProceso: true },
        { id: '3.4.1', valor: 75, cumple: true },
      ],
    },
    1: {
      nombre: 'RECURSOS',
      cumplimiento: 92,
      criteriosEvaluados: 10,
      cumplen: 9,
      noCumplen: 1,
      enProceso: 0,
      noAplica: 0,
      criterios: [
        { id: '1.1.1', valor: 100, cumple: true },
        { id: '1.1.2', valor: 95, cumple: true },
        { id: '1.1.3', valor: 90, cumple: true },
        { id: '1.2.1', valor: 85, cumple: true },
        { id: '1.2.2', valor: 80, cumple: true },
        { id: '1.3.1', valor: 75, cumple: false },
        { id: '1.3.2', valor: 95, cumple: true },
        { id: '1.4.1', valor: 100, cumple: true },
        { id: '1.4.2', valor: 92, cumple: true },
        { id: '1.4.3', valor: 88, cumple: true },
      ],
    },
  },

  // ---- PRESUPUESTO ----
  presupuesto: {
    total: 120000000,
    ejecutado: 80400000,
    disponible: 39600000,
    porcentaje: 67,
  },

  // ---- CAPACITACIONES ----
  capacitaciones: {
    cobertura: { valor: 92, meta: 90 },
    asistenciaPromedio: { valor: 87, meta: 85 },
    cumplimientoPrograma: 89,
    metaPrograma: 85,
  },

  // ---- VIGILANCIA EPIDEMIOLÓGICA ----
  vigilanciaEpidemiologica: {
    osteomuscular: {
      valor: 85,
      nivelRiesgo: 'Moderado',
      color: '#F59E0B',
    },
    psicosocial: {
      valor: 82,
      nivelRiesgo: 'Moderado',
      color: '#F59E0B',
    },
  },

  // ---- INSPECCIONES ----
  inspecciones: {
    porcentaje: 93,
    planeadas: 150,
    realizadas: 140,
    pendientes: 10,
  },

  // ---- MANTENIMIENTO ----
  mantenimiento: {
    porcentaje: 88,
    planeadas: 120,
    ejecutadas: 106,
    pendientes: 14,
  },

  // ---- RIESGOS CRÍTICOS ----
  riesgosCriticos: [
    { tipo: 'Biomecánico', porcentaje: 32, color: '#EF4444' },
    { tipo: 'Locativo', porcentaje: 25, color: '#F97316' },
    { tipo: 'Psicosocial', porcentaje: 18, color: '#F59E0B' },
    { tipo: 'Químico', porcentaje: 10, color: '#EAB308' },
    { tipo: 'Mecánico', porcentaje: 8, color: '#84CC16' },
    { tipo: 'Eléctrico', porcentaje: 7, color: '#22C55E' },
  ],

  // ---- ACCIDENTALIDAD ----
  accidentalidad: {
    frecuencia: { valor: 12.5, meta: 20, estado: 'Aceptable' },
    severidad: { valor: 98.3, meta: 120, estado: 'Aceptable' },
    incidencia: { valor: 8.7, meta: 10, estado: 'Aceptable' },
    ausentismo: { valor: 3.2, meta: 4, estado: 'Aceptable' },
    tendencia: {
      labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
      frecuencia: [15, 18, 12, 14, 10, 8, 13, 11, 9, 7, 10, 12],
      severidad: [110, 130, 95, 105, 85, 75, 100, 90, 80, 70, 88, 98],
    },
  },

  // ---- ALERTAS Y PENDIENTES ----
  alertas: [
    { tipo: 'Acciones vencidas', cantidad: 7, color: '#EF4444', urgente: true },
    { tipo: 'Inspecciones pendientes', cantidad: 10, color: '#F97316', urgente: true },
    { tipo: 'Capacitaciones pendientes', cantidad: 4, color: '#F59E0B', urgente: false },
    { tipo: 'Documentos por vencer', cantidad: 5, color: '#EAB308', urgente: false },
    { tipo: 'Reportes pendientes', cantidad: 2, color: '#22C55E', urgente: false },
  ],
};

export const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
  { id: 'evaluacion', label: 'Evaluación SG-SST', icon: 'ClipboardCheck' },
  { id: 'criterios', label: 'Criterios y Estándares', icon: 'ListChecks' },
  { id: 'plan-trabajo', label: 'Plan de Trabajo', icon: 'CalendarDays' },
  { id: 'programas', label: 'Programas', icon: 'BookOpen' },
  { id: 'presupuesto', label: 'Presupuesto', icon: 'DollarSign' },
  { id: 'capacitaciones', label: 'Capacitaciones', icon: 'GraduationCap' },
  { id: 'vigilancia', label: 'Vigilancia Epidemiológica', icon: 'HeartPulse' },
  { id: 'inspecciones', label: 'Inspecciones', icon: 'Search' },
  { id: 'mantenimiento', label: 'Mantenimiento', icon: 'Wrench' },
  { id: 'accidentalidad', label: 'Accidentalidad', icon: 'AlertTriangle' },
  { id: 'reportes', label: 'Reportes', icon: 'FileBarChart' },
  { id: 'documentos', label: 'Documentos', icon: 'FolderOpen' },
  { id: 'configuracion', label: 'Configuración', icon: 'Settings' },
];

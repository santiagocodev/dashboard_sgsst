// ============================================================
// GOOGLE SHEETS SERVICE - SG-SST Dashboard
// Soporta tanto URLs normales como enlaces "Publicar en la web" (/pubhtml, /pub?output=csv)
// ============================================================

/**
 * Convierte cualquier URL de Google Sheets a la URL adecuada para descarga de datos JSON/CSV
 */
export function getFetchUrl(inputUrlOrId) {
  let str = inputUrlOrId.trim();

  // Caso 1: Enlace de "Publicar en la Web" tipo /d/e/2PACX-.../pubhtml
  if (str.includes('/d/e/2PACX-') || str.includes('/pubhtml') || str.includes('/pub')) {
    let baseUrl = str.split('?')[0].replace('/pubhtml', '/pub');
    if (!baseUrl.endsWith('/pub')) baseUrl += '/pub';
    return { type: 'published_csv', url: `${baseUrl}?output=csv` };
  }

  // Caso 2: Enlace estándar tipo /d/1ABC.../edit
  const match = str.match(/\/d\/([a-zA-Z0-9-_]+)/);
  const cleanId = match ? match[1] : str;

  return {
    type: 'gviz_json',
    url: `https://docs.google.com/spreadsheets/d/${cleanId}/gviz/tq?tqx=out:json`
  };
}

/**
 * Consulta Google Sheets (admite CSV publicado y GViz JSON)
 */
export async function fetchSheetData(inputUrlOrId) {
  const { type, url } = getFetchUrl(inputUrlOrId);

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`No se pudo obtener la hoja. Asegúrate de hacer clic en el botón "Publicar" en Google Sheets (${response.status})`);
  }

  const text = await response.text();

  if (type === 'published_csv') {
    return parseCSV(text);
  } else {
    return parseGVizJSON(text);
  }
}

/**
 * Parser de texto CSV
 */
function parseCSV(text) {
  const lines = text.split(/\r?\n/).filter(line => line.trim() !== '');
  if (lines.length === 0) throw new Error('La hoja publicada está vacía');

  const parseLine = (line) => {
    const result = [];
    let cur = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (c === '"') {
        inQuotes = !inQuotes;
      } else if (c === ',' && !inQuotes) {
        result.push(cur.trim());
        cur = '';
      } else {
        cur += c;
      }
    }
    result.push(cur.trim());
    return result;
  };

  const headers = parseLine(lines[0]);
  const rows = lines.slice(1).map(line => {
    const vals = parseLine(line);
    const obj = {};
    headers.forEach((h, idx) => {
      if (h) obj[h] = vals[idx] !== undefined ? vals[idx] : '';
    });
    return obj;
  });

  return { headers, rows };
}

/**
 * Parser de respuesta GViz JSON
 */
function parseGVizJSON(text) {
  const jsonMatch = text.match(/google\.visualization\.Query\.setResponse\(([\s\S]*)\);/);
  if (!jsonMatch) {
    throw new Error('Formato de respuesta no reconocido. Asegúrate de hacer clic en "Publicar en la web".');
  }

  const data = JSON.parse(jsonMatch[1]);
  if (data.status === 'error') {
    throw new Error(data.errors?.[0]?.detailed_message || 'Error en la consulta a Google Sheets');
  }

  const table = data.table;
  const headers = table.cols.map(col => col.label ? col.label.trim() : '');

  const rows = table.rows.map(row => {
    const obj = {};
    row.c.forEach((cell, idx) => {
      const headerName = headers[idx] || `col_${idx}`;
      obj[headerName] = cell ? (cell.v !== null ? cell.v : cell.f || '') : '';
    });
    return obj;
  });

  return { headers, rows };
}

/**
 * Mapeo flexible e inteligente de filas a la estructura del Dashboard
 */
export function mapSheetToDashboardData(rows, defaultData) {
  if (!rows || rows.length === 0) return defaultData;
  return processCriteriaRows(rows, defaultData);
}

/**
 * Parsea cualquier valor numérico/porcentaje en string a float
 */
function parseNum(val) {
  if (typeof val === 'number') return val;
  if (!val) return 0;
  let str = String(val).replace('%', '').replace(',', '.').trim();
  const n = parseFloat(str);
  return isNaN(n) ? 0 : n;
}

/**
 * Procesa la tabla de la hoja Dashboard y calcula las tarjetas según las instrucciones específicas
 */
function processCriteriaRows(rows, defaultData) {
  let totalPesoGlobal = 0;

  const phvaStats = {
    PLANEAR: { totalPeso: 0, obtenidoPeso: 0, totalItems: 0, cumplenItems: 0 },
    HACER: { totalPeso: 0, obtenidoPeso: 0, totalItems: 0, cumplenItems: 0 },
    VERIFICAR: { totalPeso: 0, obtenidoPeso: 0, totalItems: 0, cumplenItems: 0 },
    ACTUAR: { totalPeso: 0, obtenidoPeso: 0, totalItems: 0, cumplenItems: 0 },
  };

  const estandaresUnicosSet = new Set();
  const criteriosEvaluadosList = [];

  let cumplenCount = 0;
  let noCumplenCount = 0;
  let enProcesoCount = 0;
  let noAplicaCount = 0;

  const estandaresMap = {};

  rows.forEach(r => {
    // Helper de búsqueda tolerante a acentos y mayúsculas
    const getVal = (keywords) => {
      const keys = Object.keys(r);
      // 1. Priorizar coincidencia exacta primero
      for (const kw of keywords) {
        const found = keys.find(k => k.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim() === kw);
        if (found && r[found] !== undefined && r[found] !== '') return String(r[found]).trim();
      }
      // 2. Si no hay exacta, buscar por substring
      for (const kw of keywords) {
        const found = keys.find(k => k.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(kw));
        if (found && r[found] !== undefined && r[found] !== '') return String(r[found]).trim();
      }
      return '';
    };

    // Obtenemos los valores de las columnas especificadas por el usuario
    const estandarVal = getVal(['estandares', 'estándares', 'estandar', 'estándar', 'descripcion', 'modulo']);
    const numeralVal = getVal(['numeral', 'numeral_id', 'item', 'criterio_id']);
    const rawCriterioVal = getVal(['criterio', 'descripcion', 'descripcion criterio', 'detalle']);
    
    let parsedNumeral = numeralVal;
    let parsedDesc = rawCriterioVal;
    
    if (!parsedNumeral && rawCriterioVal) {
      const match = rawCriterioVal.match(/^(\d+\.\d+\.\d+|\d+\.\d+)/);
      if (match) {
        parsedNumeral = match[0];
        parsedDesc = rawCriterioVal.replace(match[0], '').trim();
      }
    }

    const estadoRaw = getVal(['estado', 'cumplimiento', 'resultado']);
    const maxPesoRaw = getVal(['valor criterio', 'valor', 'maximo', 'peso maximo']);
    const maxPesoVal = parseNum(maxPesoRaw);
    const pesoRaw = getVal(['peso (%)', 'peso %', 'peso', 'porcentaje', 'puntaje']);
    let pesoVal = parseNum(pesoRaw);
    const cicloRaw = getVal(['ciclo phva', 'ciclo', 'phva', 'etapa']);

    if (estandarVal) estandaresUnicosSet.add(estandarVal);
    if (parsedNumeral || rawCriterioVal) criteriosEvaluadosList.push(parsedNumeral || rawCriterioVal);

    // El cumplimiento global es la suma directa de los puntos obtenidos
    totalPesoGlobal += pesoVal;

    // Clasificación del Estado (Columna Estado)
    const estadoUpper = estadoRaw.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const isNoCumple = estadoUpper.includes('NO CUMPLE') || estadoUpper.includes('NO CUMPLEN') || estadoUpper.includes('INCUMPLE');
    const isEnProceso = estadoUpper.includes('PROCESO') || estadoUpper.includes('PENDIENTE');
    const isNoAplica = estadoUpper.includes('NO APLICA') || estadoUpper.includes('NO APLICAN') || estadoUpper.includes('N/A');
    const isCumple = (estadoUpper.includes('CUMPLE') || estadoUpper.includes('CUMPLEN')) && !isNoCumple;

    if (isNoCumple) noCumplenCount++;
    else if (isEnProceso) enProcesoCount++;
    else if (isNoAplica) noAplicaCount++;
    else if (isCumple) cumplenCount++;
    else if (pesoVal > 0) cumplenCount++; // Default fallback

    // Estadísticas para Ciclo PHVA (% Cumplimiento por etapa)
    const cicloUpper = cicloRaw.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    let cicloKey = '';
    if (cicloUpper.includes('PLANEAR')) cicloKey = 'PLANEAR';
    else if (cicloUpper.includes('HACER')) cicloKey = 'HACER';
    else if (cicloUpper.includes('VERIFICAR')) cicloKey = 'VERIFICAR';
    else if (cicloUpper.includes('ACTUAR')) cicloKey = 'ACTUAR';

    if (cicloKey && phvaStats[cicloKey]) {
      phvaStats[cicloKey].totalItems += 1;
      // Para PHVA, totalPeso es el puntaje máximo posible, obtenidoPeso es el puntaje real logrado
      phvaStats[cicloKey].totalPeso += (maxPesoVal > 0 ? maxPesoVal : pesoVal);
      phvaStats[cicloKey].obtenidoPeso += pesoVal;

      // Celdas de Peso (%) con valores mayores a 0
      if (pesoVal > 0) {
        phvaStats[cicloKey].cumplenItems += 1;
      }
    }

    // Mapeo por Estándar
    const estandarIdMatch = estandarVal.match(/^\d+/);
    const estandarId = estandarIdMatch ? parseInt(estandarIdMatch[0], 10) : Object.keys(estandaresMap).length + 1;
    const mapKey = estandarVal || `ESTÁNDAR ${estandarId}`;

    if (!estandaresMap[mapKey]) {
      estandaresMap[mapKey] = {
        id: estandarId,
        nombre: estandarVal || `ESTÁNDAR ${estandarId}`,
        totalPeso: 0,
        obtenidoPeso: 0,
        totalItems: 0,
        cumplenItems: 0,
        criterios: []
      };
    }

    estandaresMap[mapKey].totalItems += 1;
    // Para Estándar, totalPeso es el puntaje máximo posible, obtenidoPeso es el puntaje real logrado
    estandaresMap[mapKey].totalPeso += (maxPesoVal > 0 ? maxPesoVal : pesoVal);
    estandaresMap[mapKey].obtenidoPeso += pesoVal;

    // Un ítem se considera cumplido en ese estándar si su valor en la columna Peso (%) es mayor a 0 (pesoVal > 0)
    if (pesoVal > 0) {
      estandaresMap[mapKey].cumplenItems += 1;
    }

    let pctCriterio = 0;
    if (maxPesoVal > 0 && pesoVal > 0) {
      pctCriterio = Math.round((pesoVal / maxPesoVal) * 100);
    } else if (pesoVal > 0) {
      pctCriterio = Math.round(pesoVal > 1 ? pesoVal : pesoVal * 100);
    }

    estandaresMap[mapKey].criterios.push({
      id: parsedNumeral || `1.1.${estandaresMap[mapKey].criterios.length + 1}`,
      descripcion: parsedDesc || rawCriterioVal || '',
      valor: pctCriterio,
      cumple: isCumple,
      noCumple: isNoCumple,
      enProceso: isEnProceso,
      noAplica: isNoAplica
    });
  });

  // Ajuste si los pesos vienen como proporción 0.xx (ej. 0.84 en lugar de 84)
  if (totalPesoGlobal > 0 && totalPesoGlobal <= 1.0) {
    totalPesoGlobal = totalPesoGlobal * 100;
    Object.keys(phvaStats).forEach(k => {
      phvaStats[k].totalPeso *= 100;
      phvaStats[k].obtenidoPeso *= 100;
    });
    Object.values(estandaresMap).forEach(e => {
      e.totalPeso *= 100;
      e.obtenidoPeso *= 100;
    });
  }

  const porcentajeGlobal = Math.round(totalPesoGlobal);
  const nivelGlobal = porcentajeGlobal >= 86 ? 'ACEPTABLE' : porcentajeGlobal >= 61 ? 'MODERADAMENTE ACEPTABLE' : 'CRÍTICO';

  // 1. CUMPLIMIENTO GLOBAL DEL SG-SST
  const cumplimientoGlobal = {
    porcentaje: porcentajeGlobal,
    nivel: nivelGlobal,
    ultimaEvaluacion: new Date().toLocaleDateString('es-CO'),
  };

  // 2. CICLO PHVA (% Cumplido para Planear, Hacer, Verificar, Actuar)
  const colorsPHVA = { PLANEAR: '#518bd6', HACER: '#33a55c', VERIFICAR: '#f5b53a', ACTUAR: '#d56362' };
  const phva = Object.keys(phvaStats).map(key => {
    const st = phvaStats[key];
    let pctCumplido = 0;

    if (st.totalItems > 0) {
      pctCumplido = Math.round((st.cumplenItems / st.totalItems) * 100);
    }

    return {
      label: key,
      valor: pctCumplido,
      cumplenItems: st.cumplenItems,
      totalItems: st.totalItems,
      color: colorsPHVA[key] || '#9ca3af'
    };
  });

  // 3. RESUMEN GENERAL
  const resumenGeneral = {
    estandaresEvaluados: estandaresUnicosSet.size || Object.keys(estandaresMap).length,
    criteriosEvaluados: criteriosEvaluadosList.length || rows.length,
    cumplen: cumplenCount,
    noCumplen: noCumplenCount,
    enProceso: enProcesoCount,
    noAplica: noAplicaCount,
  };

  // Helper para calcular % del estándar (unificado para todas las tarjetas de Estándar)
  const calcPctEstandar = (e) => {
    if (e.totalPeso > 0) {
      return Math.round((e.obtenidoPeso / e.totalPeso) * 100);
    }
    if (e.totalItems > 0) {
      return Math.round((e.cumplenItems / e.totalItems) * 100);
    }
    return 0;
  };

  // 4 y 5. CUMPLIMIENTO POR ESTÁNDAR & MAPA DE ESTÁNDARES
  const colorsEstandar = ['#22C55E', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444', '#06B6D4', '#EC4899'];
  const estandares = Object.values(estandaresMap).map((e, idx) => {
    const pctCumplido = calcPctEstandar(e);

    return {
      id: e.id,
      nombre: e.nombre,
      porcentaje: pctCumplido,
      cumplenItems: e.cumplenItems,
      totalItems: e.totalItems,
      color: colorsEstandar[idx % colorsEstandar.length]
    };
  });

  // 6. DETALLE ESTÁNDARES
  const detalleEstandares = {};
  Object.values(estandaresMap).forEach(e => {
    const cumplenCnt = e.criterios.filter(c => c.cumple).length;
    const noCumplenCnt = e.criterios.filter(c => c.noCumple).length;
    const enProcesoCnt = e.criterios.filter(c => c.enProceso).length;
    const noAplicaCnt = e.criterios.filter(c => c.noAplica).length;
    const pctCumplido = calcPctEstandar(e);

    detalleEstandares[e.id] = {
      nombre: e.nombre,
      cumplimiento: pctCumplido,
      criteriosEvaluados: e.criterios.length,
      cumplen: cumplenCnt,
      noCumplen: noCumplenCnt,
      enProceso: enProcesoCnt,
      noAplica: noAplicaCnt,
      criterios: e.criterios
    };
  });

  return {
    ...defaultData,
    cumplimientoGlobal,
    resumenGeneral,
    phva,
    estandares,
    detalleEstandares,
  };
}

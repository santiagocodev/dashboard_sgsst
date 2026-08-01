# Documento Macro: Criterios de Calidad para el Diseño de la Webapp  
*SAFE GROUP - Sistema de Gestión de Seguridad y Salud en el Trabajo (SG-SST)*  

---

## **1. Introducción**  
Este documento detalla los criterios técnicos, funcionales y de diseño necesarios para desarrollar una webapp **responsiva, segura y escalable** que replique fielmente el dashboard de gestión de seguridad y salud en el trabajo (SG-SST) presentado en la imagen de referencia. Incluye los requisitos iniciales proporcionados y criterios adicionales identificados por un experto senior en desarrollo de webapps, organizados en categorías clave para garantizar calidad en todas las etapas del ciclo de vida del proyecto.

---

## **2. Requisitos Funcionales**  

### **2.1. Comportamiento del Dashboard**  
- **Dispositivos soportados**:  
  - Diseño principal para **computadoras de escritorio** (resolución ≥ 1920px).  
  - Diseño responsivo para **dispositivos móviles** (menú colapsado, gráficos adaptados a 1 columna, touch targets ≥ 48x48px).  
- **Actualización dinámica de datos**:  
  - Intervalos configurables para recarga automática (ej.: cada 5 minutos) + botón manual de *refresh*.  
  - Validación de formatos de datos (fechas, rangos numéricos) para evitar errores en gráficos.  
- **Exportación avanzada**:  
  - Exportar gráficos a PNG/PDF y datos a CSV/Excel.  
  - Opción para guardar configuraciones de filtros en `localStorage`.  

### **2.2. Integración con Google Sheets**  
- **Estructura de datos**:  
  - Múltiples hojas en Google Sheets, cada una nombrada según el módulo (ej.: `Dashboard`, `Presupuesto`).  
  - Validación de nombres de hojas y estructuras de columnas para evitar rupturas en la integración.  
- **Gestión de errores**:  
  - Mensajes amigables ante fallos de API (ej.: "Google Sheets no disponible. Intente más tarde").  
  - *Caching* en `localStorage` para mostrar datos previos si la API falla.  

### **2.3. Módulos y Flujo de Usuario**  
- **Estructura de módulos**:  

  - Dashboard
  - Evaluación SG-SST
  - Criterios y Estándares
  - Plan de Trabajo
  - Programas
  - Presupuesto
  - Capacitaciones
  - Vigilancia Epidemiológica
  - Inspecciones
  - Mantenimiento
  - Accidentalidad
  - Reportes
  - Configuración

- **Filtrado inteligente**:  
  - Filtros por rango de fechas (selector de calendario), categorías múltiples y búsquedas por texto.  
  - Búsqueda global en la barra superior para filtrar módulos, métricas o términos clave.  
- **Sin backend ni autenticación**:  
  - Aplicación destinada **exclusivamente a consulta y filtrado** (no requiere gestión de usuarios).  

---

## **3. Diseño y Experiencia de Usuario (UX)**  

### **3.1. Material Design**  
- **Paleta de colores**:  
  - Uso de los colores de la marca SAFE GROUP (verde primario, azul secundario).  
  - Contraste mínimo 4.5:1 para texto (ej.: verde oscuro sobre fondo claro).  
- **Componentes estándar**:  
  - Cards, botones, menús y gráficos siguiendo las guías de **Material Design 3**.  
  - Animaciones suaves (ej.: transición de 300ms al colapsar el menú).  

### **3.2. Navegación y Interactividad**  
- **Menú colapsable**:  
  - Permite reducirse a íconos únicamente.  
  - *Tooltips* emergentes al posicionar el cursor (ej.: "Dashboard" al pasar sobre el ícono).  
- **Accesibilidad (WCAG 2.1)**:  
  - Soporte para lectores de pantalla (ARIA labels en gráficos, `alt` en íconos).  
  - Navegación por teclado (tabulación en menú colapsado).  
  - Modo oscuro opcional para reducir fatiga visual.  

### **3.3. Adaptación a Móviles**  
- **Layout responsivo**:  
  - 1 columna en móviles, 2-3 columnas en tablets.  
  - Gráficos reescalables sin perder legibilidad.  
- **Microinteracciones**:  
  - *Skeleton screens* para estados de carga.  
  - Mensajes de error claros con iconos de advertencia (ej.: "No hay datos para esta fecha").  

---

## **4. Seguridad**  

### **4.1. Protección de Datos**  
- **API Key de Google Sheets**:  
  - **Nunca exponer en el cliente**. Usar un *proxy* en Vercel para ocultar la clave.  
  - Configurar permisos en Google Sheets para que solo el *proxy* tenga acceso.  
- **Prevención de abusos**:  
  - *Rate limiting* en el *proxy* (10 solicitudes/minuto por IP).  
  - CORS restringido para permitir solo el dominio de la webapp.  

### **4.2. Seguridad en el Cliente**  
- **Sanitización de datos**:  
  - Evitar XSS al renderizar datos de Google Sheets (ej.: usar `dangerouslySetInnerHTML` con validación).  
- **Encabezados de seguridad**:  
  - Forzar HTTPS en Vercel.  
  - Configurar CSP (Content Security Policy) y HSTS.  

### **4.3. Privacidad**  
- **Verificación de datos**:  
  - Asegurar que Google Sheets **no contenga información sensible** (ej.: datos personales).  
  - Si es crítico, implementar autenticación OAuth en el *proxy*.  

---

## **5. Implementación Técnica y Mantenibilidad**  

### **5.1. Stack Tecnológico**  
- **Frontend**:  
  - React + Vite para alto rendimiento.  
  - Chart.js para gráficos (con optimización de *debounce* al redimensionar).  
  - Material-UI (MUI) para implementar Material Design de forma consistente.  
- **TypeScript**:  
  - Tipado estático para evitar errores en tiempo de ejecución.  

### **5.2. Estructura del Proyecto**  
- **Modularidad**:  
  - Organización en módulos (ej.: `src/modules/Dashboard`, `src/modules/Presupuesto`).  
  - Componentes reutilizables (ej.: `ChartCard`, `FilterBar`).  
- **Optimización**:  
  - *Code splitting* con React.lazy para cargar módulos bajo demanda.  
  - Minimización de JavaScript/CSS en el *build*.  

### **5.3. Pruebas y CI/CD**  
- **Pruebas**:  
  - Unit tests (Jest) para lógica de negocio (ej.: cálculo de porcentajes).  
  - E2E tests (Playwright) para flujos críticos (ej.: filtrar por fecha).  
- **CI/CD**:  
  - Pipeline en GitHub Actions:  
    1. Ejecutar tests en cada *push*.  
    2. Desplegar *preview* en Vercel para cada *PR*.  
    3. Validar *build* antes de producción.  

---

## **6. Despliegue e Infraestructura**  

### **6.1. Repositorio y Despliegue**  
- **GitHub**:  
  - Estructura de carpetas clara (ej.: `public/`, `src/`, `docs/`).  
  - Convencional Commits para historial legible.  
- **Vercel**:  
  - Configuración de variables de entorno para el *proxy* de Google Sheets.  
  - URL integrada en WordPress mediante iframe o API de embed.  

### **6.2. Monitoreo**  
- **Vercel Analytics**:  
  - Rastreo de errores de API y métricas de rendimiento.  
- **Logging**:  
  - Registro de errores en tiempo real (ej.: Sentry).  

---

## **7. Consideraciones Clave para Evitar Errores**  

### **7.1. Google Sheets como Fuente de Datos**  
- **Validación de estructura**:  
  - Verificar que las hojas tengan nombres consistentes y estructuras fijas.  
- **Error boundaries en React**:  
  - Capturar fallos en el consumo de datos para evitar *crashes* de la app.  

### **7.2. Optimización del Cliente**  
- **Procesamiento en el *proxy***:  
  - Calcular porcentajes o agrupaciones en el servidor (no en el cliente).  
- **Evitar sobrecarga**:  
  - Limitar el número de solicitudes a Google Sheets (ej.: 1 petición por módulo).  

### **7.3. Documentación Crítica**  
- **`README.md`**:  
  - Instrucciones para configurar el *proxy* en Vercel.  
  - Guía para mapear columnas de Google Sheets a gráficos.  
  - Convenciones de nombres para hojas de cálculo.  

---

## **8. Anexos**  

### **8.1. Checklist de Validación**  
| Criterio                     | Cumplido | Observaciones |  
|------------------------------|----------|---------------|  
| Diseño responsivo para móviles | ✅       |               |  
| API Key protegida con *proxy* | ✅       |               |  
| Pruebas E2E implementadas     | ❌       | Pendiente     |  

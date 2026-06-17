# Demo Drone Images Analysis

Demo corporativo de análisis de imágenes con drones para presentación ejecutiva. Incluye varias pantallas con datos simulados y exportación real de PDF.

## Requisitos

- Node.js 20+
- npm

## Instalación

```bash
npm install
```

## Desarrollo

```bash
npm run dev
```

Abra la URL que muestra Vite (normalmente `http://localhost:5173`).

## Pantallas

### Dashboard Principal (`/`)
- Banner permanente **Modo On-Premise: Activo**
- Panel de sensores DJI Dock 2 (viento, lluvia, sincronización)
- Gráfico de avance: instalación de líneas planificado vs. ejecutado
- Semáforo de proyección de ejecución

- Semáforo de proyección de ejecución
- Obras activas con vuelos diurnos/nocturnos

### Planes de vuelo (`/flight-plans`)
- Listado de obras con sus planes de vuelo
- Visualización de ruta con waypoints y coordenadas (lat/lng/altitud)
- Edición de plan y waypoints (mock en memoria)

### Inspección (`/inspection`)
- Vista dual: imagen visual + térmica (rango -20°C a 500°C)
- Overlays de detección IA Nivel 1 con recuadros rojos
- Botones **Confirmar falla** y **Descartar** para validación humana

### Historial (`/history`)
- Línea de tiempo cronológica con etiquetas Antes / Después / Reparación completada
- Botón **Exportar Reporte Ejecutivo** (descarga PDF real)

## Build

```bash
npm run build
```

## Stack

- React + Vite + TypeScript
- Tailwind CSS
- React Router
- Recharts
- jsPDF + jspdf-autotable
- Lucide React

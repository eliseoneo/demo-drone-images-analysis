import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

export type Language = 'es' | 'en'

const STORAGE_KEY = 'drone-analytics-language'

const translations: Record<string, string> = {
  'cargando...': 'Loading...',
  'cargando sesion...': 'Loading session...',
  'no tiene permisos para acceder a esa seccion.':
    'You do not have permission to access that section.',
  'drone analytics acceso': 'Drone Analytics - Access',
  'iniciar sesion': 'Sign in',
  'ingrese sus credenciales corporativas': 'Enter your corporate credentials',
  usuario: 'Username',
  contrasena: 'Password',
  ingresar: 'Sign in',
  'ingresando...': 'Signing in...',
  'cuentas demo disponibles': 'Available demo accounts',
  'volver a la presentacion': 'Back to presentation',
  administrador: 'Administrator',
  monitoreo: 'Monitoring',
  ejecutivo: 'Executive',
  'modo on-premise: activo': 'On-Premise Mode: Active',
  'los datos permanecen seguros en su red corporativa':
    'Data remains secure inside your corporate network',
  'ver detalles de seguridad': 'View security details',
  salir: 'Sign out',
  'cerrar sesion': 'Sign out',
  dashboard: 'Dashboard',
  'planes de vuelo': 'Flight Plans',
  inspeccion: 'Inspection',
  historial: 'History',
  'soporte tecnico': 'Technical Support',
  'integracion scada': 'SCADA Integration',
  'centro de comando': 'Command Center',
  'acceso clientes': 'Client Access',
  'solicitar demostracion': 'Request Demo',
  'dashboard principal': 'Main Dashboard',
  'centro de comando y resumen ejecutivo': 'Command center and executive summary',
  'obras activas': 'Active works',
  'seleccione una obra para ver su resumen de avances':
    'Select a work to view its progress summary',
  'operaciones en total': 'total operations',
  'mas proximas': 'Coming up next',
  'ocultar otras obras': 'Hide other works',
  'ver otras obras': 'View other works',
  'proximo vuelo': 'Next flight',
  'ultima inspeccion': 'Last inspection',
  'vuelo diurno': 'Day flight',
  'vuelo nocturno': 'Night flight',
  'en curso': 'In progress',
  programada: 'Scheduled',
  'completada hoy': 'Completed today',
  'inspeccion de obra': 'Construction inspection',
  'revision de linea': 'Line review',
  'inspeccion de torres': 'Tower inspection',
  'revision de subestacion': 'Substation review',
  'estado del sistema': 'System status',
  'docks y drones asignados a obras activas': 'docks and drones assigned to active works',
  viento: 'Wind',
  lluvia: 'Rain',
  sincronizacion: 'Sync',
  'bateria del drone': 'Drone battery',
  'otros equipos por obra': 'Other equipment by work',
  normal: 'Normal',
  elevado: 'Elevated',
  critico: 'Critical',
  advertencia: 'Warning',
  'sin lluvia': 'No rain',
  'lluvia ligera': 'Light rain',
  'lluvia intensa': 'Heavy rain',
  sincronizado: 'Synced',
  retraso: 'Delay',
  error: 'Error',
  listo: 'Ready',
  'en vuelo': 'In flight',
  cargando: 'Charging',
  mantenimiento: 'Maintenance',
  'fuera de linea': 'Offline',
  'proyeccion de ejecucion': 'Execution projection',
  'sincronizado con resumen de avances': 'Synced with progress summary',
  'en tiempo': 'On time',
  'alerta de retraso': 'Delay alert',
  'retraso critico': 'Critical delay',
  proyeccion: 'Projection',
  'dias de margen': 'days of margin',
  'dia(s) de desfase estimado': 'estimated day(s) behind',
  'resumen de avances': 'Progress summary',
  'cumplimiento diario': 'daily completion',
  'avance del dia': 'Daily progress',
  'cobertura del dia': 'Daily coverage',
  'torres revisadas hoy': 'Towers reviewed today',
  'activos revisados hoy': 'Assets reviewed today',
  'forecasting de avance': 'Progress forecasting',
  'en ritmo': 'On track',
  'en riesgo': 'At risk',
  'con desviacion': 'Off track',
  'proyeccion fin de dia': 'End-of-day projection',
  'desviacion hoy': 'Today deviation',
  'cierre de periodo': 'Period close',
  'ritmo vs. esperado': 'Pace vs. expected',
  plan: 'Plan',
  meta: 'Target',
  'avance del dia al': 'Day progress at',
  planificado: 'planned',
  ejecutado: 'executed',
  planificados: 'Planned',
  realizados: 'Completed',
  hoy: 'Today',
  'evidencia en video': 'Video evidence',
  'su navegador no admite reproduccion de video.': 'Your browser does not support video playback.',
  'sin video': 'No video',
  'planificado hoy': 'Planned today',
  'ejecutado hoy': 'Executed today',
  'cronograma de vuelos por proyecto': 'Flight schedule by project',
  'ver obra seleccionada': 'View selected work',
  'ver todos los proyectos': 'View all projects',
  proyecto: 'Project',
  'sin vuelos registrados para la obra seleccionada.': 'No flights recorded for the selected work.',
  'linea rosa: hoy (17 jun 2026)': 'Pink line: today (Jun 17, 2026)',
  'filtrado por obra seleccionada': 'filtered by selected work',
  proyectos: 'projects',
  vuelo: 'flight',
  vuelos: 'flights',
  realizado: 'completed',
  tramos: 'sections',
  activos: 'assets',
  torres: 'towers',
  sectores: 'sectors',
  'proy.': 'Proj.',
  'obras en alerta': 'Works in alert',
  'no hay obras en alerta.': 'No works in alert.',
  'hallazgos de anomalias': 'Anomaly findings',
  'no hay hallazgos pendientes de validacion.': 'No findings pending validation.',
  confianza: 'Confidence',
  'pendiente de validacion': 'Pending validation',
  'alertas scada': 'SCADA alerts',
  activa: 'active',
  activas: 'active',
  'abrir integracion scada': 'Open SCADA integration',
  'accesos no autorizados': 'Unauthorized access',
  'no hay intentos de acceso bloqueados.': 'No blocked access attempts.',
  bloqueado: 'Blocked',
  pendientes: 'pending',
  desgaste: 'Wear',
  'sensor scada': 'SCADA sensor',
  conector: 'Connector',
  ver: 'View',
  'mas en scada': 'more in SCADA',
  'plan de vuelo guardado correctamente.': 'Flight plan saved successfully.',
  obras: 'Works',
  'carga y edicion de rutas con waypoints y coordenadas por obra':
    'Route loading and editing with waypoints and coordinates by work',
  'guardar plan': 'Save plan',
  'plan de vuelo': 'flight plan',
  'nombre del plan': 'Plan name',
  programado: 'Scheduled',
  'tipo de vuelo': 'Flight type',
  diurno: 'Day',
  nocturno: 'Night',
  'duracion estimada (min)': 'Estimated duration (min)',
  'visualizacion de ruta': 'Route view',
  'waypoints y coordenadas': 'Waypoints and coordinates',
  'agregar waypoint': 'Add waypoint',
  borrador: 'Draft',
  activo: 'Active',
  completado: 'Completed',
  nombre: 'Name',
  latitud: 'Latitude',
  longitud: 'Longitude',
  'altitud (m)': 'Altitude (m)',
  accion: 'Action',
  despegue: 'Takeoff',
  aterrizaje: 'Landing',
  fotografia: 'Photo',
  'finalizar edicion': 'Done',
  'editar waypoint': 'Edit waypoint',
  'eliminar waypoint': 'Delete waypoint',
  'deteccion descartada': 'Detection dismissed',
  'marcada como falso positivo.': 'marked as false positive.',
  'inspeccion y deteccion de anomalias': 'Inspection and Anomaly Detection',
  'nivel 1 validacion humana asistida por ia': 'Level 1 - AI-assisted human validation',
  captura: 'Capture',
  'deteccion ia nivel 1': 'AI Detection - Level 1',
  'seleccione una anomalia para validar': 'Select an anomaly to validate',
  'accion rapida': 'Quick action',
  'confirmar falla': 'Confirm failure',
  descartar: 'Dismiss',
  pendiente: 'Pending',
  confirmada: 'Confirmed',
  descartada: 'Dismissed',
  'todas las detecciones han sido revisadas.': 'All detections have been reviewed.',
  'vista dual matrice 3td': 'Dual view - Matrice 3TD',
  'rango termico': 'Thermal range',
  'captura termica vista 1': 'Thermal capture - view 1',
  'captura termica vista 2': 'Thermal capture - view 2',
  'indique un correo de destino.': 'Enter a destination email.',
  'para slack, configure la url del webhook entrante.':
    'For Slack, configure the incoming webhook URL.',
  'falla confirmada': 'Failure confirmed',
  'error inesperado al enviar las notificaciones.':
    'Unexpected error while sending notifications.',
  'confirmar falla y notificar': 'Confirm failure and notify',
  cerrar: 'Close',
  'correo electronico': 'Email',
  destinatario: 'Recipient',
  'se enviara un reporte con la anomalia, ubicacion y datos de la captura.':
    'A report with the anomaly, location and capture data will be sent.',
  'notificar tambien en slack': 'Also notify in Slack',
  'webhook entrante (incoming webhook)': 'Incoming Webhook',
  'canal de slack': 'Slack channel',
  'incluir foto de la captura en el mensaje': 'Include capture photo in the message',
  'slack requiere url publica de la imagen (visible al desplegar la app).':
    'Slack requires a public image URL (available when the app is deployed).',
  cancelar: 'Cancel',
  'enviando...': 'Sending...',
  'confirmar y enviar': 'Confirm and send',
  'historial y reportes': 'History and Reports',
  'evolucion cronologica antes y despues': 'Chronological evolution - Before and After',
  'resumen ejecutivo': 'Executive summary',
  'seleccione una obra o inspeccion para revisar avance, anomalias y proyecciones.':
    'Select a work or inspection to review progress, anomalies and projections.',
  'no hay datos disponibles para la seleccion actual.':
    'No data available for the current selection.',
  'exportar reporte ejecutivo': 'Export Executive Report',
  'seleccione una obra o inspeccion para generar el pdf con los tres bloques del resumen.':
    'Select a work or inspection to generate the PDF with the three summary blocks.',
  'buscar...': 'Search...',
  'sin resultados': 'No results',
  'seleccione un elemento para previsualizar.': 'Select an item to preview.',
  'generando pdf...': 'Generating PDF...',
  'descargar pdf': 'Download PDF',
  'orden simulada': 'Simulated order',
  'avance de obra y desviaciones': 'Work progress and deviations',
  'avance planificado': 'Planned progress',
  'avance real': 'Actual progress',
  'desviacion actual': 'Current deviation',
  'ver evidencia visual': 'View visual evidence',
  'anomalias y estado de revisiones': 'Anomalies and review status',
  'anomalias detectadas': 'Detected anomalies',
  'temperatura maxima detectada': 'Maximum detected temperature',
  'pico termico critico': 'Critical thermal peak',
  'pendientes de revision': 'Pending review',
  'en proceso': 'In progress',
  resueltas: 'Resolved',
  'proyecciones por desgaste (ia predictiva)': 'Wear projections (predictive AI)',
  'indice termico': 'Thermal index',
  'impacto operativo': 'Operational impact',
  inspecciones: 'Inspections',
  'seleccionar obra': 'Select work',
  'seleccionar inspeccion': 'Select inspection',
  'fusion dron + scada curva de degradacion, mapa de riesgo estructural y acciones preventivas recomendadas sobre telemetria e inspeccion aerea':
    'Drone + SCADA fusion - degradation curve, structural risk map and recommended preventive actions based on telemetry and aerial inspection',
  'trazabilidad de endpoints, cifrado y alertas de seguridad del sistema':
    'Endpoint traceability, encryption and system security alerts',
  'privacidad de la informacion: sus datos operativos permanecen bajo su control, sin salir de su red.':
    'Information privacy: your operational data remains under your control, without leaving your network.',
  'plataforma on-premise': 'On-Premise Platform',
  'infraestructura critica': 'Critical infrastructure',
  'automatizacion y analisis de drones 100% on-premise para infraestructura critica.':
    '100% On-Premise Drone Automation and Analytics for Critical Infrastructure.',
  'detecta anomalias termicas y estructurales sin comprometer la ciberseguridad de tu empresa. procesamiento de datos exclusivo en tu red local.':
    'Detect thermal and structural anomalies without compromising your company cybersecurity. Data processing stays exclusively inside your local network.',
  'resolvemos su mayor restriccion operativa: la privacidad de la informacion.':
    'We solve your biggest operational constraint: information privacy.',
  ciberseguridad: 'Cybersecurity',
  'privacidad de la informacion, sin concesiones': 'Information privacy, without compromise',
  'para gerentes del sector energetico, la confidencialidad de datos operativos no es opcional. nuestra arquitectura esta disenada para eliminar cualquier dependencia de infraestructura externa y mantener cada byte bajo su control.':
    'For energy sector leaders, operational data confidentiality is not optional. Our architecture is designed to eliminate external infrastructure dependencies and keep every byte under your control.',
  'procesamiento 100% on-premise': '100% On-Premise Processing',
  'el software opera completamente aislado dentro de sus propios servidores (intranet), evitando que gigabytes de informacion confidencial se suban a la nube.':
    'The software runs fully isolated inside your own servers (intranet), preventing gigabytes of confidential information from being uploaded to the cloud.',
  'soberania absoluta de los datos': 'Full data sovereignty',
  'la arquitectura cumple con las politicas de ciberseguridad mas estrictas del sector, garantizando que el control de las imagenes y reportes siempre este en manos de la empresa.':
    'The architecture meets the strictest cybersecurity policies in the sector, ensuring that image and report control always remains with the company.',
  'operacion sin internet': 'Offline operation',
  'tanto el procesamiento de la inteligencia artificial como las actualizaciones de la plataforma pueden funcionar en instalaciones remotas sin requerir una conexion web activa.':
    'Both AI processing and platform updates can operate in remote facilities without requiring an active internet connection.',
  'ecosistema de hardware': 'Hardware ecosystem',
  'integracion industrial avanzada': 'Advanced Industrial Integration',
  'plataforma optimizada para despliegues automatizados de alto nivel, compatible con estaciones dji dock 2 y drones de la serie matrice 3d y 3td.':
    'Platform optimized for high-level automated deployments, compatible with DJI Dock 2 stations and Matrice 3D / 3TD drones.',
  'capacidades tecnicas': 'Technical capabilities',
  'procesamiento local y operacion verificable': 'Local processing and verifiable operation',
  'arquitectura disenada para entornos industriales exigentes: inferencia en el borde y visibilidad operativa de extremo a extremo.':
    'Architecture designed for demanding industrial environments: edge inference and end-to-end operational visibility.',
  'inteligencia artificial en el borde (edge ai)': 'Edge AI',
  'modelos de vision por computadora y algoritmos de decision ejecutados 100% en servidores locales. analisis de fotogramas en milisegundos sin depender de ancho de banda ni enviar imagenes a la nube.':
    'Computer vision models and decision algorithms run 100% on local servers. Frame analysis in milliseconds without depending on bandwidth or sending images to the cloud.',
  'observabilidad y monitoreo transparente': 'Observability and Transparent Monitoring',
  'trazabilidad completa de cada vuelo. monitoreo en tiempo real de la telemetria, salud del hardware, latencia de deteccion y rendimiento de los algoritmos para garantizar una operacion segura e ininterrumpida.':
    'Complete traceability for every flight. Real-time monitoring of telemetry, hardware health, detection latency and algorithm performance to ensure safe, uninterrupted operation.',
  'sensores industriales y drones, una sola vision operativa':
    'Industrial sensors and drones, one operational view',
  'la plataforma ingesta telemetria de su red scada on-premise y la fusiona con analisis termico y estructural de drones. mantenimiento predictivo con datos que nunca salen de su intranet.':
    'The platform ingests telemetry from your on-premise SCADA network and fuses it with drone thermal and structural analysis. Predictive maintenance with data that never leaves your intranet.',
  'fusion dron + telemetria scada': 'Drone + SCADA telemetry fusion',
  'correlaciona evidencia visual de inspecciones aereas con tags de sensores en tiempo casi real para detectar patrones de desgaste antes de que escalen a fallas operativas.':
    'Correlates visual evidence from aerial inspections with near real-time sensor tags to detect wear patterns before they escalate into operational failures.',
  'conectores industriales nativos': 'Native industrial connectors',
  'integracion directa con opc-ua, modbus tcp, iec 61850 y mqtt. conecte subestaciones, historians y rtu de campo sin intermediarios en la nube.':
    'Direct integration with OPC-UA, Modbus TCP, IEC 61850 and MQTT. Connect substations, historians and field RTUs without cloud intermediaries.',
  'curvas de degradacion y proyeccion': 'Degradation curves and forecasting',
  'visualice la evolucion de temperatura, vibracion, corriente y otros senales criticas. proyecte ventanas de mantenimiento con base en tendencias medidas y evidencia estructural.':
    'Visualize the evolution of temperature, vibration, current and other critical signals. Forecast maintenance windows based on measured trends and structural evidence.',
  'alarmas tempranas y acciones preventivas': 'Early alarms and preventive actions',
  'alertas de desgaste anticipado, mapas de riesgo estructural y recomendaciones de mantenimiento preventivo con trazabilidad completa dron + scada.':
    'Early wear alerts, structural risk maps and preventive maintenance recommendations with full drone + SCADA traceability.',
  'casos de uso': 'Use cases',
  'operaciones criticas, visibilidad total': 'Critical operations, full visibility',
  'redes electricas': 'Power grids',
  'inspeccion termica de lineas de transmision y subestaciones.':
    'Thermal inspection of transmission lines and substations.',
  'energia e industria': 'Energy and industry',
  'mantenimiento predictivo en refinerias, petroleo, gas y parques solares.':
    'Predictive maintenance in refineries, oil, gas and solar farms.',
  'infraestructura civil': 'Civil infrastructure',
  'seguimiento automatizado de obras e infraestructura civil.':
    'Automated tracking of construction works and civil infrastructure.',
  'listo para una demostracion personalizada?': 'Ready for a personalized demo?',
  'nuestro equipo tecnico puede mostrarle el despliegue on-premise adaptado a su infraestructura y requisitos de cumplimiento normativo.':
    'Our technical team can show you an on-premise deployment adapted to your infrastructure and compliance requirements.',
  'procesamiento 100% on-premise soberania absoluta de los datos operacion sin internet':
    '100% on-premise processing - Full data sovereignty - Offline operation',
  'todos los derechos reservados.': 'All rights reserved.',
  'sin dependencia de nube publica confidencialidad garantizada':
    'No public cloud dependency - Guaranteed confidentiality',
}

const exactTranslations: Record<string, string> = {
  'linea 138 kv tramo norte': '138 kV Line - North Section',
  'linea 69 kv tramo sur': '69 kV Line - South Section',
  'torre 14 inspeccion de aisladores': 'Tower 14 - Insulator inspection',
  'subestacion norte transformador t-401': 'North Substation - Transformer T-401',
  'linea 34.5 kv sector este': '34.5 kV Line - East Sector',
  'obra subestacion nueva montaje estructuras': 'New Substation Works - Structure assembly',
  'ejecucion dentro del cronograma planificado':
    'Execution remains within the planned schedule',
}

interface LanguageContextValue {
  language: Language
  setLanguage: (language: Language) => void
  t: (value: string) => string
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

function normalizeText(text: string) {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[ùùù]/g, ' ')
    .replace(/[ùù]/g, '')
    .replace(/ù/g, '...')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()
}

function getInitialLanguage(): Language {
  if (typeof window === 'undefined') return 'es'
  const stored = window.localStorage.getItem(STORAGE_KEY)
  return stored === 'en' ? 'en' : 'es'
}

function translateDynamicText(text: string) {
  return text
    .replace('Ritmo compatible con el cronograma', 'Pace aligned with schedule')
    .replace('Riesgo de desviaciùn detectado', 'Deviation risk detected')
    .replace('Desviaciùn crùtica proyectada', 'Critical projected deviation')
    .replace('Proyecciùn de cierre con', 'Projected close with')
    .replace('de holgura', 'of buffer')
    .replace('Leve desviaciùn acumulada', 'Minor accumulated deviation')
    .replace('recuperable al mantener el ritmo actual', 'recoverable by maintaining the current pace')
    .replace('sobre lo planificado hoy', 'above today plan')
    .replace('por debajo del plan de hoy', 'below today plan')
    .replace('Si el ritmo no mejora, el cierre podrùa retrasarse', 'If the pace does not improve, closing could be delayed')
    .replace('faltan', 'missing')
    .replace('vs. meta del periodo', 'vs. period target')
    .replace('Se estima un retraso de', 'Estimated delay of')
    .replace('respecto al cierre planificado', 'against the planned close')
    .replace('dùficit acumulado proyectado', 'projected accumulated deficit')
    .replace('dùa(s)', 'day(s)')
    .replace('tramos', 'sections')
    .replace('activos', 'assets')
    .replace('torres', 'towers')
    .replace('sectores', 'sectors')
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage)

  useEffect(() => {
    document.documentElement.lang = language
  }, [language])

  const value = useMemo<LanguageContextValue>(() => {
    const setLanguage = (next: Language) => {
      setLanguageState(next)
      window.localStorage.setItem(STORAGE_KEY, next)
    }

    const t = (text: string) => {
      if (language === 'es') return text
      const key = normalizeText(text)
      return exactTranslations[key] ?? translations[key] ?? translateDynamicText(text)
    }

    return { language, setLanguage, t }
  }, [language])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return context
}

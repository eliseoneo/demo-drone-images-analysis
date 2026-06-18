import type { Language } from './types'

type Bilingual = Record<Language, string>

function b(es: string, en: string): Bilingual {
  return { es, en }
}

const entries: Record<string, Bilingual> = {
  // Works
  'works.work-001.name': b('Linea 138 kV - Tramo Norte', '138 kV Line - North Section'),
  'works.work-002.name': b(
    'Subestacion Norte - Transformador T-401',
    'North Substation - Transformer T-401',
  ),
  'works.work-003.name': b('Torre 14 - Inspeccion de aisladores', 'Tower 14 - Insulator inspection'),
  'works.work-004.name': b('Linea 69 kV - Tramo Sur', '69 kV Line - South Section'),
  'works.work-005.name': b('Linea 34.5 kV - Sector Este', '34.5 kV Line - East Sector'),
  'works.work-006.name': b(
    'Obra Subestacion Nueva - Montaje estructuras',
    'New Substation Works - Structure assembly',
  ),

  // Detections
  'detections.det-001.label': b('Sobrecalentamiento en transformador', 'Transformer overheating'),
  'detections.det-002.label': b('Punto caliente en bushings', 'Hot spot on bushings'),
  'inspection.location': b('Transformador T-401 - Subestacion Norte', 'Transformer T-401 - North Substation'),

  // Timeline
  'timeline.tl-001.title': b('Post-reparacion verificada', 'Post-repair verified'),
  'timeline.tl-001.description': b(
    'Inspeccion termica confirma temperatura normalizada en T-401.',
    'Thermal inspection confirms normalized temperature on T-401.',
  ),
  'timeline.tl-002.title': b('Intervencion en campo finalizada', 'Field intervention completed'),
  'timeline.tl-002.description': b(
    'Equipo de mantenimiento reemplazo aislador danado en torre 14.',
    'Maintenance crew replaced damaged insulator on tower 14.',
  ),
  'timeline.tl-003.title': b('Deteccion inicial por drone', 'Initial drone detection'),
  'timeline.tl-003.description': b(
    'IA Nivel 1 identifico sobrecalentamiento y aislador comprometido.',
    'Level 1 AI identified overheating and compromised insulator.',
  ),
  'timeline.tl-004.title': b('Linea de referencia instalada', 'Reference line installed'),
  'timeline.tl-004.description': b(
    'Estado inicial del tramo 7 antes del avance de obra.',
    'Initial state of section 7 before construction progress.',
  ),
  'timeline.milestone.t401': b('Transformador T-401', 'Transformer T-401'),
  'timeline.milestone.line138': b('Linea 138 kV - Tramo Norte', '138 kV Line - North Section'),

  // Support mocks
  'support.encryption.keyStorage': b(
    'HSM on-premise (modulo de seguridad hardware)',
    'On-premise HSM (hardware security module)',
  ),
  'support.encryption.certIssuer': b('CA Interna - Red Corporativa', 'Internal CA - Corporate Network'),
  'support.compliance.0': b('Trafico API restringido a VLAN corporativa', 'API traffic restricted to corporate VLAN'),
  'support.compliance.1': b('Claves rotadas cada 90 dias', 'Keys rotated every 90 days'),
  'support.compliance.2': b(
    'Datos de inspeccion sin salida a internet',
    'Inspection data never leaves the network',
  ),
  'support.ua-001.reason': b(
    'IP fuera de rango corporativo - intento de carga de imagenes',
    'IP outside corporate range - image upload attempt',
  ),
  'support.ua-001.region': b('Extranjero (Tor exit node)', 'Foreign (Tor exit node)'),
  'support.ua-002.reason': b(
    'Token JWT ausente - escaneo automatizado detectado',
    'Missing JWT token - automated scan detected',
  ),
  'support.ua-002.region': b('Red publica no autorizada', 'Unauthorized public network'),
  'support.ua-003.reason': b(
    'Certificado cliente no reconocido por la CA interna',
    'Client certificate not recognized by internal CA',
  ),
  'support.ua-003.region': b('VPN externa no registrada', 'Unregistered external VPN'),
  'support.ua-004.reason': b(
    'Rol insuficiente para exportacion de reportes',
    'Insufficient role for report export',
  ),
  'support.ua-004.region': b('Subred invitados (segmentada)', 'Guest subnet (segmented)'),

  // Executive report
  'report.thermalHighlight': b(
    '3 alertas termicas > 120 C en bushings y devanados',
    '3 thermal alerts > 120 C on bushings and windings',
  ),
  'report.wearHeadline': b(
    'Tasa de desgaste acelerada - ventana critica en 14 dias',
    'Accelerated wear rate - critical window in 14 days',
  ),
  'report.projectionText': b('Falla critica estimada en 14 dias.', 'Critical failure estimated in 14 days.'),
  'report.actionLabel': b(
    'Generar orden de mantenimiento preventivo',
    'Generate preventive maintenance order',
  ),
  'report.failureHeadline': b('Falla critica estimada en 14 dias', 'Critical failure estimated in 14 days'),
  'report.failureDetail.t401': b(
    'Correlacion del pico termico detectado en vuelo (187 C, devanado HV) con tendencia SCADA de aceite y DGA. La curva proyectada cruza el umbral critico.',
    'Correlation of thermal peak detected in flight (187 C, HV winding) with SCADA oil and DGA trend. Projected curve crosses critical threshold.',
  ),
  'report.subtitle.active': b('Obra activa - Inspeccion aerea diurna', 'Active work - Day aerial inspection'),
  'report.subtitle.completed': b(
    'Obra completada hoy - Activos criticos',
    'Work completed today - Critical assets',
  ),
  'report.category.powerline': b('Linea de transmision', 'Transmission line'),
  'report.category.substation': b('Subestacion', 'Substation'),
  'report.category.tower': b('Torre / aisladores', 'Tower / insulators'),
  'report.category.construction': b('Obra civil', 'Civil works'),

  // Inspections
  'inspections.insp-001.label': b('Transformador T-401 - Termica', 'Transformer T-401 - Thermal'),
  'inspections.insp-001.title': b(
    'Inspeccion termica - Transformador T-401',
    'Thermal inspection - Transformer T-401',
  ),
  'inspections.insp-001.subtitle': b(
    '2026-06-17 11:45 \u00b7 Subestacion Norte',
    '2026-06-17 11:45 \u00b7 North Substation',
  ),
  'inspections.insp-002.label': b('Linea 69 kV Sur - Nocturna', '69 kV South Line - Night'),
  'inspections.insp-002.title': b(
    'Inspeccion nocturna - Linea 69 kV Sur',
    'Night inspection - 69 kV South Line',
  ),
  'inspections.insp-002.subtitle': b(
    '2026-06-16 03:35 \u00b7 Corredor tramo 12-18',
    '2026-06-16 03:35 \u00b7 Corridor section 12-18',
  ),
  'inspections.insp-003.label': b('Torre 14 - Aisladores', 'Tower 14 - Insulators'),
  'inspections.insp-003.title': b('Inspeccion torre 14 - Aisladores', 'Tower 14 inspection - Insulators'),
  'inspections.insp-003.subtitle': b(
    '2026-06-16 22:10 \u00b7 Linea 138 kV Norte',
    '2026-06-16 22:10 \u00b7 138 kV North Line',
  ),

  // Report assets and per-report copy
  'report.assets.transformador2': b('Transformador 2', 'Transformer 2'),
  'report.assets.t401': b('Transformador T-401', 'Transformer T-401'),
  'report.assets.bay3': b('Estructura bay 3', 'Bay 3 structure'),
  'report.assets.insulatorT12': b('Aislador T-12', 'Insulator T-12'),
  'report.assets.insulatorChainT4': b('Cadena aislador T-4', 'Insulator chain T-4'),
  'report.insp-001.thermalHighlight': b(
    'Pico termico 187 \u00b0C en devanado HV (sensor dron)',
    'Thermal peak 187 \u00b0C on HV winding (drone sensor)',
  ),
  'report.work-002.wearHeadline': b(
    'Estabilizacion post-intervencion en T-401',
    'Post-intervention stabilization on T-401',
  ),
  'report.work-002.projectionText': b(
    'Sin cruce de umbral critico en ventana de 45 dias.',
    'No critical threshold crossing in 45-day window.',
  ),
  'report.work-002.actionLabel': b('Monitoreo de rutina', 'Routine monitoring'),
  'report.work-002.failureHeadline': b(
    'Riesgo controlado - seguimiento trimestral',
    'Controlled risk - quarterly follow-up',
  ),
  'report.work-006.subtitle': b(
    'Construccion \u00b7 Supervision visual de avance',
    'Construction \u00b7 Visual progress supervision',
  ),
  'report.work-006.wearHeadline': b(
    'Desgaste estructural incipiente en montaje',
    'Incipient structural wear during assembly',
  ),
  'report.work-006.projectionText': b(
    'Revision estructural recomendada en 28 dias.',
    'Structural review recommended in 28 days.',
  ),
  'report.work-006.actionLabel': b('Programar inspeccion de campo', 'Schedule field inspection'),
  'report.insp-002.wearHeadline': b(
    'Microfisuras con propagacion acelerada',
    'Microcracks with accelerated propagation',
  ),
  'report.insp-003.wearHeadline': b(
    'Degradacion dielectrica acelerada',
    'Accelerated dielectric degradation',
  ),

  // Gantt flight labels
  'gantt.fg-001-1.label': b('Patrulla Torre 10-12', 'Patrol Tower 10-12'),
  'gantt.fg-001-2.label': b('Inspeccion Torre 13', 'Tower 13 inspection'),
  'gantt.fg-001-3.label': b('Recorrido Torre 12-15', 'Route Tower 12-15'),
  'gantt.fg-001-4.label': b('Ruta Torre 12 \u2192 Torre 15', 'Route Tower 12 \u2192 Tower 15'),
  'gantt.fg-001-5.label': b('Revision corta Torre 12', 'Short review Tower 12'),
  'gantt.fg-001-6.label': b('Cierre tramo norte', 'North section close-out'),
  'gantt.fg-004-1.label': b('Patrulla nocturna T-18', 'Night patrol T-18'),
  'gantt.fg-004-2.label': b('Termografia T-20', 'Thermography T-20'),
  'gantt.fg-004-3.label': b('Patrulla Tramo Sur completo', 'Full South section patrol'),
  'gantt.fg-004-4.label': b('Seguimiento T-22', 'Follow-up T-22'),
  'gantt.fg-003-1.label': b('Reconocimiento diurno', 'Daytime reconnaissance'),
  'gantt.fg-003-2.label': b('Circuito nocturno previo', 'Prior night circuit'),
  'gantt.fg-003-3.label': b('Circuito nocturno Torre 14', 'Night circuit Tower 14'),
  'gantt.fg-002-1.label': b('Inspeccion T-401 matinal', 'Morning T-401 inspection'),
  'gantt.fg-002-2.label': b('Termografia buchones', 'Bushing thermography'),
  'gantt.fg-002-3.label': b('Circuito transformador T-401', 'Transformer T-401 circuit'),
  'gantt.fg-005-1.label': b('Barrido inicial P-01-P-05', 'Initial sweep P-01-P-05'),
  'gantt.fg-005-2.label': b('Reconocimiento Sector Este', 'East sector reconnaissance'),
  'gantt.fg-005-3.label': b('Cierre sector P-08-P-12', 'Close-out sector P-08-P-12'),
  'gantt.fg-006-1.label': b('Seguimiento Sector A', 'Sector A follow-up'),
  'gantt.fg-006-2.label': b('Avance estructuras B-C', 'Structures B-C progress'),
  'gantt.fg-006-3.label': b('Seguimiento avance estructuras', 'Structure progress follow-up'),
  'gantt.fg-006-4.label': b('Reporte semanal obra', 'Weekly construction report'),

  // Flight plans
  'flightPlans.fp-001.name': b('Ruta Torre 12 \u2192 Torre 15', 'Route Tower 12 \u2192 Tower 15'),
  'flightPlans.fp-002.name': b('Revision corta Torre 12', 'Short review Tower 12'),
  'flightPlans.fp-002b.name': b('Circuito transformador T-401', 'Transformer T-401 circuit'),
  'flightPlans.fp-003.name': b('Circuito nocturno Torre 14', 'Night circuit Tower 14'),
  'flightPlans.fp-004.name': b('Patrulla Tramo Sur completo', 'Full South section patrol'),
  'flightPlans.fp-005.name': b('Reconocimiento Sector Este', 'East sector reconnaissance'),
  'flightPlans.fp-006.name': b('Seguimiento avance estructuras', 'Structure progress follow-up'),

  // Waypoints
  'waypoints.wp-001-1.name': b('Dock - Despegue', 'Dock - Takeoff'),
  'waypoints.wp-001-2.name': b('Torre 12 - Inspeccion', 'Tower 12 - Inspection'),
  'waypoints.wp-001-3.name': b('Torre 13 - Fotografia', 'Tower 13 - Photo'),
  'waypoints.wp-001-4.name': b('Torre 14 - Cruce de linea', 'Tower 14 - Line crossing'),
  'waypoints.wp-001-5.name': b('Torre 15 - Aterrizaje', 'Tower 15 - Landing'),
  'waypoints.wp-002-1.name': b('Dock - Despegue', 'Dock - Takeoff'),
  'waypoints.wp-002-2.name': b('Torre 12 - Hover termico', 'Tower 12 - Thermal hover'),
  'waypoints.wp-002-3.name': b('Dock - Retorno', 'Dock - Return'),
  'waypoints.wp-002b-1.name': b('Dock Norte - Despegue', 'North Dock - Takeoff'),
  'waypoints.wp-002b-2.name': b('T-401 - Vista frontal', 'T-401 - Front view'),
  'waypoints.wp-002b-3.name': b('T-401 - Termografia buchones', 'T-401 - Bushing thermography'),
  'waypoints.wp-002b-4.name': b('Celdas MT - Barrido', 'MV cells - Sweep'),
  'waypoints.wp-002b-5.name': b('Dock Norte - Aterrizaje', 'North Dock - Landing'),
  'waypoints.wp-003-1.name': b('Dock - Despegue', 'Dock - Takeoff'),
  'waypoints.wp-003-2.name': b('Torre 14 - Aisladores norte', 'Tower 14 - North insulators'),
  'waypoints.wp-003-3.name': b('Torre 14 - Aisladores sur', 'Tower 14 - South insulators'),
  'waypoints.wp-003-4.name': b('Dock - Aterrizaje', 'Dock - Landing'),
  'waypoints.wp-004-1.name': b('Dock Sur - Despegue', 'South Dock - Takeoff'),
  'waypoints.wp-004-2.name': b('Torre 21', 'Tower 21'),
  'waypoints.wp-004-3.name': b('Torre 22 - Termografia', 'Tower 22 - Thermography'),
  'waypoints.wp-004-4.name': b('Torre 23', 'Tower 23'),
  'waypoints.wp-004-5.name': b('Torre 24', 'Tower 24'),
  'waypoints.wp-004-6.name': b('Dock Sur - Aterrizaje', 'South Dock - Landing'),
  'waypoints.wp-005-1.name': b('Dock Este - Despegue', 'East Dock - Takeoff'),
  'waypoints.wp-005-2.name': b('Poste P-08', 'Pole P-08'),
  'waypoints.wp-005-3.name': b('Poste P-09 - Foto', 'Pole P-09 - Photo'),
  'waypoints.wp-005-4.name': b('Dock Este - Aterrizaje', 'East Dock - Landing'),
  'waypoints.wp-006-1.name': b('Dock Obra - Despegue', 'Site Dock - Takeoff'),
  'waypoints.wp-006-2.name': b('Sector A - Cimentacion', 'Sector A - Foundation'),
  'waypoints.wp-006-3.name': b('Sector B - Montaje columnas', 'Sector B - Column assembly'),
  'waypoints.wp-006-4.name': b('Sector C - Losas', 'Sector C - Slabs'),
  'waypoints.wp-006-5.name': b('Dock Obra - Aterrizaje', 'Site Dock - Landing'),

  // SCADA endpoints and sensors
  'scada.endpoints.ep-001.name': b('SCADA Subestacion Norte', 'North Substation SCADA'),
  'scada.endpoints.ep-002.name': b('Historian Linea 138 kV', '138 kV Line Historian'),
  'scada.endpoints.ep-003.name': b('RTU Torre 14 - Modbus', 'Tower 14 RTU - Modbus'),
  'scada.endpoints.ep-004.name': b('Broker MQTT Campo Sur', 'South Field MQTT Broker'),
  'scada.sensors.sen-001.name': b('Temperatura aceite T-401', 'T-401 oil temperature'),
  'scada.sensors.sen-002.name': b('Vibracion devanado HV', 'HV winding vibration'),
  'scada.sensors.sen-003.name': b('DGA - Hidrogeno disuelto', 'DGA - dissolved hydrogen'),
  'scada.sensors.sen-004.name': b('Descarga parcial - Aislador T07', 'Partial discharge - Insulator T07'),
  'scada.sensors.sen-005.name': b('Corriente de linea T07', 'Line current T07'),
  'scada.sensors.sen-006.name': b('Humedad en aisladores T14', 'Humidity on T14 insulators'),
  'scada.sensors.sen-007.name': b('Vibracion estructural T14', 'T14 structural vibration'),
  'scada.sensors.sen-008.name': b('Tension bushing T22', 'T22 bushing voltage'),
  'scada.assets.t401': b('Transformador T-401', 'Transformer T-401'),
  'scada.assets.t07': b('Torre 07 - Linea 138 kV Norte', 'Tower 07 - 138 kV North Line'),
  'scada.assets.t14': b('Torre 14 - Aisladores', 'Tower 14 - Insulators'),
  'scada.assets.t22': b('Torre 22 - Linea 69 kV Sur', 'Tower 22 - 69 kV South Line'),

  // Docks
  'docks.work-001.name': b('Dock Norte - Linea 138 kV', 'North Dock - 138 kV Line'),
  'docks.work-002.name': b('Dock Subestacion Norte', 'North Substation Dock'),
  'docks.work-003.name': b('Dock Torre 14', 'Tower 14 Dock'),
  'docks.work-004.name': b('Dock Sur - Linea 69 kV', 'South Dock - 69 kV Line'),
  'docks.work-005.name': b('Dock Este - Sector 34.5 kV', 'East Dock - 34.5 kV Sector'),
  'docks.work-006.name': b('Dock Obra - Montaje', 'Site Dock - Assembly'),

  // SCADA dynamic content
  'scada.preventive.recommendation': b(
    'Generar orden de mantenimiento preventivo para esta semana y programar reemplazo de cadena inferior antes del cruce de umbral critico.',
    'Generate a preventive maintenance order this week and schedule lower chain replacement before crossing the critical threshold.',
  ),
  'scada.preventive.component': b('Aislador T-4', 'Insulator T-4'),
  'scada.preventive.window': b('Esta semana', 'This week'),
  'scada.preventive.asset': b('Torre 14 - Linea 138 kV Norte', 'Tower 14 - 138 kV North Line'),

  'scada.degradation.asset.t14': b('Torre 14 - Linea 138 kV Norte', 'Tower 14 - 138 kV North Line'),
  'scada.degradation.headline': b(
    'Falla critica proyectada en 14 dias',
    'Critical failure projected in 14 days',
  ),
  'scada.degradation.detail': b(
    'Fusion de historial termico del dron (hasta 500 C) con picos de tension SCADA en la cadena de aisladores T-4. La tendencia proyectada cruza el umbral critico.',
    'Fusion of drone thermal history (up to 500 C) with SCADA voltage peaks on insulator chain T-4. Projected trend crosses the critical threshold.',
  ),

  'scada.riskMap.title': b('Mapa de riesgo estructural', 'Structural risk map'),
  'scada.riskMap.subtitle': b(
    'Linea 138 kV Norte - Torre 14 - segmento aislador T-4',
    '138 kV North Line - Tower 14 - insulator segment T-4',
  ),
  'scada.risk.zone.t4.label': b('Aislador T-4 - microfisuras', 'Insulator T-4 - microcracks'),
  'scada.risk.zone.t4.insight': b(
    'Segmentacion confirma propagacion de fisuras en disco inferior; aceleracion +34 % mes a mes.',
    'Segmentation confirms crack propagation on the lower disc; +34% month-over-month acceleration.',
  ),
  'scada.risk.zone.joint.label': b(
    'Empalme conductor - estres mecanico',
    'Conductor splice - mechanical stress',
  ),
  'scada.risk.zone.joint.insight': b(
    'Deformacion visible en grapa de retencion correlacionada con vibracion SCADA intermitente.',
    'Visible clamp deformation correlated with intermittent SCADA vibration.',
  ),
  'scada.risk.zone.crossarm.label': b('Cruceta - humedad acumulada', 'Crossarm - accumulated humidity'),
  'scada.risk.zone.crossarm.insight': b(
    'Zona de tracking superficial incipiente; riesgo moderado con tendencia ascendente.',
    'Incipient surface tracking area; moderate risk with upward trend.',
  ),
  'scada.risk.zone.base.label': b('Base torre - sin anomalia critica', 'Tower base - no critical anomaly'),
  'scada.risk.zone.base.insight': b(
    'Estructura estable; monitoreo de rutina.',
    'Stable structure; routine monitoring.',
  ),

  'scada.projection.sen001.headline': b('Umbral critico proyectado en ~9 dias', 'Critical threshold projected in ~9 days'),
  'scada.projection.sen001.detail': b(
    'La fusion de datos termicos de dron y SCADA indica un patron de desgaste dielectrico por sobrecarga termica sostenida.',
    'Fusion of drone and SCADA thermal data indicates a dielectric wear pattern caused by sustained thermal overload.',
  ),
  'scada.projection.sen004.headline': b(
    'Cruce de umbral de advertencia en ~4 dias',
    'Warning threshold crossing in ~4 days',
  ),
  'scada.projection.sen004.detail': b(
    'Correlacion imagen-SCADA confirma descarga parcial activa; proyeccion lineal con estacionalidad de carga.',
    'Image-SCADA correlation confirms active partial discharge; linear projection with load seasonality.',
  ),
  'scada.projection.sen006.headline': b(
    'Humedad sobre umbral de advertencia',
    'Humidity above warning threshold',
  ),
  'scada.projection.sen006.detail': b(
    'Patron de contaminacion + humedad elevada sugiere ventana de mantenimiento preventivo antes de temporada lluviosa.',
    'Contamination pattern plus high humidity suggests a preventive maintenance window before rainy season.',
  ),

  'scada.correlation.corr001.label': b(
    'Sobrecalentamiento en transformador',
    'Transformer overheating',
  ),
  'scada.correlation.corr001.location': b(
    'Transformador T-401 - Subestacion Norte',
    'Transformer T-401 - North Substation',
  ),
  'scada.correlation.corr001.insight': b(
    'El punto caliente termico (+12 C sobre ambiente) coincide con el incremento sostenido de temperatura de aceite SCADA en las ultimas 72 h.',
    'The thermal hotspot (+12 C above ambient) matches the sustained increase in SCADA oil temperature over the last 72h.',
  ),
  'scada.correlation.corr002.label': b('Punto caliente en bushings', 'Hot spot on bushings'),
  'scada.correlation.corr002.insight': b(
    'La anomalia visual en bushings se alinea con vibracion elevada; posible holgura mecanica o descarga interna incipiente.',
    'The visual anomaly on bushings aligns with high vibration; possible mechanical looseness or incipient internal discharge.',
  ),
  'scada.correlation.corr003.label': b(
    'Contaminacion en cadena de aisladores',
    'Insulator chain contamination',
  ),
  'scada.correlation.corr003.location': b(
    'Torre 14 - Inspeccion de aisladores',
    'Tower 14 - Insulator inspection',
  ),
  'scada.correlation.corr003.insight': b(
    'Manchas de contaminacion detectadas por vision correlacionan con humedad relativa elevada del RTU; riesgo de tracking superficial.',
    'Contamination stains detected by vision correlate with high RTU relative humidity; surface tracking risk.',
  ),
  'scada.correlation.corr004.label': b('Corona visible en empalme', 'Visible corona on splice'),
  'scada.correlation.corr004.location': b(
    'Torre 07 - Linea 138 kV Norte',
    'Tower 07 - 138 kV North Line',
  ),
  'scada.correlation.corr004.insight': b(
    'La corona en imagen RGB coincide con picos de descarga parcial del historian OPC-UA; patron de desgaste dielectrico acelerado.',
    'The corona in RGB imagery matches partial discharge spikes from the OPC-UA historian; accelerated dielectric wear pattern.',
  ),

  'scada.alarm.alarm001.title': b('Desgaste termico acelerado - T-401', 'Accelerated thermal wear - T-401'),
  'scada.alarm.alarm001.asset': b('Transformador T-401', 'Transformer T-401'),
  'scada.alarm.alarm001.imageEvidence': b(
    'Sobrecalentamiento confirmado (+12 C) en inspeccion 17/06',
    'Overheating confirmed (+12 C) in 06/17 inspection',
  ),
  'scada.alarm.alarm001.sensorEvidence': b(
    'Temperatura aceite 78.4 C y DGA H2 en 142 ppm (tendencia +18 %/sem)',
    'Oil temperature 78.4 C and DGA H2 at 142 ppm (+18%/week trend)',
  ),
  'scada.alarm.alarm002.title': b(
    'Tracking superficial incipiente - Torre 14',
    'Incipient surface tracking - Tower 14',
  ),
  'scada.alarm.alarm002.asset': b('Torre 14 - Aisladores', 'Tower 14 - Insulators'),
  'scada.alarm.alarm002.imageEvidence': b(
    'Contaminacion y manchas en 3 discos de la cadena inferior',
    'Contamination and stains on 3 discs of the lower chain',
  ),
  'scada.alarm.alarm002.sensorEvidence': b(
    'Humedad 68 %RH supera umbral; RTU Modbus con latencia degradada',
    '68% RH humidity exceeds threshold; Modbus RTU with degraded latency',
  ),
  'scada.alarm.alarm003.title': b(
    'Descarga parcial en empalme - T07',
    'Partial discharge on splice - T07',
  ),
  'scada.alarm.alarm003.asset': b('Torre 07 - Linea 138 kV Norte', 'Tower 07 - 138 kV North Line'),
  'scada.alarm.alarm003.imageEvidence': b(
    'Corona visible en empalme de conductor en vuelo nocturno',
    'Visible corona on conductor splice during night flight',
  ),
  'scada.alarm.alarm003.sensorEvidence': b(
    'PD 890 pC con tendencia ascendente desde hace 5 dias',
    'PD 890 pC with upward trend for 5 days',
  ),
  'scada.alarm.alarm004.title': b('Degradacion de bushing - T22', 'Bushing degradation - T22'),
  'scada.alarm.alarm004.asset': b('Torre 22 - Linea 69 kV Sur', 'Tower 22 - 69 kV South Line'),
  'scada.alarm.alarm004.imageEvidence': b(
    'Sin hallazgo visual critico; inspeccion programada',
    'No critical visual finding; inspection scheduled',
  ),
  'scada.alarm.alarm004.sensorEvidence': b(
    'Tension bushing 68.2 kV con tendencia descendente leve',
    'Bushing voltage 68.2 kV with slight downward trend',
  ),
}

export function getMockText(key: string, language: Language): string {
  return entries[key]?.[language] ?? entries[key]?.es ?? key
}

export function hasMockText(key: string): boolean {
  return key in entries
}

/** Resolve work name by id */
export function workName(workId: string, language: Language): string {
  return getMockText(`works.${workId}.name`, language)
}

/** Resolve detection label */
export function detectionLabel(detectionId: string, language: Language): string {
  return getMockText(`detections.${detectionId}.label`, language)
}

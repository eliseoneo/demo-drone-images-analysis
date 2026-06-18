import type { NestedMessages } from '../../types'

export const support: NestedMessages = {
  title: 'Soporte T\u00e9cnico',
  subtitle: 'Trazabilidad de endpoints, cifrado y alertas de seguridad del sistema',
  criticalAccessBanner:
    '{count} acceso externo no autorizado bloqueado | {count} accesos externos no autorizados bloqueados',
  criticalAccessDetail:
    'Se detectaron intentos desde redes fuera del per\u00edmetro corporativo. Todos fueron rechazados por el firewall de aplicaci\u00f3n.',
  unauthorizedSection: 'Accesos externos no autorizados',
  encryptionSection: 'Algoritmos de cifrado y seguridad',
  endpointTraceSection: 'Trazabilidad de llamadas a endpoints',
  complianceTitle: 'Cumplimiento on-premise',
  attemptsPerHour: 'Intentos / Hora',
  table: {
    time: 'Hora',
    service: 'Servicio',
    method: 'M\u00e9todo',
    endpoint: 'Endpoint',
    status: 'Estado',
    duration: 'Duraci\u00f3n',
    origin: 'Origen',
    correlationId: 'ID correlaci\u00f3n',
  },
  encryption: {
    tlsVersion: 'Versi\u00f3n TLS',
    cipherSuite: 'Suite de cifrado',
    keyExchange: 'Intercambio de claves',
    hashAlgorithm: 'Algoritmo hash',
    dataAtRest: 'Cifrado en reposo',
    keyStorage: 'Almac\u00e9n de claves',
    certIssuer: 'Emisor certificado',
    certExpiry: 'Expiraci\u00f3n certificado',
  },
}

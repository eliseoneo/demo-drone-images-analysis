import type { NestedMessages } from '../../types'

export const support: NestedMessages = {
  title: 'Soporte Tecnico',
  subtitle: 'Trazabilidad de endpoints, cifrado y alertas de seguridad del sistema',
  criticalAccessBanner:
    '{count} acceso externo no autorizado bloqueado | {count} accesos externos no autorizados bloqueados',
  criticalAccessDetail:
    'Se detectaron intentos desde redes fuera del perimetro corporativo. Todos fueron rechazados por el firewall de aplicacion.',
  unauthorizedSection: 'Accesos externos no autorizados',
  encryptionSection: 'Algoritmos de cifrado y seguridad',
  endpointTraceSection: 'Trazabilidad de llamadas a endpoints',
  complianceTitle: 'Cumplimiento on-premise',
  attemptsPerHour: 'Intentos / Hora',
  table: {
    time: 'Hora',
    service: 'Servicio',
    method: 'Metodo',
    endpoint: 'Endpoint',
    status: 'Estado',
    duration: 'Duracion',
    origin: 'Origen',
    correlationId: 'ID correlacion',
  },
  encryption: {
    tlsVersion: 'Version TLS',
    cipherSuite: 'Suite de cifrado',
    keyExchange: 'Intercambio de claves',
    hashAlgorithm: 'Algoritmo hash',
    dataAtRest: 'Cifrado en reposo',
    keyStorage: 'Almacen de claves',
    certIssuer: 'Emisor certificado',
    certExpiry: 'Expiracion certificado',
  },
}

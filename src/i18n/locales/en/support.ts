import type { NestedMessages } from '../../types'

export const support: NestedMessages = {
  title: 'Technical Support',
  subtitle: 'Endpoint traceability, encryption and system security alerts',
  criticalAccessBanner:
    '{count} unauthorized external access blocked | {count} unauthorized external accesses blocked',
  criticalAccessDetail:
    'Attempts from networks outside the corporate perimeter were detected. All were rejected by the application firewall.',
  unauthorizedSection: 'Unauthorized external access',
  encryptionSection: 'Encryption and security algorithms',
  endpointTraceSection: 'Endpoint call traceability',
  complianceTitle: 'On-premise compliance',
  attemptsPerHour: 'Attempts / Hour',
  table: {
    time: 'Time',
    service: 'Service',
    method: 'Method',
    endpoint: 'Endpoint',
    status: 'Status',
    duration: 'Duration',
    origin: 'Origin',
    correlationId: 'Correlation ID',
  },
  encryption: {
    tlsVersion: 'TLS version',
    cipherSuite: 'Cipher suite',
    keyExchange: 'Key exchange',
    hashAlgorithm: 'Hash algorithm',
    dataAtRest: 'Data at rest encryption',
    keyStorage: 'Key storage',
    certIssuer: 'Certificate issuer',
    certExpiry: 'Certificate expiration',
  },
}

import type { Language } from './types'

const localeMap: Record<Language, string> = {
  es: 'es-CL',
  en: 'en-US',
}

export function getLocale(language: Language): string {
  return localeMap[language]
}

export function formatDateTime(iso: string, language: Language): string {
  return new Date(iso).toLocaleString(getLocale(language), {
    dateStyle: 'short',
    timeStyle: 'medium',
  })
}

export function formatDate(iso: string, language: Language): string {
  return new Date(iso).toLocaleDateString(getLocale(language))
}

export function formatNumber(value: number, language: Language): string {
  return value.toLocaleString(getLocale(language))
}

export function formatCurrency(value: number, language: Language, currency = 'USD'): string {
  return new Intl.NumberFormat(getLocale(language), {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(value)
}

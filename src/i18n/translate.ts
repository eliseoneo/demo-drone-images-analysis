import type { Language, NestedMessages, TranslationParams } from './types'
import { en } from './locales/en'
import { es } from './locales/es'

const STORAGE_KEY = 'drone-analytics-language'

const flatCache = new Map<Language, Record<string, string>>()

function flattenMessages(messages: NestedMessages, prefix = ''): Record<string, string> {
  const result: Record<string, string> = {}
  for (const [key, value] of Object.entries(messages)) {
    const path = prefix ? `${prefix}.${key}` : key
    if (typeof value === 'string') {
      result[path] = value
    } else {
      Object.assign(result, flattenMessages(value, path))
    }
  }
  return result
}

function getFlatDictionary(language: Language): Record<string, string> {
  const cached = flatCache.get(language)
  if (cached) return cached
  const dictionary = flattenMessages(language === 'en' ? en : es)
  flatCache.set(language, dictionary)
  return dictionary
}

export function getInitialLanguage(): Language {
  if (typeof window === 'undefined') return 'es'
  const stored = window.localStorage.getItem(STORAGE_KEY)
  return stored === 'en' ? 'en' : 'es'
}

export function persistLanguage(language: Language) {
  window.localStorage.setItem(STORAGE_KEY, language)
}

export function createTranslator(language: Language) {
  const dictionary = getFlatDictionary(language)

  return function translate(key: string, params?: TranslationParams): string {
    let text = dictionary[key] ?? key
    if (!params) return text

    for (const [paramKey, paramValue] of Object.entries(params)) {
      text = text.replaceAll(`{${paramKey}}`, String(paramValue))
    }
    return text
  }
}

export type TranslateFn = ReturnType<typeof createTranslator>

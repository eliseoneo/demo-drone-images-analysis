import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import {
  createTranslator,
  detectionLabel,
  getInitialLanguage,
  getMockText,
  persistLanguage,
  workName,
  type Language,
  type TranslateFn,
  type TranslationParams,
} from '../i18n'

export type { Language }

interface LanguageContextValue {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: string, params?: TranslationParams) => string
  tm: (mockKey: string) => string
  tw: (workId: string) => string
  td: (detectionId: string) => string
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage)

  useEffect(() => {
    document.documentElement.lang = language
  }, [language])

  const value = useMemo<LanguageContextValue>(() => {
    const t = createTranslator(language)

    const setLanguage = (next: Language) => {
      setLanguageState(next)
      persistLanguage(next)
    }

    const tm = (mockKey: string) => getMockText(mockKey, language)
    const tw = (workId: string) => workName(workId, language)
    const td = (detectionId: string) => detectionLabel(detectionId, language)

    return { language, setLanguage, t, tm, tw, td }
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

export type { TranslateFn }

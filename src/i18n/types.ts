export type Language = 'es' | 'en'

export type TranslationParams = Record<string, string | number>

export type NestedMessages = {
  [key: string]: string | NestedMessages
}

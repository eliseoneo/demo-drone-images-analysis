import type { Language } from '../../context/LanguageContext'
import { useLanguage } from '../../context/LanguageContext'

const languages: { value: Language; label: string }[] = [
  { value: 'es', label: 'ES' },
  { value: 'en', label: 'EN' },
]

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage()

  return (
    <div
      className="inline-flex rounded-lg border border-slate-200 bg-white p-0.5 text-xs font-semibold shadow-sm"
      aria-label={language === 'es' ? 'Seleccionar idioma' : 'Select language'}
    >
      {languages.map((item) => (
        <button
          key={item.value}
          type="button"
          onClick={() => setLanguage(item.value)}
          className={`rounded-md px-2.5 py-1 transition-colors ${
            language === item.value
              ? 'bg-teal-600 text-white'
              : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
          }`}
          aria-pressed={language === item.value}
        >
          {item.label}
        </button>
      ))}
    </div>
  )
}

import type { TimelineEntry, TimelineLabel } from '../../types'

interface PhotoTimelineProps {
  entries: TimelineEntry[]
}

const labelStyles: Record<TimelineLabel, string> = {
  Antes: 'bg-slate-100 text-slate-600 ring-1 ring-slate-200',
  Después: 'bg-teal-50 text-teal-700 ring-1 ring-teal-200',
  'Reparación completada': 'bg-sky-50 text-sky-700 ring-1 ring-sky-200',
}

export function PhotoTimeline({ entries }: PhotoTimelineProps) {
  const grouped = entries.reduce<Record<string, TimelineEntry[]>>((acc, entry) => {
    if (!acc[entry.milestone]) acc[entry.milestone] = []
    acc[entry.milestone].push(entry)
    return acc
  }, {})

  return (
    <div className="space-y-8">
      {Object.entries(grouped).map(([milestone, items]) => (
        <section key={milestone}>
          <h3 className="mb-4 text-sm font-semibold text-slate-700">{milestone}</h3>
          <div className="relative space-y-6 pl-6 before:absolute before:bottom-0 before:left-[7px] before:top-2 before:w-px before:bg-slate-200">
            {items.map((entry) => (
              <article key={entry.id} className="relative flex gap-4">
                <div className="absolute -left-6 top-3 h-3.5 w-3.5 rounded-full border-2 border-teal-300 bg-white" />
                <img
                  src={entry.image}
                  alt={entry.title}
                  className="h-24 w-32 shrink-0 rounded-lg border border-slate-200 object-cover"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <time className="text-xs text-slate-500">{entry.date}</time>
                    <span
                      className={`rounded px-2 py-0.5 text-[10px] font-semibold uppercase ${labelStyles[entry.label]}`}
                    >
                      {entry.label}
                    </span>
                  </div>
                  <h4 className="mt-1 font-medium text-slate-800">{entry.title}</h4>
                  <p className="mt-1 text-sm text-slate-600">{entry.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}

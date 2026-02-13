'use client'

export function KanbanSkeleton() {
  return (
    <div className="flex flex-col rounded-lg h-full shadow-lg border animate-pulse" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
      {/* Header skeleton */}
      <div className="p-4 border-b rounded-t-lg" style={{ borderColor: 'var(--border-color)' }}>
        <div className="flex items-center justify-between">
          <div>
            <div className="h-4 rounded w-32 mb-2" style={{ backgroundColor: 'var(--skeleton-bg)' }}></div>
            <div className="h-3 rounded w-24" style={{ backgroundColor: 'var(--skeleton-bg)' }}></div>
          </div>
          <div className="h-6 w-8 rounded-full" style={{ backgroundColor: 'var(--skeleton-bg)' }}></div>
        </div>
      </div>

      {/* Cards skeleton */}
      <div className="flex-1 p-3 space-y-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="border rounded-lg p-4" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
            {/* Header con avatar y nombre */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2 flex-1">
                <div className="w-8 h-8 rounded-full" style={{ backgroundColor: 'var(--skeleton-bg)' }}></div>
                <div className="flex-1">
                  <div className="h-4 rounded w-32 mb-1" style={{ backgroundColor: 'var(--skeleton-bg)' }}></div>
                  <div className="h-3 rounded w-40" style={{ backgroundColor: 'var(--skeleton-bg)' }}></div>
                </div>
              </div>
            </div>

            {/* Información principal */}
            <div className="space-y-2 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded" style={{ backgroundColor: 'var(--skeleton-bg)' }}></div>
                <div className="h-3 rounded w-24" style={{ backgroundColor: 'var(--skeleton-bg)' }}></div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded" style={{ backgroundColor: 'var(--skeleton-bg)' }}></div>
                <div className="h-3 rounded w-20" style={{ backgroundColor: 'var(--skeleton-bg)' }}></div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded" style={{ backgroundColor: 'var(--skeleton-bg)' }}></div>
                <div className="h-3 rounded w-16" style={{ backgroundColor: 'var(--skeleton-bg)' }}></div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: 'var(--border-color)' }}>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded" style={{ backgroundColor: 'var(--skeleton-bg)' }}></div>
                <div className="h-3 rounded w-12" style={{ backgroundColor: 'var(--skeleton-bg)' }}></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
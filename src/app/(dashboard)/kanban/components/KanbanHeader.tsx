'use client'

import { useState } from 'react'
import { useConvocatorias } from '@/hooks/useConvocatorias'
import { PRIORIDAD_COLORES } from '../lib/kanban.constants'
import { Button } from '@/components/ui/button'
import { SelectSearch } from '@/components/ui/select-search'
import { Badge } from '@/components/ui/badge'
import { Filter, AlertTriangle, Users, CheckCircle, Clock, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface KanbanHeaderProps {
  convocatoriaSeleccionada?: string | null
  onConvocatoriaChange?: (convocatoriaId: string | null) => void
  onToggleDuplicados?: (soloDuplicados: boolean) => void
  mostrarSoloDuplicados?: boolean
  estadisticas?: {
    totalAplicaciones: number
    aplicacionesActivas: number
    finalizadas: number
    descartadas: number
  }
}

export function KanbanHeader({
  convocatoriaSeleccionada,
  onConvocatoriaChange,
  onToggleDuplicados,
  mostrarSoloDuplicados = false,
  estadisticas,
}: KanbanHeaderProps) {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)

  // Obtener convocatorias del backend
  const { convocatorias, loading } = useConvocatorias({ limit: 100 })

  const convocatoriaActual = convocatorias.find(c => c.id === convocatoriaSeleccionada)

  return (
    <div className="border-b rounded-md px-4 sm:px-6 py-4" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Título y descripción */}
        <div className="flex-1">
          <h1 className="text-md font-bold" style={{ color: 'var(--text-on-content-bg-heading)' }}>Kanban de Candidatos</h1>
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            Gestiona las aplicaciones por estado y sigue el proceso de selección
          </p>
        </div>

        {/* Estadísticas rápidas - Ocultas en móviles, compactas en tablet, completas en desktop */}
        {estadisticas && (
          <div className="hidden sm:flex items-center gap-2 sm:gap-4 lg:mr-6">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {estadisticas.totalAplicaciones}
              </span>
              <span className="text-xs text-gray-600 dark:text-gray-400">Total</span>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-700" />
              <span className="text-sm font-medium" style={{ color: 'var(--text-on-content-bg)' }}>
                {estadisticas.aplicacionesActivas}
              </span>
              <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>Activas</span>
            </div>

            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-700" />
              <span className="text-sm font-medium" style={{ color: 'var(--text-on-content-bg)' }}>
                {estadisticas.finalizadas}
              </span>
              <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>Finalizadas</span>
            </div>

            <div className="flex items-center gap-2">
              <XCircle className="w-4 h-4 text-red-700" />
              <span className="text-sm font-medium" style={{ color: 'var(--text-on-content-bg)' }}>
                {estadisticas.descartadas}
              </span>
              <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>Descartadas</span>
            </div>
          </div>
        )}

        {/* Controles de filtros */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full lg:w-auto">
          {/* Selector de convocatoria */}
          <div className="w-full sm:min-w-50 lg:min-w-62.5">
            <SelectSearch
              value={convocatoriaSeleccionada || ''}
              onChange={(value) => onConvocatoriaChange?.(value || '')}
              placeholder="Seleccionar convocatoria"
              disabled={loading}
              isLoading={loading}
              showSearchIcon={true}
              options={[
              
                ...convocatorias.map((convocatoria) => ({
                  value: convocatoria.id,
                  label: `${convocatoria.cargo_nombre || 'Sin cargo'} - ${convocatoria.prioridad}`
                }))
              ]}
            />
          </div>

          
        </div>
      </div>

     

      
    </div>
  )
}
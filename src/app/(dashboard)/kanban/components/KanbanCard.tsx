'use client'

import { AplicacionCandidato } from '../lib/kanban.types'
import { ESTADO_COLORES, PRIORIDAD_COLORES, COMPONENTE_COLORES, KANBAN_ESTADOS } from '../lib/kanban.constants'
import { User, MapPin, DollarSign, Clock, Trophy, AlertTriangle, FileText } from 'lucide-react'

// Genera un color determinístico y estable a partir de un id (convocatoriaId)
// - No varía entre renders
// - Usa una paleta de tonos espaciados para mejorar contraste y reducir repeticiones verdes
function getConvocatoriaColor(id: string): string {
  let hash = 0

  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash)
    hash |= 0
  }

  const hue = Math.abs(hash) % 360

  // Variación controlada pero consistente
  const saturation = 60 + (Math.abs(hash >> 3) % 20) // 60–79%
  const lightness = 40 + (Math.abs(hash >> 6) % 15)  // 40–54%

  return `hsl(${hue} ${saturation}% ${lightness}%)`
}


interface KanbanCardProps {
  aplicacion: AplicacionCandidato
  onClick?: () => void
}

export function KanbanCard({ aplicacion, onClick }: KanbanCardProps) {
  const nombreCompleto = aplicacion.candidato
    ? `${aplicacion.candidato.nombres} ${aplicacion.candidato.apellidoPaterno} ${aplicacion.candidato.apellidoMaterno}`.trim()
    : 'Candidato sin información'

  // Formatear pretensión económica
  const pretensionFormateada = new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
    minimumFractionDigits: 0,
  }).format(aplicacion.pretensionEconomica)

  // Calcular días en estado actual
  const diasEnEstado = aplicacion.tiempoEnEstadoDias || 0

  // Determinar si es posible candidato
  const esPosibleCandidato = aplicacion.estadoKanban === KANBAN_ESTADOS.POSIBLES_CANDIDATOS

  // Id de convocatoria estable: preferimos el objeto `convocatoria.id`, si no existe usar `convocatoriaId`
  const identificadorConvocatoria = aplicacion.convocatoria?.id ?? aplicacion.convocatoriaId

  return (
    <div
      onDoubleClick={onClick}
      className={`
        relative border rounded-lg p-4 pl-4 shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer
        ${esPosibleCandidato ? 'border-amber-300 shadow-amber-100' : ''}
        ${onClick ? 'hover:border-blue-300 hover:scale-[1.02]' : ''}
      `}
      style={{
        backgroundColor: esPosibleCandidato ? COMPONENTE_COLORES.POSIBLES_CANDIDATOS.background : 'var(--card-bg)',
        borderColor: esPosibleCandidato ? COMPONENTE_COLORES.POSIBLES_CANDIDATOS.border : 'var(--border-color)'
      }}
      title="Doble click para ver detalles"
    >
      {/* Barra vertical que identifica la convocatoria: más delgada y sutil */}
      {identificadorConvocatoria && (
        <div
          aria-hidden
          className="absolute left-0 top-0 bottom-0 w-0.75 z-10 rounded-l-sm"
          style={{
            backgroundColor: getConvocatoriaColor(identificadorConvocatoria),
            opacity: 0.9,
            boxShadow: 'inset 1px 0 0 rgba(0,0,0,0.04)'
          }}
        />
      )}
      {/* Header con nombre y avatar */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: COMPONENTE_COLORES.AVATAR }}>
            <User className="w-4 h-4 text-blue-600" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-medium text-sm truncate" style={{ color: 'var(--text-on-content-bg-heading)' }}>
              {nombreCompleto}
            </h3>
            <p className="text-xs truncate" style={{ color: 'var(--text-secondary)' }}>
              {aplicacion.candidato?.correo || 'Sin correo'}
            </p>
          </div>
        </div>

        {/* Badge de prioridad para posibles candidatos */}
        {esPosibleCandidato && aplicacion.ordenPrioridad && (
          <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium shrink-0" style={{ backgroundColor: COMPONENTE_COLORES.POSIBLES_CANDIDATOS.background, color: COMPONENTE_COLORES.POSIBLES_CANDIDATOS.text }}>
            <Trophy className="w-3 h-3" />
            #{aplicacion.ordenPrioridad}
          </div>
        )}
      </div>

      {/* Información principal */}
      <div className="space-y-2 mb-3">
        <div className="flex items-center gap-2">
          <MapPin className="w-3 h-3" style={{ color: 'var(--text-secondary)' }} />
          <span className="text-xs" style={{ color: 'var(--text-primary)' }}>
            {aplicacion.convocatoria?.cargoNombre || 'Sin cargo'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <FileText className="w-3 h-3" style={{ color: 'var(--text-secondary)' }} />
          <span className="text-xs" style={{ color: 'var(--text-primary)' }}>
            {aplicacion.aniosExperienciaPuesto} años exp.
          </span>
        </div>

        <div className="flex items-center gap-2">
          <DollarSign className="w-3 h-3" style={{ color: 'var(--text-secondary)' }} />
          <span className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
            {pretensionFormateada}
          </span>
        </div>
      </div>

      {/* Alerta de duplicado */}
      {aplicacion.posibleDuplicado && (
        <div className="flex items-center gap-2 mb-3 p-2 rounded-md" style={{ backgroundColor: COMPONENTE_COLORES.DUPLICADO.background, border: `1px solid ${COMPONENTE_COLORES.DUPLICADO.border}` }}>
          <AlertTriangle className="w-4 h-4 text-yellow-600" />
          <span className="text-xs font-medium" style={{ color: COMPONENTE_COLORES.DUPLICADO.text }}>
            Posible duplicado ({aplicacion.similitudPorcentaje?.toFixed(0)}%)
          </span>
        </div>
      )}

      {/* Footer con tiempo en estado */}
      <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: 'var(--border-color)' }}>
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3" style={{ color: 'var(--text-secondary)' }} />
          <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            {diasEnEstado === 0 ? 'Hoy' : `${diasEnEstado} día${diasEnEstado !== 1 ? 's' : ''}`}
          </span>
        </div>

        {/* Badge de repostulación */}
        {aplicacion.esRepostulacion && (
          <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: COMPONENTE_COLORES.REPOSTULACION.background, color: COMPONENTE_COLORES.REPOSTULACION.text }}>
            Repostulación
          </span>
        )}

        {/* Badge de posible candidato activado */}
        {aplicacion.esPosibleCandidatoActivado && (
          <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: COMPONENTE_COLORES.ACTIVADO.background, color: COMPONENTE_COLORES.ACTIVADO.text }}>
            Activado
          </span>
        )}
      </div>

      {/* Información de expiración para posibles candidatos */}
      {esPosibleCandidato && aplicacion.fechaExpiracionPosibles && (
        <div className="mt-2 pt-2 border-t" style={{ borderColor: COMPONENTE_COLORES.POSIBLES_CANDIDATOS.border }}>
          <div className="text-xs" style={{ color: COMPONENTE_COLORES.POSIBLES_CANDIDATOS.text }}>
            Expira: {new Date(aplicacion.fechaExpiracionPosibles).toLocaleDateString('es-ES', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            })}
          </div>
        </div>
      )}
    </div>
  )
}
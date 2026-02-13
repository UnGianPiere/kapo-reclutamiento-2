'use client'

import { useState } from 'react'
import { AplicacionCandidato } from './lib/kanban.types'
import { KanbanHeader } from './components/KanbanHeader'
import { KanbanBoard } from './KanbanBoard'
import CandidateModal from './components/modals/candidato/CandidateModal'

export default function KanbanPage() {
  const [convocatoriaSeleccionada, setConvocatoriaSeleccionada] = useState<string | null>(null)
  const [mostrarSoloDuplicados, setMostrarSoloDuplicados] = useState(false)
  const [selectedAplicacion, setSelectedAplicacion] = useState<AplicacionCandidato | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

 

  // Handler para cuando se hace click en una aplicación
  const handleAplicacionClick = (aplicacion: AplicacionCandidato) => {
    setSelectedAplicacion(aplicacion)
    setIsModalOpen(true)
  }

  // Handler para cerrar el modal
  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedAplicacion(null)
  }

  // Handler para cambio de convocatoria
  const handleConvocatoriaChange = (convocatoriaId: string | null) => {
    setConvocatoriaSeleccionada(convocatoriaId)
    console.log('Convocatoria seleccionada:', convocatoriaId)
  }

  // Handler para toggle de duplicados
  const handleToggleDuplicados = (soloDuplicados: boolean) => {
    setMostrarSoloDuplicados(soloDuplicados)
    console.log('Mostrar solo duplicados:', soloDuplicados)
  }

  return (
    <div className="flex flex-col h-full" >
      {/* Header con filtros */}
      <KanbanHeader
        convocatoriaSeleccionada={convocatoriaSeleccionada}
        onConvocatoriaChange={handleConvocatoriaChange}
        onToggleDuplicados={handleToggleDuplicados}
        mostrarSoloDuplicados={mostrarSoloDuplicados}
      />

      {/* Board principal */}
      <div className="flex-1 overflow-hidden -mb-6">
        <KanbanBoard
          convocatoriaId={convocatoriaSeleccionada || undefined}
          onAplicacionClick={handleAplicacionClick}
        />
      </div>

      {/* Modal de detalle del candidato */}
      {selectedAplicacion && (
        <CandidateModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          aplicacion={selectedAplicacion}
        />
      )}
    </div>
  )
}
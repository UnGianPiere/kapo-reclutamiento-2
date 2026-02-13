'use client'

import React, { useState } from 'react'
import Modal from '@/components/ui/modal'
import { AplicacionCandidato } from '@/app/(dashboard)/kanban/lib/kanban.types'
import { KANBAN_ESTADOS, type EstadoKanban } from '@/app/(dashboard)/kanban/lib/kanban.constants'
import { RecepcionCVTab } from './tabs/RecepcionCVTab'
import { LlamadaTab } from './tabs/LlamadaTab'
import { User, FileText, Phone, Calendar, CheckCircle, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCambiarEstadoKanban } from '@/hooks'
import { showSuccess, showError, TOAST_DURATIONS } from '@/lib/toast-utils'

interface CandidateModalProps {
    isOpen: boolean
    onClose: () => void
    aplicacion: AplicacionCandidato
}

// Configuración de tabs según el estado
const getTabsForEstado = (estado: EstadoKanban) => {
    const allTabs = [
        { id: 'recepcion', label: 'Recepción CV', icon: FileText, estados: [KANBAN_ESTADOS.CVS_RECIBIDOS] as EstadoKanban[] },
        { id: 'llamada', label: 'Llamada', icon: Phone, estados: [KANBAN_ESTADOS.POR_LLAMAR, KANBAN_ESTADOS.ENTREVISTA_PREVIA] as EstadoKanban[] },
        { id: 'entrevistas', label: 'Entrevistas', icon: Calendar, estados: [KANBAN_ESTADOS.PROGRAMAR_1RA_ENTREVISTA, KANBAN_ESTADOS.PROGRAMAR_2DA_ENTREVISTA] as EstadoKanban[] },
        { id: 'referencias', label: 'Referencias', icon: CheckCircle, estados: [KANBAN_ESTADOS.REFERENCIAS] as EstadoKanban[] },
        { id: 'documentos', label: 'Documentos', icon: FileText, estados: [KANBAN_ESTADOS.EVALUACION_ANTISOBORNO] as EstadoKanban[] },
        { id: 'aprobacion', label: 'Aprobación', icon: CheckCircle, estados: [KANBAN_ESTADOS.APROBACION_GERENCIA] as EstadoKanban[] },
    ]

    // Filtrar tabs según el estado actual
    // Por ejemplo, si está en CVS_RECIBIDOS, solo muestra el primer tab
    // Si está en POR_LLAMAR, muestra recepcion + llamada, etc.

    const estadosArray = Object.values(KANBAN_ESTADOS)
    const estadoIndex = estadosArray.indexOf(estado)

    return allTabs.filter(tab => {
        const tabMaxEstado = Math.max(...tab.estados.map(e => estadosArray.indexOf(e)))
        return tabMaxEstado <= estadoIndex || tab.estados.includes(estado)
    })
}

// Función para determinar el tab inicial según el estado
const getInitialTab = (estado: EstadoKanban): string => {
    switch (estado) {
        case KANBAN_ESTADOS.POR_LLAMAR:
            return 'llamada'
        default:
            return 'recepcion'
    }
}

export default function CandidateModal({ isOpen, onClose, aplicacion }: CandidateModalProps) {
    const [activeTab, setActiveTab] = useState(() => getInitialTab(aplicacion.estadoKanban))

    // Actualizar el tab activo cuando cambie la aplicación
    React.useEffect(() => {
        setActiveTab(getInitialTab(aplicacion.estadoKanban))
    }, [aplicacion.id, aplicacion.estadoKanban])

    // Hook para cambiar estado kanban
    const { cambiarEstado, loading: loadingCambioEstado } = useCambiarEstadoKanban()

    // Función para aprobar candidato (pasar a POR_LLAMAR)
    const handleAprobar = async () => {

        try {
            await cambiarEstado({
                id: aplicacion.id,
                estadoKanban: KANBAN_ESTADOS.POR_LLAMAR,
                candidatoId: aplicacion.candidatoId,
                motivo: 'Aprobación desde recepción de CV',
                comentarios: 'Candidato aprobado para continuar con el proceso'
            })
            showSuccess('Candidato aprobado correctamente', { duration: TOAST_DURATIONS.NORMAL })
            onClose()
        } catch (error) {
            console.error('Error al aprobar candidato:', error)
            showError('Error al aprobar candidato. Inténtalo nuevamente.', { duration: TOAST_DURATIONS.LONG })
        }
    }

    // Función para rechazar candidato (pasar a DESCARTADO)
    const handleRechazar = async () => {
        try {
            await cambiarEstado({
                id: aplicacion.id,
                estadoKanban: KANBAN_ESTADOS.DESCARTADO,
                candidatoId: aplicacion.candidatoId,
                motivo: 'Rechazo manual desde recepción de CV',
                comentarios: 'Candidato rechazado por el reclutador'
            })
            showSuccess('Candidato rechazado correctamente', { duration: TOAST_DURATIONS.NORMAL })
            onClose()
        } catch (error) {
            console.error('Error al rechazar candidato:', error)
            showError('Error al rechazar candidato. Inténtalo nuevamente.', { duration: TOAST_DURATIONS.LONG })
        }
    }

    const nombreCompleto = aplicacion.candidato
        ? `${aplicacion.candidato.nombres} ${aplicacion.candidato.apellidoPaterno} ${aplicacion.candidato.apellidoMaterno}`.trim()
        : 'Candidato'

    const tabs = getTabsForEstado(aplicacion.estadoKanban)

    // Renderizar contenido del tab activo
    const renderTabContent = () => {
        switch (activeTab) {
            case 'recepcion':
                return <RecepcionCVTab aplicacion={aplicacion} />
            case 'llamada':
                return <LlamadaTab aplicacion={aplicacion} />
            case 'entrevistas':
                return <div className="p-4 text-center" style={{ color: 'var(--text-secondary)' }}>Tab de Entrevistas (próximamente)</div>
            case 'referencias':
                return <div className="p-4 text-center" style={{ color: 'var(--text-secondary)' }}>Tab de Referencias (próximamente)</div>
            case 'documentos':
                return <div className="p-4 text-center" style={{ color: 'var(--text-secondary)' }}>Tab de Documentos (próximamente)</div>
            case 'aprobacion':
                return <div className="p-4 text-center" style={{ color: 'var(--text-secondary)' }}>Tab de Aprobación (próximamente)</div>
            default:
                return null
        }
    }

    const modalTitle = (
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--primary-color-10)' }}>
                <User className="w-5 h-5" style={{ color: 'var(--primary-color)' }} />
            </div>
            <div>
                <h2 className="text-sm font-bold" style={{ color: 'var(--text-on-content-bg-heading)' }}>
                    {nombreCompleto}
                </h2>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    {aplicacion.convocatoria?.cargoNombre || 'Sin cargo'}
                </p>
            </div>
        </div>
    )

    const modalFooter = (
        <div className="flex items-center justify-between px-4">
            <div></div>
            <div className="flex gap-2">
                <Button
                    variant="custom"
                    color="danger"
                    size="xs"
                    icon={<XCircle className="w-4 h-4" />}
                    onClick={handleRechazar}
                    disabled={loadingCambioEstado}
                >
                    {loadingCambioEstado ? 'Procesando...' : 'Rechazar'}
                </Button>
                <Button
                    variant="custom"
                    color="primary"
                    size="xs"
                    icon={<CheckCircle className="w-4 h-4" />}
                    onClick={handleAprobar}
                    disabled={loadingCambioEstado}
                >
                    {loadingCambioEstado ? 'Procesando...' : 'Aprobar'}
                </Button>
            </div>
        </div>
    )

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={modalTitle}
            size="xl"
            footer={modalFooter}
        >
            {/* Tabs */}
            <div className="border-b mb-6" style={{ borderColor: 'var(--border-color)' }}>
                <div className="flex gap-1 overflow-x-auto">
                    {tabs.map((tab) => {
                        const Icon = tab.icon
                        const isActive = activeTab === tab.id

                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className="flex items-center gap-1.5 px-4 py-3 text-xs transition-colors border-b-2"
                                style={{
                                    color: isActive ? 'var(--primary-color)' : 'var(--text-secondary)',
                                    borderColor: isActive ? 'var(--primary-color)' : 'transparent',
                                }}
                            >
                                <Icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* Contenido del tab activo */}
            <div className="min-h-100">
                {renderTabContent()}
            </div>
        </Modal>
    )
}
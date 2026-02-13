/**
 * 🎣 USE APLICACIONES - Hook personalizado para gestión de aplicaciones de candidatos
 *
 * Responsabilidad: Manejar estado y operaciones de aplicaciones
 * Flujo: Importado por componentes → Conecta con GraphQL backend
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { graphqlRequest } from '@/lib/graphql-client'
import { CAMBIAR_ESTADO_KANBAN_MUTATION } from '@/graphql/mutations'
import { EstadoKanban, KANBAN_ESTADOS } from '@/app/(dashboard)/kanban/lib/kanban.constants'
import { useAuth } from '@/context/auth-context'
import { useRegistrarCambioHistorial, TipoCambioHistorial } from './useHistorialCandidato'

export interface AplicacionBasica {
  id: string
  estadoKanban: EstadoKanban
}

/**
 * Hook para cambiar el estado kanban de una aplicación
 */
export function useCambiarEstadoKanban() {
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const { registrarCambio } = useRegistrarCambioHistorial()

  // Función auxiliar para determinar el tipo de cambio
  const determinarTipoCambio = (estadoAnterior: EstadoKanban, estadoNuevo: EstadoKanban): TipoCambioHistorial => {
    // Aprobaciones
    if (estadoAnterior === KANBAN_ESTADOS.CVS_RECIBIDOS && estadoNuevo === KANBAN_ESTADOS.POR_LLAMAR) {
      return 'APROBACION'
    }

    // Rechazos
    if (estadoNuevo === 'DESCARTADO' as EstadoKanban || estadoNuevo === 'RECHAZADO_POR_CANDIDATO' as EstadoKanban) {
      return 'RECHAZO'
    }

    // Reactivaciones
    if ((estadoAnterior === 'DESCARTADO' as EstadoKanban || estadoAnterior === 'RECHAZADO_POR_CANDIDATO' as EstadoKanban)
        && estadoNuevo !== 'DESCARTADO' as EstadoKanban && estadoNuevo !== 'RECHAZADO_POR_CANDIDATO' as EstadoKanban) {
      return 'REACTIVACION'
    }

    // Movimientos normales en el proceso
    return 'MOVIMIENTO'
  }

  const mutation = useMutation({
    mutationFn: async ({
      id,
      estadoKanban,
      motivo,
      comentarios,
      candidatoId
    }: {
      id: string;
      estadoKanban: EstadoKanban;
      motivo?: string;
      comentarios?: string;
      candidatoId?: string;
    }) => {
      // Obtener datos actuales de la aplicación para el estado anterior
      const aplicacionActual = queryClient.getQueryData(['aplicacion', id]) as any
      const estadoAnterior = aplicacionActual?.estadoKanban || aplicacionActual?.estado || 'CVS_RECIBIDOS'

      // Ejecutar el cambio de estado
      const response = await graphqlRequest<{
        cambiarEstadoKanban: AplicacionBasica
      }>(CAMBIAR_ESTADO_KANBAN_MUTATION, { id, estadoKanban })

      // Registrar en el historial
      try {
        await registrarCambio({
          candidatoId: candidatoId || aplicacionActual?.candidatoId || '',
          aplicacionId: id,
          estadoAnterior,
          estadoNuevo: estadoKanban,
          tipoCambio: determinarTipoCambio(estadoAnterior, estadoKanban),
          realizadoPor: user?.id || '',
          realizadoPorNombre: user?.nombresA || 'Sistema',
          motivo,
          comentarios
        })
      } catch (error) {
        console.error('Error al registrar cambio en historial:', error)
        // No fallar la operación principal por error en logging
      }

      return response.cambiarEstadoKanban
    },
    onSuccess: (data) => {
      // Invalidar queries relacionadas para refrescar datos
      queryClient.invalidateQueries({ queryKey: ['aplicaciones'] })
      queryClient.invalidateQueries({ queryKey: ['aplicacion', data.id] })
      queryClient.invalidateQueries({ queryKey: ['kanban-data'] })
      queryClient.invalidateQueries({ queryKey: ['estadisticas-convocatoria'] })

      // Actualizar el estado local si existe en cache
      queryClient.setQueryData(['aplicacion', data.id], (oldData: any) => {
        if (oldData) {
          return { ...oldData, estadoKanban: data.estadoKanban }
        }
        return oldData
      })
    },
  })

  return {
    cambiarEstado: mutation.mutateAsync,
    loading: mutation.isPending,
    error: mutation.error,
    data: mutation.data,
  }
}
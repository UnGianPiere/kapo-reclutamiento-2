'use client'

import { useEffect, useState } from 'react'
import { AplicacionCandidato, KanbanBoardProps } from './lib/kanban.types'
import { KANBAN_ESTADOS } from './lib/kanban.constants'
import { KanbanColumn } from './components/KanbanColumn'
import { KanbanSkeleton } from './components/KanbanSkeleton'
import { useQuery } from '@tanstack/react-query'
import { graphqlRequest } from '@/lib/graphql-client'
import { GET_KANBAN_DATA_QUERY, LISTAR_APLICACIONES_QUERY } from '@/graphql/queries'

// Estados del kanban en orden de flujo
const ESTADOS_ORDENADOS = [
  KANBAN_ESTADOS.CVS_RECIBIDOS,
  KANBAN_ESTADOS.POR_LLAMAR,
  KANBAN_ESTADOS.ENTREVISTA_PREVIA,
  KANBAN_ESTADOS.PROGRAMAR_1RA_ENTREVISTA,
  KANBAN_ESTADOS.PROGRAMAR_2DA_ENTREVISTA,
  KANBAN_ESTADOS.REFERENCIAS,
  KANBAN_ESTADOS.EVALUACION_ANTISOBORNO,
  KANBAN_ESTADOS.APROBACION_GERENCIA,
  KANBAN_ESTADOS.LLAMAR_COMUNICAR_ENTRADA,
  KANBAN_ESTADOS.FINALIZADA,
  KANBAN_ESTADOS.RECHAZADO_POR_CANDIDATO,
  KANBAN_ESTADOS.DESCARTADO,
  KANBAN_ESTADOS.POSIBLES_CANDIDATOS,
] as const

interface EstadoColumnData {
  aplicaciones: AplicacionCandidato[]
  cursor?: string
  hasNextPage: boolean
  totalCount: number
  isLoading: boolean
}

export function KanbanBoard({ convocatoriaId, onAplicacionClick }: KanbanBoardProps) {
  const [columnasData, setColumnasData] = useState<Record<string, EstadoColumnData>>({})

  // Cargar datos iniciales con GraphQL - UNA SOLA QUERY PARA TODAS LAS COLUMNAS
  const { data: kanbanData, isLoading: isInitialLoading, error, refetch } = useQuery({
    queryKey: ['kanban-data', convocatoriaId || 'all'],
    queryFn: async () => {
      const response = await graphqlRequest<{
        getKanbanData: Record<string, {
          aplicaciones: AplicacionCandidato[]
          total: number
          hasNextPage: boolean
        }>
      }>(GET_KANBAN_DATA_QUERY, {
        convocatoriaId, // Puede ser undefined para mostrar todas las convocatorias
      })
      return response
    },
    // enabled: true, // Siempre ejecutar (con o sin convocatoria)
    staleTime: 2 * 60 * 1000, // 2 minutos
    gcTime: 5 * 60 * 1000, // 5 minutos
  })

  // Procesar datos estructurados por columnas (ya vienen organizados del backend)
  useEffect(() => {
    if (!kanbanData?.getKanbanData) {
      // Si no hay datos, inicializar columnas vacías
      const columnasVacias: Record<string, EstadoColumnData> = {}
      ESTADOS_ORDENADOS.forEach(estado => {
        columnasVacias[estado] = {
          aplicaciones: [],
          cursor: '0',
          hasNextPage: false,
          totalCount: 0,
          isLoading: false,
        }
      })
      setColumnasData(columnasVacias)
      return
    }

    const nuevasColumnasData: Record<string, EstadoColumnData> = {}

    // Procesar cada columna que viene del backend
    ESTADOS_ORDENADOS.forEach(estado => {
      const columnaData = kanbanData.getKanbanData[estado]
      if (columnaData) {
        nuevasColumnasData[estado] = {
          aplicaciones: columnaData.aplicaciones,
          cursor: columnaData.aplicaciones.length.toString(),
          hasNextPage: columnaData.hasNextPage,
          totalCount: columnaData.total,
          isLoading: false,
        }
      } else {
        // Fallback por si falta alguna columna
        nuevasColumnasData[estado] = {
          aplicaciones: [],
          cursor: '0',
          hasNextPage: false,
          totalCount: 0,
          isLoading: false,
        }
      }
    })

    setColumnasData(nuevasColumnasData)
  }, [kanbanData])

  // Función para cargar más aplicaciones en una columna específica
  const handleLoadMore = async (estado: string) => {
    const columnaActual = columnasData[estado]
    if (!columnaActual || !columnaActual.hasNextPage) return

    // Marcar como cargando
    setColumnasData(prev => ({
      ...prev,
      [estado]: {
        ...prev[estado],
        isLoading: true,
      },
    }))

    try {
      // Cargar más aplicaciones del mismo estado con offset
      const offset = columnaActual.aplicaciones.length
      const response = await graphqlRequest<{
        listarAplicaciones: {
          aplicaciones: AplicacionCandidato[]
          total: number
        }
      }>(LISTAR_APLICACIONES_QUERY, {
        estadoKanban: estado as any, // Type assertion para GraphQL enum
        convocatoriaId,
        limit: 20,
        offset,
      })

      const nuevasAplicaciones = response?.listarAplicaciones?.aplicaciones || []

      setColumnasData(prev => ({
        ...prev,
        [estado]: {
          aplicaciones: [...prev[estado].aplicaciones, ...nuevasAplicaciones],
          cursor: (offset + 20).toString(),
          hasNextPage: nuevasAplicaciones.length >= 20,
          totalCount: prev[estado].totalCount,
          isLoading: false,
        },
      }))
    } catch (error) {
      console.error(`Error cargando más aplicaciones para ${estado}:`, error)
      setColumnasData(prev => ({
        ...prev,
        [estado]: {
          ...prev[estado],
          isLoading: false,
        },
      }))
    }
  }

  // Nota: Ahora siempre se muestran aplicaciones (todas las convocatorias si no hay filtro)

  return (
    <div className="h-full flex gap-3 overflow-x-auto py-3" >
      {ESTADOS_ORDENADOS.map((estado) => {
        const columnaData = columnasData[estado]

        return (
          <div key={estado} className="shrink-0 w-65">
            {isInitialLoading || !columnaData ? (
              <KanbanSkeleton />
            ) : (
              <KanbanColumn
                estado={estado}
                aplicaciones={columnaData.aplicaciones}
                isLoading={columnaData.isLoading}
                onLoadMore={() => handleLoadMore(estado)}
                hasNextPage={columnaData.hasNextPage}
                totalCount={columnaData.totalCount}
                onAplicacionClick={onAplicacionClick}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
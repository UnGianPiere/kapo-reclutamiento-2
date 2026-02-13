import { useState, useCallback } from 'react'
import { AplicacionCandidato } from '../lib/kanban.types'

export interface DragState {
  draggedItem: AplicacionCandidato | null
  dragOverColumn: string | null
}

export function useKanbanDrag() {
  const [dragState, setDragState] = useState<DragState>({
    draggedItem: null,
    dragOverColumn: null,
  })

  const handleDragStart = useCallback((item: AplicacionCandidato) => {
    setDragState(prev => ({
      ...prev,
      draggedItem: item,
    }))
  }, [])

  const handleDragOver = useCallback((columnId: string) => {
    setDragState(prev => ({
      ...prev,
      dragOverColumn: columnId,
    }))
  }, [])

  const handleDragEnd = useCallback(() => {
    setDragState({
      draggedItem: null,
      dragOverColumn: null,
    })
  }, [])

  const handleDrop = useCallback((targetColumnId: string, onMoveItem?: (item: AplicacionCandidato, targetColumn: string) => void) => {
    if (dragState.draggedItem && onMoveItem) {
      onMoveItem(dragState.draggedItem, targetColumnId)
    }
    handleDragEnd()
  }, [dragState.draggedItem, handleDragEnd])

  return {
    dragState,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleDrop,
  }
}
import React, { useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from './button'

export interface Column<T = any> {
  key: string
  header: string
  render?: (value: any, row: T) => React.ReactNode
  className?: string
}

export interface StatusConfig {
  [key: string]: {
    label: string
    color: string
  }
}

export interface DataTableProps<T = any> {
  data: T[]
  columns: Column<T>[]
  title?: string
  subtitle?: string
  rowsPerPage?: number
  showPagination?: boolean
  fixedRows?: number // Número de filas para calcular altura mínima (sin rellenar con vacías)
  serverPagination?: {
    currentPage: number
    totalPages: number
    totalCount: number
    onPageChange: (page: number) => void
  }
  statusConfig?: StatusConfig
  className?: string
  emptyMessage?: string
}

export function DataTable<T = any>({
  data,
  columns,
  title,
  subtitle,
  rowsPerPage = 10,
  showPagination = true,
  fixedRows,
  serverPagination,
  statusConfig = {
    active: { label: 'Activo', color: 'bg-green-500' },
    pending: { label: 'Pendiente', color: 'bg-yellow-500' },
    inactive: { label: 'Inactivo', color: 'bg-gray-500' }
  },
  className = '',
  emptyMessage = 'No hay datos disponibles'
}: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1)
  const [jumpToPage, setJumpToPage] = useState('')

  const displayRows = fixedRows || rowsPerPage
  const totalPages = Math.ceil(data.length / displayRows)

  const paginatedData = useMemo(() => {
    if (!showPagination) {
      return data
    }

    // Con paginación: obtener datos de la página actual
    const displayRows = fixedRows || rowsPerPage
    const start = (currentPage - 1) * displayRows
    const end = start + displayRows
    return data.slice(start, end)
  }, [data, currentPage, rowsPerPage, fixedRows, showPagination])

  const paginationInfo = useMemo(() => {
    if (!showPagination) return ''

    if (data.length === 0) {
      return 'Sin registros'
    }

    if (data.length === 1) {
      return 'Mostrando 1 de 1'
    }

    const start = (currentPage - 1) * displayRows + 1
    const end = Math.min(currentPage * displayRows, data.length)
    return `Mostrando ${start}-${end} de ${data.length}`
  }, [currentPage, displayRows, data.length, showPagination])

  const pageNumbers = useMemo(() => {
    if (!showPagination || totalPages <= 1) return []

    const pages: (number | string)[] = []

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages)
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages)
      }
    }

    return pages
  }, [currentPage, totalPages, showPagination])

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const handleJumpToPage = () => {
    const page = parseInt(jumpToPage)
    if (!isNaN(page) && page >= 1 && page <= totalPages) {
      setCurrentPage(page)
      setJumpToPage('')
    }
  }

  const handleJumpKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleJumpToPage()
    }
  }

  const renderCell = (row: T, column: Column<T>) => {
    const value = (row as any)[column.key]

    if (column.render) {
      return column.render(value, row)
    }

    // Render especial para estados
    if (column.key === 'estado' && statusConfig[value]) {
      const status = statusConfig[value]
      return (
        <span className="status status-active">
          <span className={`status-dot ${status.color}`}></span>
          {status.label}
        </span>
      )
    }

    // Render especial para métricas/porcentajes
    if (typeof value === 'number' && column.key === 'progreso') {
      return <span className="metric">{value}%</span>
    }

    return value
  }

  if (data.length === 0) {
    return (
      <div className={`bg-background backdrop-blur-sm rounded-lg card-shadow overflow-hidden ${className}`}>
        {/* Header */}
        {(title || subtitle) && (
          <div className="px-10 py-8 border-b border-border-color">
            {title && (
              <h1 className="text-lg font-medium text-text-primary mb-1 tracking-tight">
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="text-xs text-text-secondary">
                {subtitle}
              </p>
            )}
          </div>
        )}

        {/* Empty State */}
        <div className="px-10 py-16 text-center">
          <div className="w-12 h-12 mx-auto mb-4 opacity-30">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="9" y1="9" x2="15" y2="9"></line>
              <line x1="9" y1="15" x2="15" y2="15"></line>
            </svg>
          </div>
          <h3 className="text-sm font-medium text-text-primary mb-2">
            No hay convocatorias todavía
          </h3>
          <p className="text-xs text-text-secondary">
            Las convocatorias aparecerán aquí cuando se agreguen
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-background backdrop-blur-sm rounded-lg card-shadow overflow-hidden ${className}`}>
      {/* Header */}
      {(title || subtitle) && (
        <div className="px-10 py-6 border-b border-border-color">
          {title && (
            <h1 className="text-lg font-medium text-text-primary mb-1 tracking-tight">
              {title}
            </h1>
          )}
          {subtitle && (
            <p className="text-xs text-text-secondary">
              {subtitle}
            </p>
          )}
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-background">
              {columns.map((column, index) => (
                <th
                  key={column.key}
                  className={`px-10 py-2.5 text-center text-xs font-semibold text-text-secondary uppercase tracking-widest border-b border-border-color ${column.className || ''}`}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody style={{ minHeight: fixedRows ? `${fixedRows * 40}px` : '300px' }}>
            {paginatedData.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="border-b border-border-color hover:bg-accent transition-colors duration-150 last:border-b-0"
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={`px-10 py-2.5 text-center text-sm text-text-primary ${column.key === 'proyecto' ? 'font-medium' : ''} ${column.className || ''}`}
                  >
                    {renderCell(row, column)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {showPagination && (
          <div className="flex items-center justify-between px-10 py-4 border-t border-border-color">
          <div className="text-sm text-text-secondary">
            {paginationInfo}
          </div>

          <div className="flex items-center gap-2">
            {totalPages > 1 ? (
              <>
                <button
                  className="data-table-pagination-btn"
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  aria-label="Página anterior"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                <div className="flex gap-1">
                  {pageNumbers.map((page, index) => (
                    <React.Fragment key={index}>
                      {page === '...' ? (
                        <span className="data-table-page-number" style={{cursor: 'default'}}>...</span>
                      ) : (
                        <button
                          className={`data-table-page-number ${page === currentPage ? 'active' : ''}`}
                          onClick={() => goToPage(page as number)}
                        >
                          {page}
                        </button>
                      )}
                    </React.Fragment>
                  ))}
                </div>

                <button
                  className="data-table-pagination-btn"
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  aria-label="Página siguiente"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>

                <div className="flex items-center gap-2 ml-4 pl-4 border-l border-border-color">
                  <label htmlFor="pageJump" className="text-sm text-text-secondary whitespace-nowrap">
                    Ir a:
                  </label>
                  <input
                    id="pageJump"
                    type="number"
                    min="1"
                    max={totalPages}
                    value={jumpToPage}
                    onChange={(e) => setJumpToPage(e.target.value)}
                    onKeyPress={handleJumpKeyPress}
                    onBlur={handleJumpToPage}
                    placeholder={currentPage.toString()}
                    className="data-table-page-jump-input"
                  />
                </div>
              </>
            ) : (
              // Espacio vacío para mantener consistencia visual cuando no hay paginación
              <div className="h-9"></div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default DataTable
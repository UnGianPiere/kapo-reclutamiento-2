'use client'

import React, { useState, useEffect, useRef } from 'react'
import { AplicacionCandidato } from '@/app/(dashboard)/kanban/lib/kanban.types'
import { Calendar, Mail, Clock, Save, Edit, FileText, X } from 'lucide-react'
import { Input, Button, Select } from '@/components/ui'
import { showSuccess, showError, TOAST_DURATIONS } from '@/lib/toast-utils'
import {
    useEntrevistaRegularPorAplicacion,
    useCrearEntrevistaRegular,
    useActualizarEntrevistaRegular
} from '@/hooks/useEntrevistasRegulares'
import { useAuth, useUsuarios, Usuario } from '@/hooks'
import { useFileUpload } from '@/hooks/useFileUpload'
import { graphqlRequest } from '@/lib/graphql-client'
import { LIST_USUARIOS_PAGINATED_QUERY } from '@/graphql/queries'
import type { ListUsuariosPaginatedResponse } from '@/hooks/useUsuarios'
import { SelectSearch } from '@/components/ui/select-search'

interface PrimeraEntrevistaTabProps {
    aplicacion: AplicacionCandidato
    usuariosOptions?: Usuario[]
    loadingUsuarios?: boolean
    loadingEntrevista?: boolean
    onValidationChange?: (isValid: boolean) => void
    viewOnly?: boolean
}

import { ModalidadEntrevista } from '@/types/entrevista-regular'

interface FormData {
    fecha: string
    hora: string
    correo: string
    entrevistadorId: string
    modalidad: ModalidadEntrevista
    archivos: File[]
    archivo_sustento: string[]
}

export function PrimeraEntrevistaTab({ aplicacion, onValidationChange, viewOnly = false }: PrimeraEntrevistaTabProps) {
    const { user } = useAuth()

    // Cargar usuarios inicialmente para el SelectSearch
    const { usuarios: usuariosOptions, loading: loadingUsuarios } = useUsuarios({ 
        pagination: { page: 1, limit: 50 }
    })

    // Hook para manejar la entrevista
    const { entrevista, loading: loadingEntrevista } = useEntrevistaRegularPorAplicacion(aplicacion.id, 'PRIMERA')
    const { crearEntrevista, loading: loadingCrear } = useCrearEntrevistaRegular()
    const { actualizarEntrevista, loading: loadingActualizar } = useActualizarEntrevistaRegular()
    const { uploadMultipleFiles, deleteFile, isUploading, error: uploadError, clearError } = useFileUpload()

    // Report validation when data is loaded
    React.useEffect(() => {
        if (!loadingEntrevista) {
            onValidationChange?.(!!entrevista)
        }
    }, [entrevista, loadingEntrevista])

    const [isEditMode, setIsEditMode] = useState(false)
    const [hasChanges, setHasChanges] = useState(false)
    const [originalData, setOriginalData] = useState<FormData | null>(null)

    const [formData, setFormData] = useState<FormData>({
        fecha: '',
        hora: '',
        correo: '',
        entrevistadorId: '',
        modalidad: 'PRESENCIAL',
        archivos: [],
        archivo_sustento: []
    })

    // Cargar datos cuando existe entrevista
    useEffect(() => {
        if (entrevista) {
            const loadedData = {
                fecha: new Date(entrevista.fecha_entrevista).toISOString().split('T')[0],
                hora: entrevista.hora_entrevista,
                correo: entrevista.correo_contacto,
                entrevistadorId: entrevista.entrevistador_nombre || '',
                modalidad: entrevista.modalidad || 'PRESENCIAL',
                archivos: [],
                archivo_sustento: entrevista.archivo_sustento || []
            }

            setFormData(loadedData)
            setOriginalData(loadedData)
            setIsEditMode(false)
            setHasChanges(false)
        }
    }, [entrevista])

    // Detectar cambios en el formulario
    useEffect(() => {
        if (originalData && isEditMode) {
            const hasAnyChanges = JSON.stringify(formData) !== JSON.stringify(originalData)
            setHasChanges(hasAnyChanges)
        } else {
            setHasChanges(false)
        }
    }, [formData, originalData, isEditMode])

    // Función para manejar cambios en inputs
    const handleInputChange = (field: keyof FormData, value: string | File[]) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    // Función para manejar cambios en archivos
    const handleFileChange = (files: File[]) => {
        setFormData(prev => ({ ...prev, archivos: files }))
    }

    // Función para manejar el modo edición
    const handleEditMode = () => {
        setIsEditMode(true)
    }

    // Función para cancelar edición
    const handleCancelEdit = () => {
        if (originalData) {
            setFormData(originalData)
        }
        setIsEditMode(false)
        setHasChanges(false)
    }

    // Función para validar formato de correo electrónico
    const isValidEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(email)
    }

    // Función para validar campos requeridos
    const validateForm = (): string[] => {
        const errors: string[] = []

        if (!formData.entrevistadorId?.trim()) {
            errors.push('Entrevistador')
        }
        if (!formData.fecha?.trim()) {
            errors.push('Fecha de Entrevista')
        }
        if (!formData.hora?.trim()) {
            errors.push('Hora de Entrevista')
        }
        if (!formData.modalidad) {
            errors.push('Modalidad de Entrevista')
        }
        if (formData.correo?.trim() && !isValidEmail(formData.correo)) {
            errors.push('Correo Electrónico (formato inválido)')
        }

        return errors
    }

    // Función para guardar/crear entrevista
    const handleSave = async () => {
        // Validar campos requeridos
        const validationErrors = validateForm()
        if (validationErrors.length > 0) {
            let missingFieldsMessage = ''
            if (validationErrors.length <= 2) {
                missingFieldsMessage = validationErrors.join(', ')
            } else {
                missingFieldsMessage = `${validationErrors.slice(0, 2).join(', ')}, etc`
            }
            showError(`Faltan completar los siguientes campos: ${missingFieldsMessage}`, { duration: TOAST_DURATIONS.LONG })
            return
        }

        // Validar límite de archivos
        const totalFiles = formData.archivo_sustento.length + formData.archivos.length
        if (totalFiles > 4) {
            showError('Máximo 4 archivos permitidos', { duration: TOAST_DURATIONS.LONG })
            return
        }

        try {
            let archivoUrls: string[] = [...formData.archivo_sustento]
            if (formData.archivos.length > 0) {
                const resultado = await uploadMultipleFiles(formData.archivos, { 
                    tipo: 'EVIDENCIAS_ENTREVISTA',
                    allowedTypes: [
                        'application/pdf', 'application/msword',
                        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                        'application/vnd.ms-excel',
                        'image/jpeg', 'image/png', 'image/jpg'
                    ]
                })
                if (resultado.successful.length > 0) {
                    archivoUrls = [...archivoUrls, ...resultado.successful.map(f => f.url)]
                }
                if (resultado.failed.length > 0) {
                    showError(`Error al subir ${resultado.failed.length} archivo(s)`, { duration: TOAST_DURATIONS.LONG })
                    return
                }
            }

            // Encontrar el usuario seleccionado por nombre
            const selectedUser = usuariosOptions.find(u => `${u.nombres} ${u.apellidos}`.trim() === formData.entrevistadorId.trim())

            const saveData = {
                aplicacionCandidatoId: aplicacion.id,
                candidatoId: aplicacion.candidatoId,
                tipo_entrevista: 'PRIMERA' as const,
                modalidad: formData.modalidad,
                fecha_entrevista: new Date(formData.fecha).toISOString(),
                hora_entrevista: formData.hora,
                correo_contacto: formData.correo,
                entrevistador_id: selectedUser?.id || user?.id || '',
                entrevistador_nombre: formData.entrevistadorId || user?.nombresA || 'Usuario no identificado',
                archivo_sustento: archivoUrls
            }

            if (entrevista) {
                // Find files to delete: those in original but not in current
                const filesToDelete = (originalData?.archivo_sustento || []).filter(url => !archivoUrls.includes(url))
                
                // Delete removed files
                if (filesToDelete.length > 0) {
                    for (const url of filesToDelete) {
                        try {
                            await deleteFile(url)
                        } catch (error) {
                            console.error('Error deleting file:', url, error)
                            // Continue with update even if delete fails
                        }
                    }
                }

                // Actualizar entrevista existente
                await actualizarEntrevista({ id: entrevista.id, input: {
                    modalidad: formData.modalidad,
                    fecha_entrevista: saveData.fecha_entrevista,
                    hora_entrevista: saveData.hora_entrevista,
                    correo_contacto: saveData.correo_contacto,
                    entrevistador_id: saveData.entrevistador_id,
                    entrevistador_nombre: saveData.entrevistador_nombre,
                    archivo_sustento: saveData.archivo_sustento
                }})
                showSuccess('Entrevista actualizada correctamente', { duration: TOAST_DURATIONS.NORMAL })
            } else {
                // Crear nueva entrevista
                await crearEntrevista(saveData)
                showSuccess('Entrevista creada correctamente', { duration: TOAST_DURATIONS.NORMAL })
            }

            setOriginalData(formData)
            setIsEditMode(false)
            setHasChanges(false)
        } catch (error) {
            console.error('Error saving interview:', error)
            showError('Error al guardar la entrevista. Inténtalo nuevamente.', { duration: TOAST_DURATIONS.LONG })
        }
    }

    const loading = loadingEntrevista || loadingCrear || loadingActualizar || isUploading

    // Helper function to extract filename from URL
    const getFileNameFromUrl = (url: string): string => {
        const parts = url.split('/')
        const fileName = parts[parts.length - 1]
        return fileName.includes('?') ? fileName.split('?')[0] : fileName
    }

    // ─── File Upload Component ───────────────────────────────────────────────
    const FileUploadComponent = ({ showUpload = true }: { showUpload?: boolean }) => {
        const [isDragOver, setIsDragOver] = useState(false)
        const fileInputRef = useRef<HTMLInputElement>(null)

        const maxFiles = 4
        const maxSize = 3 * 1024 * 1024 // 3MB
        const allowedTypes = [
            'application/pdf', 'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-excel',
            'image/jpeg', 'image/png', 'image/jpg'
        ]

        const validateFile = (file: File): string | null => {
            if (file.size > maxSize) return `El archivo "${file.name}" supera el límite de 3MB`
            if (!allowedTypes.includes(file.type)) return `Archivo no permitido: PDF, DOC, DOCX, XLS, JPG, PNG`
            return null
        }

        const processFiles = (fileList: FileList | null) => {
            if (!fileList) return
            const newFiles: File[] = []
            const errors: string[] = []
            Array.from(fileList).forEach(file => {
                if (totalUsed + newFiles.length >= maxFiles) { 
                    if (!errors.includes('Máximo 4 archivos permitidos')) errors.push('Máximo 4 archivos permitidos'); 
                    return 
                }
                const exists = [...formData.archivos, ...newFiles].some(f => f.name === file.name && f.size === file.size)
                if (exists) { errors.push(`Archivo duplicado: ${file.name}`); return }
                const validationError = validateFile(file)
                if (validationError) { errors.push(validationError); return }
                newFiles.push(file)
            })
            if (errors.length > 0) showError(errors.join('\n'), { duration: TOAST_DURATIONS.LONG })
            if (newFiles.length > 0) handleFileChange([...formData.archivos, ...newFiles])
        }

        const handleDrop = (e: React.DragEvent) => { e.preventDefault(); setIsDragOver(false); processFiles(e.dataTransfer.files) }
        const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragOver(true) }
        const handleDragLeave = (e: React.DragEvent) => { e.preventDefault(); setIsDragOver(false) }

        const removeFile = (index: number) => handleFileChange(formData.archivos.filter((_, i) => i !== index))
        const removeExistingFile = (index: number) => setFormData(prev => ({ ...prev, archivo_sustento: prev.archivo_sustento.filter((_, i) => i !== index) }))

        const totalUsed = formData.archivos.length + formData.archivo_sustento.length

        return (
            <div className="space-y-2">
                {showUpload && (
                    <>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".pdf,.doc,.docx,.xls,.jpg,.jpeg,.png"
                            multiple
                            onChange={(e) => processFiles(e.target.files)}
                            className="hidden"
                        />

                        {/* Drop zone */}
                        <div
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onClick={() => fileInputRef.current?.click()}
                            className={`
                                relative flex items-center gap-3 px-4 py-3 border-2 border-dashed rounded-lg cursor-pointer
                                transition-all duration-200
                                ${isDragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-200 hover:border-gray-400 hover:bg-gray-50'}
                                ${totalUsed >= maxFiles ? 'opacity-50 pointer-events-none' : ''}
                            `}
                        >
                            <div className={`flex-shrink-0 w-8 h-8 rounded-md flex items-center justify-center ${isDragOver ? 'bg-blue-100' : 'bg-gray-100'}`}>
                                <FileText className={`w-4 h-4 ${isDragOver ? 'text-blue-500' : 'text-gray-400'}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium text-gray-700">
                                    {totalUsed >= maxFiles ? 'Límite de archivos alcanzado' : 'Adjuntar archivos de sustento'}
                                </p>
                                <p className="text-xs text-gray-400">PDF, DOC, XLS, DOCX, JPG, PNG · máx. 3MB · {totalUsed}/{maxFiles}</p>
                            </div>
                            {totalUsed > 0 && (
                                <span className="flex-shrink-0 text-xs font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-secondary)' }}>
                                    {totalUsed} archivo{totalUsed !== 1 ? 's' : ''}
                                </span>
                            )}
                        </div>
                    </>
                )}

                {/* Archivos existentes (URLs) */}
                {formData.archivo_sustento.map((url, index) => (
                    <div key={`existing-${index}`} className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)' }}>
                        <div className="w-6 h-6 rounded flex items-center justify-center bg-green-600 flex-shrink-0">
                            <FileText className="w-3 h-3 text-white" />
                        </div>
                        <a href={url} target="_blank" rel="noopener noreferrer"
                            className="flex-1 text-xs truncate hover:text-blue-600 hover:underline" style={{ color: 'var(--text-primary)' }}>
                            {getFileNameFromUrl(url)}
                        </a>
                        <button type="button" onClick={() => removeExistingFile(index)}
                            className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                            <X className="w-3 h-3" />
                        </button>
                    </div>
                ))}

                {/* Mensaje cuando no hay archivos */}
                {formData.archivo_sustento.length === 0 && !showUpload && (
                    <p className="text-xs text-gray-400">No hay archivos de sustento</p>
                )}

                {/* Archivos nuevos (Files) */}
                {formData.archivos.map((file, index) => (
                    <div key={`new-${index}`} className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)' }}>
                        <div className="w-6 h-6 rounded flex items-center justify-center bg-blue-600 flex-shrink-0">
                            <FileText className="w-3 h-3 text-white" />
                        </div>
                        <span className="flex-1 text-xs truncate" style={{ color: 'var(--text-primary)' }}>{file.name}</span>
                        <span className="flex-shrink-0 text-xs" style={{ color: 'var(--text-secondary)' }}>
                            {(file.size / 1024 / 1024).toFixed(1)}MB
                        </span>
                        <button type="button" onClick={() => removeFile(index)}
                            className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                            <X className="w-3 h-3" />
                        </button>
                    </div>
                ))}
            </div>
        )
    }

    // Renderizar sección de entrevista
    const renderEntrevistaSection = (title: string) => (
        <section>
            <h3 className="text-xs uppercase font-medium mb-3 flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5" />
                {title}
            </h3>
            <div className="grid grid-cols-1 gap-3">
                {/* Entrevistador */}
                <div className="space-y-1">
                    <label className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                        Entrevistador
                    </label>
                    <SelectSearch
                        value={formData.entrevistadorId}
                        onChange={(value) => handleInputChange('entrevistadorId', value || '')}
                        placeholder="Seleccionar entrevistador..."
                        className="h-8 text-xs"
                        disabled={!isEditMode && !!entrevista}
                        showSearchIcon={true}
                        onSearch={async (searchTerm) => {
                            const response = await graphqlRequest<{
                                listUsuariosPaginated: ListUsuariosPaginatedResponse
                            }>(LIST_USUARIOS_PAGINATED_QUERY, {
                                pagination: { page: 1, limit: 50 },
                                filters: { nombres: searchTerm }
                            })
                            return response.listUsuariosPaginated.data.map((usuario: Usuario) => ({
                                value: `${usuario.nombres} ${usuario.apellidos}`.trim(),
                                label: `${usuario.nombres} ${usuario.apellidos}`.trim()
                            }))
                        }}
                        options={usuariosOptions.map((usuario: Usuario) => ({
                            value: `${usuario.nombres} ${usuario.apellidos}`.trim(),
                            label: `${usuario.nombres} ${usuario.apellidos}`.trim()
                        }))}
                        isLoading={loadingUsuarios}
                    />
                </div>

                {/* Modalidad */}
                <div className="space-y-1">
                    <label className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                        Modalidad
                    </label>
                    <Select
                        options={[
                            { value: 'PRESENCIAL', label: 'Presencial' },
                            { value: 'VIRTUAL', label: 'Virtual' }
                        ]}
                        value={formData.modalidad}
                        onChange={(value) => handleInputChange('modalidad', value as ModalidadEntrevista)}
                        disabled={!isEditMode && !!entrevista}
                        className="h-8 text-xs"
                        placeholder="Seleccionar modalidad..."
                    />
                </div>

                {/* Fecha */}
                <div className="space-y-1">
                    <label className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                        Fecha de Entrevista
                    </label>
                    <Input
                        type="date"
                        className="h-8 text-xs"
                        value={formData.fecha}
                        onChange={(e) => handleInputChange('fecha', e.target.value)}
                        readOnly={!isEditMode && !!entrevista}
                    />
                </div>

                {/* Hora */}
                <div className="space-y-1">
                    <label className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                        Hora de Entrevista
                    </label>
                    <Input
                        type="time"
                        className="h-8 text-xs"
                        value={formData.hora}
                        onChange={(e) => handleInputChange('hora', e.target.value)}
                        readOnly={!isEditMode && !!entrevista}
                    />
                </div>

                {/* Correo */}
                <div className="space-y-1">
                    <label className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                        Correo Electrónico
                    </label>
                    <Input
                        type="email"
                        placeholder="correo@ejemplo.com"
                        className="h-8 text-xs"
                        value={formData.correo}
                        onChange={(e) => handleInputChange('correo', e.target.value)}
                        readOnly={!isEditMode && !!entrevista}
                    />
                </div>

                {/* Archivos de sustento */}
                <div className="space-y-1.5">
                    <label className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Archivos de sustento</label>
                    <FileUploadComponent showUpload={isEditMode || !entrevista} />
                </div>
            </div>
        </section>
    )

    return (
        <div className="space-y-6">
            {/* Primera Entrevista */}
            <div className="max-w-md mx-auto">
                {renderEntrevistaSection('Primera Entrevista')}
            </div>

            {/* Botones de acción */}
            {!viewOnly && (
                <section>
                    <div className="flex items-center justify-center gap-3">
                        {isEditMode ? (
                            <>
                                <Button
                                    variant="outline"
                                    size="xs"
                                    color='green'
                                    onClick={handleCancelEdit}
                                    disabled={loading}
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    variant="custom"
                                    color="primary"
                                    size="xs"
                                    icon={<Save className="w-4 h-4" />}
                                    onClick={handleSave}
                                    disabled={loading || !hasChanges}
                                >
                                    {loading ? 'Guardando...' : 'Guardar'}
                                </Button>
                            </>
                        ) : (
                            <Button
                                variant="custom"
                                color="primary"
                                size="xs"
                                icon={entrevista ? <Edit className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                                onClick={entrevista ? handleEditMode : handleSave}
                                disabled={loading}
                            >
                                {loading ? 'Cargando...' : (entrevista ? 'Editar' : 'Guardar')}
                            </Button>
                        )}
                    </div>
                </section>
            )}
        </div>
    )
}
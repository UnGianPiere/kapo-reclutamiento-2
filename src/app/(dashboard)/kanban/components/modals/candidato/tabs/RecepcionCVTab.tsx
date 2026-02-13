'use client'

import { AplicacionCandidato } from '@/app/(dashboard)/kanban/lib/kanban.types'
import { User, Mail, Phone, MapPin, Briefcase, DollarSign, FileText, Download } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface RecepcionCVTabProps {
    aplicacion: AplicacionCandidato
}

export function RecepcionCVTab({ aplicacion }: RecepcionCVTabProps) {
    const { candidato, convocatoria, pretensionEconomica, aniosExperienciaPuesto, curriculumUrl } = aplicacion

    // Formatear pretensión económica
    const pretensionFormateada = new Intl.NumberFormat('es-PE', {
        style: 'currency',
        currency: 'PEN',
        minimumFractionDigits: 0,
    }).format(pretensionEconomica)

    // Nombre completo
    const nombreCompleto = candidato
        ? `${candidato.nombres} ${candidato.apellidoPaterno} ${candidato.apellidoMaterno}`.trim()
        : 'Sin información'

    const experienciaGeneral = aplicacion.aniosExperienciaGeneral ?? aplicacion.respuestasFormulario?.['anios_experiencia_general'] ?? aplicacion.respuestasFormulario?.['experiencia_general']

    return (
        <div className="space-y-6">
            {/* Información Personal */}
            <section>
                <h3 className="text-xs uppercase font-medium mb-3 flex items-center gap-2">     
                    <User className="w-3.5 h-3.5" />
                    Información Personal
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {/* Nombres */}
                    <div className="space-y-1">
                        <label className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                            Nombres
                        </label>
                        <Input value={candidato?.nombres || 'N/A'} readOnly className="h-8 text-xs" />
                    </div>

                    {/* Apellido Paterno */}
                    <div className="space-y-1">
                        <label className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                            Apellido Paterno
                        </label>
                        <Input value={candidato?.apellidoPaterno || 'N/A'} readOnly className="h-8 text-xs" />
                    </div>

                    {/* Apellido Materno */}
                    <div className="space-y-1">
                        <label className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                            Apellido Materno
                        </label>
                        <Input value={candidato?.apellidoMaterno || 'N/A'} readOnly className="h-8 text-xs" />
                    </div>

                    {/* DNI */}
                    <div className="space-y-1">
                        <label className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                            DNI
                        </label>
                        <Input value={candidato?.dni || 'N/A'} readOnly className="h-8 text-xs" />
                    </div>
                </div>
            </section>

            {/* Información de Contacto */}
            <section>
                <h3 className="text-xs uppercase font-medium mb-3 flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5" />
                    Contacto
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {/* Correo */}
                    <div className="space-y-1">
                        <label className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                            Correo Electrónico
                        </label>
                        <div className="relative">
                            <Input value={candidato?.correo || 'N/A'} readOnly className="h-8 text-xs" />
                        </div>
                    </div>

                    {/* Teléfono */}
                    <div className="space-y-1">
                        <label className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                            Teléfono
                        </label>
                        <div className="relative">
                            <Input value={candidato?.telefono || 'N/A'} readOnly className="h-8 text-xs" />
                        </div>
                    </div>

                    {/* Lugar de Residencia */}
                    {candidato?.lugarResidencia && (
                        <div className="space-y-1 ">
                            <label className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                                Lugar de Residencia
                            </label>
                            <div className="relative">
                                <Input value={candidato.lugarResidencia} readOnly className="h-8 text-xs" />
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* Información Laboral */}
            <section>
                <h3 className="text-xs uppercase font-medium mb-3 flex items-center gap-2">
                    <Briefcase className="w-3.5 h-3.5" />
                    Información Laboral
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {/* Cargo al que postula */}
                    <div className="space-y-1 ">
                        <label className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                            Cargo
                        </label>
                        <div className="relative">
                            
                            <Input value={convocatoria?.cargoNombre || 'N/A'} readOnly className="h-8 text-xs " />
                        </div>
                    </div>

                    {/* Años de experiencia en el puesto */}
                    <div className="space-y-1">
                        <label className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                            Experiencia en el Puesto
                        </label>
                        <div className="relative">
                            <Input value={`${aniosExperienciaPuesto} ${aniosExperienciaPuesto === 1 ? 'año' : 'años'}`} readOnly className="h-8 text-xs" />
                        </div>
                    </div>

                    {/* Años de experiencia general */}
                    {experienciaGeneral !== undefined && (
                        <div className="space-y-1">
                            <label className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                                Experiencia General
                            </label>
                            <div className="relative">
                                
                                <Input value={`${experienciaGeneral}`} readOnly className="h-8 text-xs " />
                            </div>
                        </div>
                    )}

                    {/* Pretensión Económica */}
                    <div className="space-y-1">
                        <label className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                            Pretensión Económica
                        </label>
                        <div className="relative">
                            
                            <Input value={pretensionFormateada} readOnly className="h-8 text-xs  font-semibold" />
                        </div>
                    </div>

                    {/* Medio de Convocatoria */}
                    {aplicacion.medioConvocatoria && (
                        <div className="space-y-1 md:col-span-2">
                            <label className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                                Medio de Convocatoria
                            </label>
                            <Input value={aplicacion.medioConvocatoria} readOnly className="h-8 text-xs" />
                        </div>
                    )}
                </div>
            </section>

            {/* Curriculum Vitae */}
            <section>
                <h3 className="text-xs uppercase font-medium mb-3 flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5" />
                    Curriculum Vitae
                </h3>
                <div className="p-4 rounded-lg border" style={{
                    backgroundColor: 'var(--card-bg)',
                    borderColor: 'var(--border-color)'
                }}>
                    {curriculumUrl ? (
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg" style={{ backgroundColor: 'var(--primary-color-10)' }}>
                                    <FileText className="w-5 h-5" style={{ color: 'var(--primary-color)' }} />
                                </div>
                                <div>
                                    <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                                        Curriculum Vitae
                                    </p>
                                    <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                                        Documento adjunto
                                    </p>
                                </div>
                            </div>
                            <a
                                href={curriculumUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors"
                                style={{
                                    backgroundColor: 'var(--primary-color)',
                                    color: 'white'
                                }}
                            >
                                <Download className="w-4 h-4" />
                                <span className="text-xs " style={{ color: 'var(--text-secondary)' }}  >Descargar</span>
                            </a>
                        </div>
                    ) : (
                        <div className="text-center py-4">
                            <FileText className="w-8 h-8 mx-auto mb-2" style={{ color: 'var(--text-secondary)' }} />
                            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                                No hay curriculum adjunto
                            </p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    )
}

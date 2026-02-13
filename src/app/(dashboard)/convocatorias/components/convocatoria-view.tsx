'use client';

import React from 'react';
import Modal from '@/components/ui/modal';
import {
  Calendar,
  MapPin,
  Building,
  Users,
  AlertTriangle,
  Link as LinkIcon,
  FileText,
  Briefcase,
  Clock,
  Target,
  User,
  GraduationCap,
  ListChecks,
  Plane,
  FileCheck,
  Building2
} from 'lucide-react';

interface ConvocatoriaViewProps {
  isOpen: boolean;
  onClose: () => void;
  convocatoria: any;
}

export default function ConvocatoriaView({ isOpen, onClose, convocatoria }: ConvocatoriaViewProps) {
  if (!convocatoria) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatShortDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getEstadoColor = (estado: string) => {
    const colors = {
      'ACTIVA': 'bg-green-200 text-green-400 border-green-200 dark:bg-green-100 dark:text-green-200',
      'EN_PROCESO': 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-400 dark:border-blue-900',
      'FINALIZADA': 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-900',
      'CANCELADA': 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-400 dark:border-red-900',
    };
    return colors[estado as keyof typeof colors] || 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-950 dark:text-gray-400 dark:border-gray-900';
  };

  const getPrioridadColor = (prioridad: number) => {
    if (prioridad <= 3) return 'text-destructive';
    if (prioridad <= 7) return 'text-yellow-800 dark:text-yellow-400';
    return 'text-green-600 dark:text-green-400';
  };

  const renderRequisitos = (requisitos: any) => {
    if (!requisitos) return null;

    if (typeof requisitos === 'string') {
      return <p className="text-xs text-text-secondary leading-relaxed">{requisitos}</p>;
    }

    if (Array.isArray(requisitos)) {
      return (
        <ul className="space-y-1.5">
          {requisitos.map((req, index) => (
            <li key={index} className="flex items-start gap-2 text-xs text-text-secondary">
              <span className="mt-1.5 w-1 h-1 rounded-full bg-text-secondary shrink-0" />
              {req}
            </li>
          ))}
        </ul>
      );
    }

    if (typeof requisitos === 'object') {
      return (
        <div className="space-y-1.5">
          {Object.entries(requisitos).map(([key, value]) => (
            <div key={key} className="flex items-start justify-between gap-3">
              <span className="text-xs font-medium text-text-primary">{key}:</span>
              <span className="text-xs text-text-secondary text-right">{String(value)}</span>
            </div>
          ))}
        </div>
      );
    }

    return null;
  };

  const detalle = convocatoria.detalle_staff_snapshot || {};

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <FileText className="h-5 w-5 text-text-secondary" />
              <span className="text-sm font-semibold text-text-primary">
                {convocatoria.cargo_nombre || 'Convocatoria'}
              </span>
              <span className="px-2 py-0.5 rounded text-xs font-semibold bg-green-100/20 text-green-30 dark:bg-green-750 dark:text-green-400">
                {convocatoria.estado_convocatoria?.replace('_', ' ')}
              </span>
            </div>
            <p className="text-xs text-text-secondary font-normal">
              Código: {convocatoria.codigo_convocatoria}
            </p>
          </div>
        </div>
      }
      size="md"
    >
      <div className="space-y-3">
        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-card-bg backdrop-blur-sm rounded-lg card-shadow p-4 border border-border-color">
            <div className="flex items-center gap-2 mb-1">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs font-medium text-text-secondary uppercase">Vacantes</span>
            </div>
            <p className="text-xs font-bold text-text-primary">{convocatoria.vacantes}</p>
          </div>

          <div className="bg-card-bg backdrop-blur-sm rounded-lg card-shadow p-4 border border-border-color">
            <div className="flex items-center gap-2 mb-1">
              <Target className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs font-medium text-text-secondary uppercase">Prioridad</span>
            </div>
            <p className="text-xs font-bold text-text-primary">
              Nivel {convocatoria.prioridad}
            </p>
          </div>

          <div className="bg-card-bg backdrop-blur-sm rounded-lg card-shadow p-4 border border-border-color">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs font-medium text-text-secondary uppercase">Publicado</span>
            </div>
            <p className="text-xs font-bold text-text-primary">
              {formatShortDate(convocatoria.fecha_creacion)}
            </p>
          </div>
        </div>

        {/* Información del Cargo y Ubicación */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Briefcase className="h-4 w-4 text-yellow-800" />
            
            <h3 className="text-sm font-bold text-text-primary uppercase tracking-wide">
              Información del Cargo y Ubicación
            </h3>
          </div>

          <div className="border-l-2 border-primary/20 pl-3">
            <div className="grid grid-cols-2 gap-3">
              <InfoItem icon={Briefcase} label="Cargo" value={convocatoria.cargo_nombre} />
              <InfoItem icon={ListChecks} label="Categoría" value={convocatoria.categoria_nombre} />
              <InfoItem icon={GraduationCap} label="Especialidad" value={convocatoria.especialidad_nombre} />
              <InfoItem icon={FileText} label="Tipo" value={convocatoria.tipo_requerimiento} capitalize />
              {convocatoria.empresa_nombre && (
                <div className="flex items-start gap-2">
                  <div className="mt-0.5 p-2 bg-muted rounded-lg">
                    <Building className="h-4 w-4 text-text-secondary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <label className="block text-xs font-semibold text-text-secondary uppercase mb-0.5">
                      Empresa
                    </label>
                    <p className="text-xs text-text-primary font-medium">
                      {convocatoria.empresa_nombre}
                    </p>
                  </div>
                </div>
              )}
              {convocatoria.obra_nombre && (
                <div className="flex items-start gap-2">
                  <div className="mt-0.5 p-2 bg-muted rounded-lg">
                    <MapPin className="h-4 w-4 text-text-secondary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <label className="block text-xs font-semibold text-text-secondary uppercase mb-0.5">
                      Obra/Proyecto
                    </label>
                    <p className="text-xs text-text-primary font-medium">
                      {convocatoria.obra_nombre}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Detalles de la Solicitud */}
        {detalle && Object.keys(detalle).length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-3">
              <FileCheck className="h-4 w-4 text-yellow-800" />
              <h3 className="text-[13px] font-bold text-text-primary uppercase tracking-wide">
                Detalles de la Solicitud
              </h3>
            </div>

            <div className="border-l-2 border-primary/20 pl-3 space-y-3">
              {/* Grid de información básica */}
              <div className="grid grid-cols-2 gap-3">
                {detalle.fecha_contratacion_deseada && (
                  <div className="flex items-start gap-2">
                    <div className="flex-1 min-w-0">
                      <label className="block text-xs font-semibold text-text-secondary uppercase mb-0.5">
                        Fecha deseada
                      </label>
                      <p className="text-xs text-text-primary font-medium">
                        {formatShortDate(detalle.fecha_contratacion_deseada)}
                      </p>
                    </div>
                  </div>
                )}
                {detalle.area_solicitante_nombre && (
                  <div className="flex items-start gap-2">
                    <div className="flex-1 min-w-0">
                      <label className="block text-xs font-semibold text-text-secondary uppercase mb-0.5">
                        Área solicitante
                      </label>
                      <p className="text-xs text-text-primary font-medium">
                        {detalle.area_solicitante_nombre}
                      </p>
                    </div>
                  </div>
                )}
                {detalle.jefe_inmediato_nombre && (
                  <div className="flex items-start gap-2">
                    <div className="flex-1 min-w-0">
                      <label className="block text-xs font-semibold text-text-secondary uppercase mb-0.5">
                        Jefe inmediato
                      </label>
                      <p className="text-xs text-text-primary font-medium">
                        {detalle.jefe_inmediato_nombre}
                      </p>
                    </div>
                  </div>
                )}
                {detalle.encargado_induccion_nombre && (
                  <div className="flex items-start gap-2">
                    <div className="flex-1 min-w-0">
                      <label className="block text-xs font-semibold text-text-secondary uppercase mb-0.5">
                        Encargado inducción
                      </label>
                      <p className="text-xs text-text-primary font-medium">
                        {detalle.encargado_induccion_nombre}
                      </p>
                    </div>
                  </div>
                )}
                {detalle.tipo_para_cubrir && (
                  <div className="flex items-start gap-2">
                    <div className="flex-1 min-w-0">
                      <label className="block text-xs font-semibold text-text-secondary uppercase mb-0.5">
                        Tipo
                      </label>
                      <p className="text-xs text-text-primary font-medium capitalize">
                        {detalle.tipo_para_cubrir.replace('_', ' ')}
                      </p>
                    </div>
                  </div>
                )}
                {detalle.horario_tiempo && (
                  <div className="flex items-start gap-2">
                    <div className="flex-1 min-w-0">
                      <label className="block text-xs font-semibold text-text-secondary uppercase mb-0.5">
                        Horario
                      </label>
                      <p className="text-xs text-text-primary font-medium capitalize">
                        {detalle.horario_tiempo}
                      </p>
                    </div>
                  </div>
                )}
                {detalle.equipo_asignado && (
                  <div className="flex items-start gap-2">
                    <div className="flex-1 min-w-0">
                      <label className="block text-xs font-semibold text-text-secondary uppercase mb-0.5">
                        Equipo
                      </label>
                      <p className="text-xs text-text-primary font-medium capitalize">
                        {detalle.equipo_asignado}
                      </p>
                    </div>
                  </div>
                )}
                {detalle.lugar_trabajo && (
                  <div className="flex items-start gap-2">
                    <div className="flex-1 min-w-0">
                      <label className="block text-xs font-semibold text-text-secondary uppercase mb-0.5">
                        Lugar trabajo
                      </label>
                      <p className="text-xs text-text-primary font-medium capitalize">
                        {detalle.lugar_trabajo}
                      </p>
                    </div>
                  </div>
                )}
                {typeof detalle.disponibilidad_viajar === 'boolean' && (
                  <div className="flex items-start gap-2">
                    <div className="flex-1 min-w-0">
                      <label className="block text-xs font-semibold text-text-secondary uppercase mb-0.5">
                        Disponibilidad viajes
                      </label>
                      <p className="text-xs text-text-primary font-medium">
                        {detalle.disponibilidad_viajar ? 'Sí' : 'No'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
              {/* Formación Académica */}
              {detalle.formacion_academica && (
                <div className="mt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <GraduationCap className="h-4 w-4 text-yellow-800" />
                    <label className="text-xs font-semibold text-text-primary uppercase">
                      Formación Requerida
                    </label>
                  </div>
                  <div className="space-y-1.5 text-xs text-text-secondary ml-6">
                    {detalle.formacion_academica.universitario?.length > 0 && (
                      <p>• <span className="font-medium">Universitario:</span> {detalle.formacion_academica.universitario.join(', ')}</p>
                    )}
                    {detalle.formacion_academica.tecnico?.length > 0 && (
                      <p>• <span className="font-medium">Técnico:</span> {detalle.formacion_academica.tecnico.join(', ')}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Experiencia */}
              {detalle.experiencia_laboral_requerida && (
                <TextBlock
                  icon={Briefcase}
                  label="Experiencia Requerida"
                  value={detalle.experiencia_laboral_requerida}
                />
              )}

              {/* Motivo */}
              {detalle.motivo_solicitud && (
                <TextBlock
                  icon={FileText}
                  label="Motivo de la Solicitud"
                  value={detalle.motivo_solicitud}
                />
              )}

              {/* Requisitos Mínimos */}
              {detalle.requisitos_minimos && (
                <TextBlock
                  icon={ListChecks}
                  label="Requisitos Mínimos"
                  value={detalle.requisitos_minimos}
                />
              )}

              {/* Funciones Principales */}
              {detalle.funciones_principales && (
                <TextBlock
                  icon={Target}
                  label="Funciones Principales"
                  value={detalle.funciones_principales}
                />
              )}
            </div>
          </section>
        )}

        {/* Formulario de Postulación */}
        {convocatoria.link_formulario && (
          <section>
            <div className="flex items-center gap-2 mb-3">
              <div className="h-8 w-1 bg-primary rounded-full" />
              <h3 className="text-sm font-bold text-text-primary uppercase tracking-wide">
                Postulación
              </h3>
            </div>

            <div className="bg-card-bg backdrop-blur-sm rounded-lg card-shadow p-5 border border-border-color">
              <p className="text-xs text-text-primary mb-3">
                Para postularte a esta convocatoria, completa el formulario en el siguiente enlace:
              </p>
              <a
                href={convocatoria.link_formulario}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded transition-colors text-xs font-semibold shadow-sm"
              >
                <LinkIcon className="h-4 w-4" />
                Ir al Formulario de Postulación
              </a>
            </div>
          </section>
        )}
      </div>
    </Modal>
  );
}

// Componente auxiliar para items de información
function InfoItem({
  icon: Icon,
  label,
  value,
  capitalize = false
}: {
  icon: any;
  label: string;
  value: string;
  capitalize?: boolean;
}) {
  if (!value || value === 'No especificado') return null;

  return (
    <div className="flex items-start gap-2">
      <div className="mt-0.5 p-2 bg-muted rounded-lg">
        <Icon className="h-4 w-4 text-text-secondary" />
      </div>
      <div className="flex-1 min-w-0">
        <label className="block text-xs font-semibold text-text-secondary uppercase mb-0.5">
          {label}
        </label>
        <p className={`text-xs text-text-primary font-medium ${capitalize ? 'capitalize' : ''}`}>
          {value}
        </p>
      </div>
    </div>
  );
}

// Componente auxiliar para bloques de texto largo
function TextBlock({
  icon: Icon,
  label,
  value
}: {
  icon: any;
  label: string;
  value: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <Icon className="h-4 w-4 text-yellow-800" />
        <label className="text-xs font-semibold text-text-primary uppercase">
          {label}
        </label>
      </div>
      <p className="text-xs text-text-secondary leading-relaxed whitespace-pre-line ml-6">
        {value}
      </p>
    </div>
  );
}
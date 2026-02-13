// Estados del Kanban según el plan de implementación
export const KANBAN_ESTADOS = {
  CVS_RECIBIDOS: 'CVS_RECIBIDOS',
  POR_LLAMAR: 'POR_LLAMAR',
  ENTREVISTA_PREVIA: 'ENTREVISTA_PREVIA',
  PROGRAMAR_1RA_ENTREVISTA: 'PROGRAMAR_1RA_ENTREVISTA',
  PROGRAMAR_2DA_ENTREVISTA: 'PROGRAMAR_2DA_ENTREVISTA',
  REFERENCIAS: 'REFERENCIAS',
  EVALUACION_ANTISOBORNO: 'EVALUACION_ANTISOBORNO',
  APROBACION_GERENCIA: 'APROBACION_GERENCIA',
  LLAMAR_COMUNICAR_ENTRADA: 'LLAMAR_COMUNICAR_ENTRADA',
  FINALIZADA: 'FINALIZADA',
  RECHAZADO_POR_CANDIDATO: 'RECHAZADO_POR_CANDIDATO',
  DESCARTADO: 'DESCARTADO',
  POSIBLES_CANDIDATOS: 'POSIBLES_CANDIDATOS',
} as const

export type EstadoKanban = typeof KANBAN_ESTADOS[keyof typeof KANBAN_ESTADOS]

// Colores por estado para el UI (consistentes con el sistema de botones)
export const ESTADO_COLORES = {
  [KANBAN_ESTADOS.CVS_RECIBIDOS]: 'bg-blue-500/10 border-blue-200 text-blue-600 dark:text-blue-400',
  [KANBAN_ESTADOS.POR_LLAMAR]: 'bg-yellow-500/10 border-yellow-200 text-yellow-600 dark:text-yellow-400',
  [KANBAN_ESTADOS.ENTREVISTA_PREVIA]: 'bg-orange-500/10 border-orange-200 text-orange-600 dark:text-orange-400',
  [KANBAN_ESTADOS.PROGRAMAR_1RA_ENTREVISTA]: 'bg-purple-500/10 border-purple-200 text-purple-600 dark:text-purple-400',
  [KANBAN_ESTADOS.PROGRAMAR_2DA_ENTREVISTA]: 'bg-indigo-500/10 border-indigo-200 text-indigo-600 dark:text-indigo-400',
  [KANBAN_ESTADOS.REFERENCIAS]: 'bg-pink-500/10 border-pink-200 text-pink-600 dark:text-pink-400',
  [KANBAN_ESTADOS.EVALUACION_ANTISOBORNO]: 'bg-red-500/10 border-red-200 text-red-600 dark:text-red-400',
  [KANBAN_ESTADOS.APROBACION_GERENCIA]: 'bg-emerald-500/10 border-emerald-200 text-emerald-600 dark:text-emerald-400',
  [KANBAN_ESTADOS.LLAMAR_COMUNICAR_ENTRADA]: 'bg-teal-500/10 border-teal-200 text-teal-600 dark:text-teal-400',
  [KANBAN_ESTADOS.FINALIZADA]: 'bg-green-500/10 border-green-200 text-green-600 dark:text-green-400',
  [KANBAN_ESTADOS.RECHAZADO_POR_CANDIDATO]: 'bg-gray-500/10 border-gray-200 text-gray-600 dark:text-gray-400',
  [KANBAN_ESTADOS.DESCARTADO]: 'bg-red-500/10 border-red-200 text-red-600 dark:text-red-400',
  [KANBAN_ESTADOS.POSIBLES_CANDIDATOS]: 'bg-amber-500/10 border-amber-200 text-amber-600 dark:text-amber-400',
} as const

// Etiquetas legibles para los estados
export const ESTADO_LABELS = {
  [KANBAN_ESTADOS.CVS_RECIBIDOS]: 'CVs Recibidos',
  [KANBAN_ESTADOS.POR_LLAMAR]: 'Por Llamar',
  [KANBAN_ESTADOS.ENTREVISTA_PREVIA]: 'Entrevista Previa',
  [KANBAN_ESTADOS.PROGRAMAR_1RA_ENTREVISTA]: 'Programar 1ra Entrevista',
  [KANBAN_ESTADOS.PROGRAMAR_2DA_ENTREVISTA]: 'Programar 2da Entrevista',
  [KANBAN_ESTADOS.REFERENCIAS]: 'Referencias',
  [KANBAN_ESTADOS.EVALUACION_ANTISOBORNO]: 'Evaluación Antisoborno',
  [KANBAN_ESTADOS.APROBACION_GERENCIA]: 'Aprobación Gerencia',
  [KANBAN_ESTADOS.LLAMAR_COMUNICAR_ENTRADA]: 'Llamar - Comunicar Entrada',
  [KANBAN_ESTADOS.FINALIZADA]: 'Finalizada',
  [KANBAN_ESTADOS.RECHAZADO_POR_CANDIDATO]: 'Rechazado por Candidato',
  [KANBAN_ESTADOS.DESCARTADO]: 'Descartado',
  [KANBAN_ESTADOS.POSIBLES_CANDIDATOS]: 'Posibles Candidatos',
} as const

// Prioridades de convocatoria
export const PRIORIDADES = {
  BAJA: 'BAJA',
  MEDIA: 'MEDIA',
  ALTA: 'ALTA',
  CRITICA: 'CRÍTICA',
} as const

export type PrioridadConvocatoria = typeof PRIORIDADES[keyof typeof PRIORIDADES]

// Colores por prioridad (consistentes con el sistema de botones)
export const PRIORIDAD_COLORES = {
  [PRIORIDADES.BAJA]: 'bg-gray-500/10 text-gray-600 dark:text-gray-400',
  [PRIORIDADES.MEDIA]: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  [PRIORIDADES.ALTA]: 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
  [PRIORIDADES.CRITICA]: 'bg-red-500/10 text-red-600 dark:text-red-400',
} as const

// Colores de componentes (consistentes con el sistema)
export const COMPONENTE_COLORES = {
  // Avatar por defecto
  AVATAR: 'rgba(59, 130, 246, 0.1)',

  // Badge de posibles candidatos
  POSIBLES_CANDIDATOS: {
    background: 'rgba(245, 158, 11, 0.1)',
    text: '#92400e',
    border: '#f59e0b',
  },

  // Alerta de duplicado
  DUPLICADO: {
    background: 'rgba(245, 158, 11, 0.1)',
    text: '#92400e',
    border: '#f59e0b',
  },

  // Badge de repostulación
  REPOSTULACION: {
    background: 'rgba(59, 130, 246, 0.1)',
    text: '#1d4ed8',
  },

  // Badge de candidato activado
  ACTIVADO: {
    background: 'rgba(34, 197, 94, 0.1)',
    text: '#166534',
  },
} as const
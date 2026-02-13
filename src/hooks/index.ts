

// Hooks de autenticación (viene del context)
export { useAuth } from '@/context/auth-context';

// Hooks de conectividad
export {
  useOnline,
  useIsOnline,
  useRequireOnline,
} from './use-online';

// Hooks de convocatorias
export {
  useConvocatorias,
  useConvocatoria,
  useConvocatoriaPorRequerimiento,
  type Convocatoria,
} from './useConvocatorias';

// Hooks de entrevistas de llamada
export {
  useExisteEntrevistaLlamada,
  useEntrevistaLlamadaPorAplicacion,
  useEntrevistaLlamada,
  useCrearEntrevistaLlamada,
  useActualizarEntrevistaLlamada,
  useEliminarEntrevistaLlamada,
  type EntrevistaLlamada,
  type CrearEntrevistaLlamadaInput,
  type ActualizarEntrevistaLlamadaInput,
} from './useEntrevistasLlamada';

// Hooks de aplicaciones
export {
  useCambiarEstadoKanban,
  type AplicacionBasica,
} from './useAplicaciones';

// Hooks de historial de candidato
export {
  useHistorialAplicacion,
  useHistorialCandidato,
  useListarHistorial,
  useUltimoCambioEstado,
  useEstadisticasConversion,
  useRegistrarCambioHistorial,
  useLimpiarHistorico,
  type HistorialCandidato,
  type CrearHistorialInput,
  type HistorialListado,
  type EstadisticasConversion,
  type TipoCambioHistorial,
} from './useHistorialCandidato';

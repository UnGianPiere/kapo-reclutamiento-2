// ============================================================================
// MUTATIONS GRAPHQL - HISTORIAL CANDIDATO
// ============================================================================

// ============================================================================
// FRAGMENTS
// ============================================================================

export const HISTORIAL_CANDIDATO_FIELDS = `
  fragment HistorialCandidatoFields on HistorialCandidato {
    id
    candidatoId
    aplicacionId
    estadoAnterior
    estadoNuevo
    tipoCambio
    realizadoPor
    realizadoPorNombre
    fechaCambio
    motivo
    comentarios
    tiempoEnEstadoAnterior
    etapaProceso
    created_at
  }
`;

// ============================================================================
// MUTATIONS
// ============================================================================

export const REGISTRAR_CAMBIO_HISTORIAL_MUTATION = `
  mutation RegistrarCambioHistorial($input: CrearHistorialInput!) {
    registrarCambioHistorial(input: $input) {
      ...HistorialCandidatoFields
    }
  }
  ${HISTORIAL_CANDIDATO_FIELDS}
`;

export const LIMPIAR_HISTORICO_MUTATION = `
  mutation LimpiarHistorico($fechaLimite: DateTime!) {
    limpiarHistorico(fechaLimite: $fechaLimite)
  }
`;

// ============================================================================
// MUTATION TYPES (para uso interno en hooks)
// ============================================================================

export type RegistrarCambioHistorialMutationVariables = {
  input: {
    candidatoId: string;
    aplicacionId: string;
    estadoAnterior: string;
    estadoNuevo: string;
    tipoCambio: string;
    realizadoPor: string;
    realizadoPorNombre: string;
    fechaCambio?: string;
    motivo?: string;
    comentarios?: string;
    tiempoEnEstadoAnterior?: number;
    etapaProceso?: string;
  };
};

export type LimpiarHistoricoMutationVariables = {
  fechaLimite: string;
};
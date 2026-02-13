export const CREAR_APLICACION_MUTATION = `
  mutation CrearAplicacion($input: CrearAplicacionCompletaInput!) {
    crearAplicacion(input: $input) {
      id
      candidatoId
      convocatoriaId
      aniosExperienciaPuesto
      pretensionEconomica
      curriculumUrl
      respuestasFormulario
      estadoKanban
      fechaAplicacion
      aplicadoPor
      posibleDuplicado
      duplicadoRevisado
      esRepostulacion
      esPosibleCandidatoActivado
    }
  }
`

export const CAMBIAR_ESTADO_KANBAN_MUTATION = `
  mutation CambiarEstadoKanban($id: ID!, $estadoKanban: EstadoKanban!) {
    cambiarEstadoKanban(id: $id, estadoKanban: $estadoKanban) {
      id
      estadoKanban
    }
  }
`
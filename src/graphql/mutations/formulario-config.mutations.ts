export const CREAR_FORMULARIO_CONFIG_MUTATION = `
  mutation CrearFormularioConfig($input: CrearFormularioConfigInput!) {
    crearFormularioConfig(input: $input) {
      id
      convocatoriaId
      titulo
      descripcion
      campos {
        id
        nombre
        etiqueta
        tipo
        requerido
        habilitado
        orden
        opciones
        placeholder
        validaciones {
          min
          max
          patron
        }
      }
      estado
      urlPublico
      tokenJwt
      fechaPublicacion
      fechaExpiracion
      creadoPor
      fechaCreacion
      fechaModificacion
      version
    }
  }
`;

export const ACTUALIZAR_FORMULARIO_CONFIG_MUTATION = `
  mutation ActualizarFormularioConfig($id: ID!, $input: ActualizarFormularioConfigInput!) {
    actualizarFormularioConfig(id: $id, input: $input) {
      id
      convocatoriaId
      titulo
      descripcion
      campos {
        id
        nombre
        etiqueta
        tipo
        requerido
        habilitado
        orden
        opciones
        placeholder
        validaciones {
          min
          max
          patron
        }
      }
      estado
      urlPublico
      tokenJwt
      fechaPublicacion
      fechaExpiracion
      creadoPor
      fechaCreacion
      fechaModificacion
      version
    }
  }
`;
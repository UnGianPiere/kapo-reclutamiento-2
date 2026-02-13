/**
 * 🔗 GRAPHQL CLIENT - Cliente GraphQL para comunicación con backend
 *
 * Responsabilidad: Configurar cliente GraphQL para hacer requests
 * Flujo: Importado por hooks → Cliente HTTP para GraphQL
 */

import { GraphQLClient } from 'graphql-request'

// URL del backend GraphQL (ajustar según configuración)
const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:4000/graphql'

// Crear cliente GraphQL
export const graphqlClient = new GraphQLClient(GRAPHQL_ENDPOINT, {
  headers: {
    'Content-Type': 'application/json',
    // Aquí se pueden agregar headers de autenticación si es necesario
    // 'Authorization': `Bearer ${token}`,
  },
})

// Función helper para hacer requests con manejo de errores
export async function graphqlRequest<T = any>(
  query: string,
  variables?: Record<string, any>
): Promise<T> {
  try {
    return await graphqlClient.request<T>(query, variables)
  } catch (error) {
    console.error('GraphQL Request Error:', error)
    throw error
  }
}
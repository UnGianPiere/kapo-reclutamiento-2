/**
 * Combinar clases CSS de manera eficiente
 */
export function cn(...inputs: (string | undefined | null | boolean)[]): string {
  return inputs
    .filter(Boolean)
    .filter((input): input is string => typeof input === 'string')
    .join(' ')
    .trim()
}

/**
 * Construir URL completa para formulario público
 */
export function getPublicFormUrl(formularioId: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_FRONTEND_URL ||
                  (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');
  return `${baseUrl}/postular/${formularioId}`;
}
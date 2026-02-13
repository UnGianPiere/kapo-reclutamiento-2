import toast from 'react-hot-toast'

/**
 * 🎯 UTILIDADES PARA TOASTS - Sistema de notificaciones con duraciones configurables
 *
 * Permite especificar duración opcional por toast individual
 * Si no se especifica duración, usa los valores por defecto del provider
 */

export interface ToastOptions {
  duration?: number
}

/**
 * Toast de éxito con duración configurable
 * @param message - Mensaje a mostrar
 * @param options - Opciones (opcional: duration en ms)
 */
export function showSuccess(message: string, options?: ToastOptions) {
  return toast.success(message, options)
}

/**
 * Toast de error con duración configurable
 * @param message - Mensaje a mostrar
 * @param options - Opciones (opcional: duration en ms)
 */
export function showError(message: string, options?: ToastOptions) {
  return toast.error(message, options)
}

/**
 * Toast de información con duración configurable
 * @param message - Mensaje a mostrar
 * @param options - Opciones (opcional: duration en ms)
 */
export function showInfo(message: string, options?: ToastOptions) {
  return toast(message, {
    ...options,
    icon: 'ℹ️',
  })
}

/**
 * Toast de advertencia con duración configurable
 * @param message - Mensaje a mostrar
 * @param options - Opciones (opcional: duration en ms)
 */
export function showWarning(message: string, options?: ToastOptions) {
  return toast(message, {
    ...options,
    icon: '⚠️',
  })
}

/**
 * Toast de carga (loading) con duración configurable
 * @param message - Mensaje a mostrar
 * @param options - Opciones (opcional: duration en ms)
 */
export function showLoading(message: string, options?: ToastOptions) {
  return toast.loading(message, options)
}

/**
 * Actualizar toast existente
 * @param toastId - ID del toast a actualizar
 * @param message - Nuevo mensaje
 * @param options - Nuevas opciones
 */
export function updateToast(toastId: string, message: string, options?: ToastOptions) {
  return toast.success(message, {
    ...options,
    id: toastId,
  })
}

/**
 * Dismiss toast específico
 * @param toastId - ID del toast a cerrar
 */
export function dismissToast(toastId: string) {
  toast.dismiss(toastId)
}

/**
 * Dismiss todos los toasts
 */
export function dismissAllToasts() {
  toast.dismiss()
}

// Duraciones predefinidas para consistencia
export const TOAST_DURATIONS = {
  QUICK: 2000,    // Para confirmaciones rápidas
  NORMAL: 3000,   // Para operaciones normales
  LONG: 4000,     // Para errores o información importante
  EXTRA_LONG: 5000, // Para casos especiales
} as const

// Exportar toast original por si se necesita acceso directo
export { toast }
const BASE = (import.meta.env.VITE_CHAT_API_URL || 'https://raven-glamour-turbofan.ngrok-free.dev').replace(/\/$/, '')
export const PHONE_NUMBER = import.meta.env.VITE_CHAT_PHONE_NUMBER || '50255551234'

export async function enviarMensaje(telefono: string, mensaje: string, signal: AbortSignal): Promise<string> {
  const r = await fetch(`${BASE}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone_number: telefono, message: mensaje }),
    signal,
  })
  if (r.status === 403) throw new Error('El servidor rechazó la solicitud (403). Revisa la configuración del backend.')
  if (!r.ok) throw new Error(`Error del servidor (${r.status}). Intenta de nuevo más tarde.`)
  const data: unknown = await r.json()
  if (!data || typeof data !== 'object' || !('response' in data) || typeof data.response !== 'string' || !data.response.trim()) throw new Error('El servidor no devolvió una respuesta válida.')
  return data.response
}

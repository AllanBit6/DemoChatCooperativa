import { useEffect, useRef, useState } from 'react'
import { enviarMensaje, PHONE_NUMBER } from './chat'
import './App.css'

type Message = { id: number; text: string; own: boolean; time: string; status?: 'pending' | 'sent' | 'failed' }
const timeNow = () => new Date().toLocaleTimeString('es-GT', { hour: '2-digit', minute: '2-digit', hour12: false })
function MessageText({ text }: { text: string }) {
  // React escapes server text. No server-provided HTML is inserted into the page.
  const inline = (line: string) => line.split(/(\*[^*\n]+\*|_[^_\n]+_)/g).map((part, i) => /^\*[^*\n]+\*$/.test(part) ? <strong key={i}>{part.slice(1, -1)}</strong> : /^_[^_\n]+_$/.test(part) ? <em key={i}>{part.slice(1, -1)}</em> : part)
  return <div className="message-text">{text.split('\n').map((line, i) => line.startsWith('- ') ? <div className="list-line" key={i}><span aria-hidden="true">•</span><span>{inline(line.slice(2))}</span></div> : <div key={i}>{line ? inline(line) : <br />}</div>)}</div>
}

function App() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: '¡Hola! 👋 Bienvenido a nuestra cooperativa. ¿En qué podemos ayudarte?', own: false, time: '10:30' },
    { id: 2, text: 'Hola, me gustaría conocer las opciones de ahorro.', own: true, time: '10:31', status: 'sent' },
  ])
  const [draft, setDraft] = useState('')
  const [typing, setTyping] = useState(false)
  const [error, setError] = useState('')
  const pending = useRef<AbortController | null>(null)
  const bottom = useRef<HTMLDivElement>(null)
  useEffect(() => { bottom.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, typing, error])
  useEffect(() => () => pending.current?.abort(), [])

  async function send() {
    const text = draft.trim()
    if (!text || pending.current) return
    const controller = new AbortController()
    pending.current = controller
    const id = Date.now()
    setMessages(current => [...current, { id, text, own: true, time: timeNow(), status: 'pending' }])
    setDraft('')
    setError('')
    setTyping(true)
    const timeout = setTimeout(() => controller.abort(), 60000)
    try {
      const response = await enviarMensaje(PHONE_NUMBER, text, controller.signal)
      setMessages(current => [...current.map(m => m.id === id ? { ...m, status: 'sent' as const } : m), { id: id + 1, text: response, own: false, time: timeNow() }])
    } catch (err) {
      setMessages(current => current.map(m => m.id === id ? { ...m, status: 'failed' as const } : m))
      setError(controller.signal.aborted ? 'La respuesta tardó más de 60 segundos. Puedes intentar de nuevo.' : err instanceof TypeError ? 'No se pudo conectar con el servidor. Revisa la conexión y la configuración CORS del backend.' : err instanceof Error ? err.message : 'No se pudo enviar el mensaje.')
      setDraft(current => current || text)
    } finally {
      clearTimeout(timeout)
      pending.current = null
      setTyping(false)
    }
  }

  return (
    <main className="whatsapp">
      <header className="chat-header">
        <span className="back-arrow" aria-hidden="true">‹</span>
        <div className="avatar" aria-hidden="true"><svg viewBox="0 0 48 48"><circle cx="24" cy="18" r="9" /><path d="M7 45v-5a17 17 0 0 1 34 0v5" /></svg></div>
        <div className="contact"><h1>Cooperativa</h1><p role="status">{typing ? 'escribiendo…' : 'en línea'}</p></div>
        <div className="header-icons" aria-hidden="true">
          <svg viewBox="0 0 24 24"><path d="M15 8l6-4v16l-6-4M3 6h12v12H3z" /></svg>
          <svg viewBox="0 0 24 24"><path d="m7 3 3 5-3 3a16 16 0 0 0 6 6l3-3 5 3v3c-9 4-22-9-18-17z" /></svg>
          <svg viewBox="0 0 24 24" className="dots"><circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/></svg>
        </div>
      </header>
      <section className="chat-body" aria-label="Conversación">
        <div className="date">HOY</div>
        <div className="messages" role="log" aria-live="polite">
          {messages.map(message => <div key={message.id} className={`message ${message.own ? 'sent' : 'received'}`}><MessageText text={message.text} /><span className="time">{message.time}{message.own && (message.status === 'pending' ? <span aria-label="Enviando">◷</span> : message.status === 'failed' ? <span className="failed" aria-label="Error de envío">!</span> : <svg viewBox="0 0 24 16" aria-label="Respondido"><path d="m1 8 4 4L15 2M10 10l3 3L23 3" /></svg>)}</span></div>)}
          {typing && <div className="message received typing"><span /><span /><span /><small>escribiendo…</small></div>}
          {error && <div className="chat-error" role="alert">{error}</div>}
          <div ref={bottom} />
        </div>
      </section>
      <form className="composer" aria-label="Enviar mensaje" onSubmit={e => { e.preventDefault(); void send() }}>
        <svg className="smile" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M7.5 14.5s1.5 3 4.5 3 4.5-3 4.5-3"/><path d="M8 8.5h.01M16 8.5h.01" strokeWidth="3"/></svg>
        <input className="placeholder" aria-label="Escribe un mensaje" placeholder="Escribe un mensaje" value={draft} onChange={e => setDraft(e.target.value)} autoComplete="off" />
        <svg className="attachment" viewBox="0 0 24 24" aria-hidden="true"><path d="m8 13 7-7a3 3 0 0 1 4 4L9 20a5 5 0 0 1-7-7L13 2a3 3 0 0 1 5 4L7 17a1.5 1.5 0 0 1-2-2l9-9"/></svg>
        <svg className="camera" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h5l2-3h4l2 3h5v15H3z"/><circle cx="12" cy="13" r="4"/></svg>
        <button className="mic send" type="submit" aria-label="Enviar mensaje" disabled={typing || !draft.trim()}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3 3 19 9-19 9 4-9-4-9ZM7 12h15" /></svg></button>
      </form>
    </main>
  )
}

export default App

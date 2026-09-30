import './App.css'

function App() {
  return (
    <main className="whatsapp">
      <header className="chat-header">
        <span className="back-arrow" aria-hidden="true">‹</span>
        <div className="avatar" aria-hidden="true">
          <svg viewBox="0 0 48 48"><circle cx="24" cy="18" r="9" /><path d="M7 45v-5a17 17 0 0 1 34 0v5" /></svg>
        </div>
        <div className="contact"><h1>Cooperativa</h1><p>en línea</p></div>
        <div className="header-icons" aria-hidden="true">
          <svg viewBox="0 0 24 24"><path d="M15 8l6-4v16l-6-4M3 6h12v12H3z" /></svg>
          <svg viewBox="0 0 24 24"><path d="m7 3 3 5-3 3a16 16 0 0 0 6 6l3-3 5 3v3c-9 4-22-9-18-17z" /></svg>
          <svg viewBox="0 0 24 24" className="dots"><circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/></svg>
        </div>
      </header>
      <section className="chat-body" aria-label="Conversación de muestra">
        <div className="date">HOY</div>
        <div className="messages">
          <div className="message received"><p>¡Hola! 👋 Bienvenido a nuestra cooperativa. ¿En qué podemos ayudarte?</p><span className="time">10:30</span></div>
          <div className="message sent"><p>Hola, me gustaría conocer las opciones de ahorro.</p><span className="time">10:31 <svg viewBox="0 0 24 16" aria-label="Leído"><path d="m1 8 4 4L15 2M10 10l3 3L23 3" /></svg></span></div>
        </div>
      </section>
      <footer className="composer" aria-label="Barra de mensaje de muestra">
        <svg className="smile" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M7.5 14.5s1.5 3 4.5 3 4.5-3 4.5-3"/><path d="M8 8.5h.01M16 8.5h.01" strokeWidth="3"/></svg>
        <span className="placeholder">Escribe un mensaje</span>
        <svg className="attachment" viewBox="0 0 24 24" aria-hidden="true"><path d="m8 13 7-7a3 3 0 0 1 4 4L9 20a5 5 0 0 1-7-7L13 2a3 3 0 0 1 5 4L7 17a1.5 1.5 0 0 1-2-2l9-9"/></svg>
        <svg className="camera" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h5l2-3h4l2 3h5v15H3z"/><circle cx="12" cy="13" r="4"/></svg>
        <span className="mic"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="2" width="6" height="13" rx="3"/><path d="M5 10v2a7 7 0 0 0 14 0v-2M12 19v3"/></svg></span>
      </footer>
    </main>
  )
}

export default App

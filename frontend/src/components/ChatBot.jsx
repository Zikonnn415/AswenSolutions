import { useState, useRef, useEffect } from 'react'
import { MessageSquare, X, Send, Bot, User, Minimize2, Maximize2, Sparkles } from 'lucide-react'

const API = 'http://127.0.0.1:8000/api'

const SUGGESTIONS = [
  'What services do you offer?',
  'How do I get started?',
  'What industries do you serve?',
  'How long does a project take?',
]

function TypingDots() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '0.65rem 0.75rem' }}>
      {[0,1,2].map(i => (
        <div key={i} style={{
          width: '0.45rem', height: '0.45rem', borderRadius: '50%',
          background: '#10b981',
          animation: 'typingBounce 1.2s ease-in-out infinite',
          animationDelay: `${i * 0.2}s`
        }} />
      ))}
      <style>{`
        @keyframes typingBounce {
          0%,80%,100%{transform:translateY(0);opacity:0.4}
          40%{transform:translateY(-5px);opacity:1}
        }
      `}</style>
    </div>
  )
}

export default function ChatBot() {
  const [open,      setOpen]      = useState(false)
  const [minimised, setMinimised] = useState(false)
  const [messages,  setMessages]  = useState([
    { role: 'assistant', text: "👋 Hi! I'm Aswen, your AI assistant. How can I help you today?", ts: new Date() }
  ])
  const [input,   setInput]   = useState('')
  const [loading, setLoading] = useState(false)
  const [unread,  setUnread]  = useState(0)
  const endRef  = useRef(null)
  const inputRef= useRef(null)

  useEffect(() => { if (open) { setUnread(0); setTimeout(() => inputRef.current?.focus(), 100) } }, [open])
  useEffect(() => { if (open && !minimised) endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, open, minimised])

  const send = async text => {
    const msg = text || input.trim()
    if (!msg || loading) return
    setInput('')
    const userMsg = { role: 'user', text: msg, ts: new Date() }
    setMessages(prev => [...prev, userMsg])
    setLoading(true)

    try {
      const res  = await fetch(`${API}/chat/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg })
      })
      const data = await res.json()
      const reply = data.response || data.message || data.reply || "I'm sorry, I couldn't process that. Please try again."
      setMessages(prev => [...prev, { role: 'assistant', text: reply, ts: new Date() }])
      if (!open) setUnread(n => n + 1)
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', text: "I'm having trouble connecting right now. Please try again shortly.", ts: new Date() }])
    } finally { setLoading(false) }
  }

  const onKey = e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }

  const fmt = date => date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })

  return (
    <>
      {/* Bubble */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          style={{
            position: 'fixed', bottom: '1.75rem', right: '1.75rem', zIndex: 50,
            width: '3.5rem', height: '3.5rem', borderRadius: '50%', border: 'none', cursor: 'pointer',
            background: 'linear-gradient(135deg,#059669,#047857)',
            boxShadow: '0 8px 28px rgba(16,185,129,0.55)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            animation: 'float 3s ease-in-out infinite',
            transition: 'transform 0.2s'
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          <MessageSquare style={{ width: '1.3rem', height: '1.3rem', color: 'white' }} />
          {unread > 0 && (
            <div style={{
              position: 'absolute', top: '-0.25rem', right: '-0.25rem',
              width: '1.25rem', height: '1.25rem', borderRadius: '50%',
              background: '#f59e0b', border: '2px solid #080d1a',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.65rem', fontWeight: 700, color: '#0c1322'
            }}>{unread}</div>
          )}
        </button>
      )}

      {/* Chat Window */}
      {open && (
        <div style={{
          position: 'fixed', bottom: '1.75rem', right: '1.75rem', zIndex: 50,
          width: 'min(22rem, calc(100vw - 2rem))',
          borderRadius: '1.25rem', overflow: 'hidden',
          background: 'rgba(8,13,26,0.97)',
          border: '1px solid rgba(16,185,129,0.3)',
          boxShadow: '0 24px 64px rgba(0,0,0,0.7), 0 0 0 1px rgba(16,185,129,0.1)',
          display: 'flex', flexDirection: 'column',
          backdropFilter: 'blur(20px)',
          animation: 'fadeUp 0.3s cubic-bezier(0.22,1,0.36,1) both',
          maxHeight: minimised ? 'auto' : '75vh',
        }}>

          {/* Header */}
          <div style={{
            padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem',
            background: 'linear-gradient(135deg,rgba(5,150,105,0.2),rgba(6,182,212,0.1))',
            borderBottom: '1px solid rgba(16,185,129,0.15)'
          }}>
            <div style={{
              width: '2.5rem', height: '2.5rem', borderRadius: '50%', flexShrink: 0,
              background: 'linear-gradient(135deg,#059669,#047857)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 12px rgba(16,185,129,0.4)'
            }}>
              <Bot style={{ width: '1.1rem', height: '1.1rem', color: 'white' }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '0.9rem', color: '#ecfdf5' }}>Aswen AI</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <div style={{ width: '0.5rem', height: '0.5rem', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 4px #10b981' }} />
                <span style={{ fontSize: '0.7rem', color: '#10b981' }}>Online</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.35rem' }}>
              <button onClick={() => setMinimised(!minimised)} style={{ padding: '0.3rem', borderRadius: '0.4rem', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.15)', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center' }}>
                {minimised ? <Maximize2 style={{ width: '0.8rem', height: '0.8rem' }} /> : <Minimize2 style={{ width: '0.8rem', height: '0.8rem' }} />}
              </button>
              <button onClick={() => setOpen(false)} style={{ padding: '0.3rem', borderRadius: '0.4rem', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)', cursor: 'pointer', color: '#fca5a5', display: 'flex', alignItems: 'center' }}>
                <X style={{ width: '0.8rem', height: '0.8rem' }} />
              </button>
            </div>
          </div>

          {!minimised && (
            <>
              {/* Messages */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {messages.map((msg, i) => (
                  <div key={i} style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-end', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row' }}>
                    <div style={{
                      width: '1.75rem', height: '1.75rem', borderRadius: '50%', flexShrink: 0,
                      background: msg.role === 'user'
                        ? 'linear-gradient(135deg,rgba(6,182,212,0.3),rgba(6,182,212,0.15))'
                        : 'linear-gradient(135deg,#059669,#047857)',
                      border: `1px solid ${msg.role === 'user' ? 'rgba(6,182,212,0.3)' : 'rgba(16,185,129,0.4)'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      {msg.role === 'user'
                        ? <User style={{ width: '0.75rem', height: '0.75rem', color: '#22d3ee' }} />
                        : <Bot  style={{ width: '0.75rem', height: '0.75rem', color: 'white'    }} />}
                    </div>
                    <div style={{ maxWidth: '78%' }}>
                      <div style={{
                        padding: '0.65rem 0.9rem', borderRadius: msg.role === 'user' ? '1rem 1rem 0.2rem 1rem' : '1rem 1rem 1rem 0.2rem',
                        background: msg.role === 'user'
                          ? 'linear-gradient(135deg,rgba(6,182,212,0.15),rgba(6,182,212,0.08))'
                          : 'rgba(16,25,41,0.9)',
                        border: `1px solid ${msg.role === 'user' ? 'rgba(6,182,212,0.25)' : 'rgba(16,185,129,0.15)'}`,
                        fontSize: '0.82rem', lineHeight: 1.65, color: '#cbd5e1'
                      }}>
                        {msg.text}
                      </div>
                      <div style={{ fontSize: '0.62rem', color: '#334155', marginTop: '0.2rem', textAlign: msg.role === 'user' ? 'right' : 'left' }}>
                        {fmt(msg.ts)}
                      </div>
                    </div>
                  </div>
                ))}
                {loading && (
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.6rem' }}>
                    <div style={{ width: '1.75rem', height: '1.75rem', borderRadius: '50%', background: 'linear-gradient(135deg,#059669,#047857)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Bot style={{ width: '0.75rem', height: '0.75rem', color: 'white' }} />
                    </div>
                    <div style={{ background: 'rgba(16,25,41,0.9)', border: '1px solid rgba(16,185,129,0.15)', borderRadius: '1rem 1rem 1rem 0.2rem' }}>
                      <TypingDots />
                    </div>
                  </div>
                )}
                <div ref={endRef} />
              </div>

              {/* Suggestions */}
              {messages.length <= 2 && (
                <div style={{ padding: '0 1rem 0.75rem', display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {SUGGESTIONS.map((s, i) => (
                    <button key={i} onClick={() => send(s)} style={{
                      padding: '0.3rem 0.65rem', fontSize: '0.7rem', fontWeight: 500,
                      borderRadius: '9999px', cursor: 'pointer',
                      background: 'rgba(16,185,129,0.07)', border: '1px solid rgba(16,185,129,0.2)',
                      color: '#6ee7b7', transition: 'all 0.15s', whiteSpace: 'nowrap'
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(16,185,129,0.15)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(16,185,129,0.07)'}>
                      {s}
                    </button>
                  ))}
                </div>
              )}

              {/* Input */}
              <div style={{ padding: '0.85rem', borderTop: '1px solid rgba(16,185,129,0.12)', display: 'flex', gap: '0.6rem', alignItems: 'flex-end' }}>
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={onKey}
                  placeholder="Ask Aswen anything…"
                  rows={1}
                  style={{
                    flex: 1, padding: '0.6rem 0.85rem', background: 'rgba(15,25,41,0.8)',
                    border: '1px solid rgba(16,185,129,0.2)', borderRadius: '0.65rem',
                    color: '#e2e8f0', fontSize: '0.82rem', outline: 'none',
                    resize: 'none', fontFamily: 'Manrope,sans-serif', lineHeight: 1.5,
                    maxHeight: '6rem', overflowY: 'auto'
                  }}
                  onFocus={e => e.target.style.borderColor = 'rgba(16,185,129,0.5)'}
                  onBlur={e  => e.target.style.borderColor = 'rgba(16,185,129,0.2)'}
                />
                <button
                  onClick={() => send()}
                  disabled={!input.trim() || loading}
                  style={{
                    width: '2.25rem', height: '2.25rem', borderRadius: '0.6rem', border: 'none',
                    background: !input.trim() || loading ? 'rgba(16,185,129,0.1)' : 'linear-gradient(135deg,#059669,#047857)',
                    color: !input.trim() || loading ? '#1e293b' : 'white',
                    cursor: !input.trim() || loading ? 'not-allowed' : 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, transition: 'all 0.2s'
                  }}>
                  <Send style={{ width: '0.85rem', height: '0.85rem' }} />
                </button>
              </div>

              {/* Footer */}
              <div style={{ padding: '0.4rem', textAlign: 'center', borderTop: '1px solid rgba(16,185,129,0.06)' }}>
                <span style={{ fontSize: '0.62rem', color: '#1e293b' }}>Powered by AswenSolutions AI</span>
              </div>
            </>
          )}
        </div>
      )}
    </>
  )
}

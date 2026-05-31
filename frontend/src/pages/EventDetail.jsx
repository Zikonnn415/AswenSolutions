import { useParams, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { ArrowLeft, CalendarDays, MapPin, Clock } from 'lucide-react'

const API = 'http://127.0.0.1:8000/api'

export default function EventDetail() {
  const { id } = useParams()
  const [event, setEvent]   = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API}/events/${id}/`)
      .then(r => r.json())
      .then(setEvent)
      .catch(() => setEvent(null))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="page-shell" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div className="spinner" style={{ width: '1.5rem', height: '1.5rem' }} /></div>
  if (!event) return <div className="page-shell page-wrap" style={{ padding: '4rem 1.25rem', textAlign: 'center' }}><p style={{ color: '#475569' }}>Event not found.</p><Link to="/events" className="btn-outline" style={{ marginTop: '1.5rem' }}>Back to Events</Link></div>

  return (
    <div className="page-shell" style={{ padding: '3rem 0 6rem' }}>
      <div className="page-wrap" style={{ maxWidth: '52rem' }}>
        <Link to="/events" className="btn-ghost" style={{ marginBottom: '2rem', display: 'inline-flex' }}>
          <ArrowLeft style={{ width: '0.9rem', height: '0.9rem' }} /> Back to Events
        </Link>
        <div className="card-glass" style={{ padding: '2.5rem' }}>
          <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
            {event.event_type && <span className="badge badge-cyan">{event.event_type}</span>}
            <span className={`badge ${event.date && new Date(event.date) >= new Date() ? 'badge-green' : 'badge-slate'}`}>
              {event.date && new Date(event.date) >= new Date() ? 'Upcoming' : 'Past Event'}
            </span>
          </div>
          <h1 className="display-lg" style={{ marginBottom: '1.5rem' }}>{event.title}</h1>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
            {event.date && <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#64748b', fontSize: '0.9rem' }}><CalendarDays style={{ width: '1rem', height: '1rem', color: '#10b981' }} />{new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>}
            {event.time     && <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#64748b', fontSize: '0.9rem' }}><Clock style={{ width: '1rem', height: '1rem', color: '#10b981' }} />{event.time}</div>}
            {event.location && <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#64748b', fontSize: '0.9rem' }}><MapPin style={{ width: '1rem', height: '1rem', color: '#10b981' }} />{event.location}</div>}
          </div>
          <hr style={{ border: 'none', borderTop: '1px solid rgba(16,185,129,0.12)', marginBottom: '2rem' }} />
          <div style={{ color: '#94a3b8', lineHeight: 1.85, fontSize: '0.95rem', whiteSpace: 'pre-wrap' }}>{event.description}</div>
          {event.registration_link && (
            <a href={event.registration_link} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ marginTop: '2rem', display: 'inline-flex' }}>
              Register Now
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

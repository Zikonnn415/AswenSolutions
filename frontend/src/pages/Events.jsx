import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { CalendarDays, MapPin, ArrowRight, Clock, Sparkles } from 'lucide-react'

const API = 'http://127.0.0.1:8000/api'

export default function Events() {
  const [events, setEvents]   = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API}/events/?limit=50`)
      .then(r => r.json())
      .then(d => setEvents(d?.results || []))
      .catch(() => setEvents([]))
      .finally(() => setLoading(false))
  }, [])

  const now = new Date()
  const upcoming = events.filter(e => e.date ? new Date(e.date) >= now : true)
  const past     = events.filter(e => e.date ? new Date(e.date) < now  : false)

  const EventCard = ({ e }) => (
    <div className="card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        {e.date && new Date(e.date) >= now
          ? <span className="badge badge-green">Upcoming</span>
          : <span className="badge badge-slate">Past</span>}
        {e.event_type && <span className="badge badge-cyan">{e.event_type}</span>}
      </div>
      <h3 className="display-md" style={{ fontSize: '1rem', marginBottom: '0.6rem' }}>{e.title}</h3>
      <p style={{ color: '#475569', fontSize: '0.855rem', lineHeight: 1.65, flex: 1, marginBottom: '1.25rem' }}>{e.description || e.excerpt}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.25rem' }}>
        {e.date && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#64748b' }}>
            <CalendarDays style={{ width: '0.85rem', height: '0.85rem', color: '#10b981' }} />
            {new Date(e.date).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
          </div>
        )}
        {e.time && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#64748b' }}>
            <Clock style={{ width: '0.85rem', height: '0.85rem', color: '#10b981' }} /> {e.time}
          </div>
        )}
        {e.location && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#64748b' }}>
            <MapPin style={{ width: '0.85rem', height: '0.85rem', color: '#10b981' }} /> {e.location}
          </div>
        )}
      </div>
      <Link to={`/events/${e.id}`} className="btn-outline" style={{ fontSize: '0.8rem', padding: '0.5rem 1rem', alignSelf: 'flex-start' }}>
        View Details <ArrowRight style={{ width: '0.85rem', height: '0.85rem' }} />
      </Link>
    </div>
  )

  return (
    <div className="page-shell">
      <section className="hero-mesh" style={{ padding: '4.5rem 0 3.5rem', textAlign: 'center' }}>
        <div className="page-wrap">
          <div className="label-tag" style={{ justifyContent: 'center', marginBottom: '1.25rem' }}>
            <CalendarDays style={{ width: '0.8rem', height: '0.8rem' }} /> Events
          </div>
          <h1 className="display-xl" style={{ marginBottom: '1rem', fontSize: 'clamp(2rem,5vw,3.5rem)' }}>Events & Webinars</h1>
          <p style={{ color: '#64748b', maxWidth: '30rem', margin: '0 auto', lineHeight: 1.75 }}>
            Stay ahead — join our AI workshops, webinars, and industry events.
          </p>
        </div>
      </section>

      <section style={{ padding: '3rem 0 6rem' }}>
        <div className="page-wrap">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '5rem', color: '#475569' }}>
              <div className="spinner" style={{ width: '1.5rem', height: '1.5rem', margin: '0 auto 1rem' }} />
              <p>Loading events…</p>
            </div>
          ) : events.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '5rem' }}>
              <Sparkles style={{ width: '2rem', height: '2rem', color: '#334155', margin: '0 auto 1rem' }} />
              <p style={{ color: '#475569' }}>No events scheduled yet. Check back soon.</p>
            </div>
          ) : (
            <>
              {upcoming.length > 0 && (
                <>
                  <div className="section-label" style={{ marginBottom: '1.5rem' }}>Upcoming</div>
                  <div className="grid-3 stagger" style={{ marginBottom: '3rem' }}>
                    {upcoming.map((e, i) => <EventCard key={e.id || i} e={e} />)}
                  </div>
                </>
              )}
              {past.length > 0 && (
                <>
                  <div className="divider" style={{ marginBottom: '2.5rem' }} />
                  <div className="section-label" style={{ marginBottom: '1.5rem' }}>Past Events</div>
                  <div className="grid-3 stagger">
                    {past.map((e, i) => <EventCard key={e.id || i} e={e} />)}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  )
}

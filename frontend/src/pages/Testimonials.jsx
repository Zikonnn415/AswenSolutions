import { useEffect, useState } from 'react'
import { Star, Quote, Users } from 'lucide-react'

const API = 'http://127.0.0.1:8000/api'

function Stars({ count }) {
  return (
    <div style={{ display: 'flex', gap: '0.2rem' }}>
      {[1,2,3,4,5].map(n => (
        <Star key={n} style={{ width: '0.9rem', height: '0.9rem', fill: n <= count ? '#f59e0b' : 'transparent', color: n <= count ? '#f59e0b' : '#1e293b' }} />
      ))}
    </div>
  )
}

function Avatar({ name }) {
  const initials = name.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase()
  const colors = ['#059669','#0891b2','#d97706','#7c3aed','#dc2626']
  const color  = colors[name.charCodeAt(0) % colors.length]
  return (
    <div style={{ width: '2.75rem', height: '2.75rem', borderRadius: '50%', background: `${color}22`, border: `2px solid ${color}55`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '0.85rem', color, flexShrink: 0 }}>
      {initials}
    </div>
  )
}

export default function Testimonials() {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API}/testimonials/?limit=50`)
      .then(r => r.json())
      .then(d => setReviews(d?.results || []))
      .catch(() => setReviews([]))
      .finally(() => setLoading(false))
  }, [])

  const avgRating = reviews.length ? (reviews.reduce((s, r) => s + (r.stars || 5), 0) / reviews.length).toFixed(1) : null

  return (
    <div className="page-shell">
      {/* Hero */}
      <section className="hero-mesh" style={{ padding: '4.5rem 0 3.5rem', textAlign: 'center' }}>
        <div className="page-wrap">
          <div className="label-tag" style={{ justifyContent: 'center', marginBottom: '1.25rem' }}>
            <Star style={{ width: '0.8rem', height: '0.8rem' }} /> Client Feedback
          </div>
          <h1 className="display-xl" style={{ marginBottom: '1rem', fontSize: 'clamp(2rem,5vw,3.5rem)' }}>What Our Clients Say</h1>
          <p style={{ color: '#64748b', maxWidth: '30rem', margin: '0 auto', lineHeight: 1.75 }}>
            Real feedback from the businesses we've helped transform with AI.
          </p>
          {avgRating && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginTop: '1.5rem' }}>
              <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '2.5rem', fontWeight: 800, color: '#f59e0b', lineHeight: 1 }}>{avgRating}</div>
              <div>
                <Stars count={Math.round(Number(avgRating))} />
                <p style={{ fontSize: '0.78rem', color: '#475569', marginTop: '0.25rem' }}>{reviews.length} verified reviews</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Cards */}
      <section style={{ padding: '3rem 0 6rem' }}>
        <div className="page-wrap">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '5rem', color: '#475569' }}>
              <div className="spinner" style={{ width: '1.5rem', height: '1.5rem', margin: '0 auto 1rem' }} />
              <p>Loading testimonials…</p>
            </div>
          ) : reviews.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '5rem' }}>
              <Users style={{ width: '2rem', height: '2rem', color: '#334155', margin: '0 auto 1rem' }} />
              <p style={{ color: '#475569' }}>No testimonials yet. Check back soon.</p>
            </div>
          ) : (
            <div className="grid-3 stagger">
              {reviews.map((r, i) => (
                <div key={r.id || i} className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column' }}>
                  <Quote style={{ width: '1.5rem', height: '1.5rem', color: 'rgba(16,185,129,0.3)', marginBottom: '1rem', flexShrink: 0 }} />
                  <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.75, flex: 1, marginBottom: '1.5rem', fontStyle: 'italic' }}>"{r.feedback}"</p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <Avatar name={r.client_name} />
                      <div>
                        <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '0.9rem', color: '#ecfdf5' }}>{r.client_name}</p>
                        {r.organisation && <p style={{ fontSize: '0.75rem', color: '#475569' }}>{r.organisation}</p>}
                      </div>
                    </div>
                    <Stars count={r.stars || 5} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

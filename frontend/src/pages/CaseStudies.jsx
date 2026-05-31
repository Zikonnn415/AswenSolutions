import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Briefcase, ArrowRight, Search, Sparkles } from 'lucide-react'
import { getProjectImage } from '../utils/caseStudyImages.js'

const API = 'http://127.0.0.1:8000/api'

export default function CaseStudies() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading]   = useState(true)
  const [query, setQuery]       = useState('')

  useEffect(() => {
    fetch(`${API}/case-studies/?limit=50`)
      .then(r => r.json())
      .then(d => setProjects(d?.results || []))
      .catch(() => setProjects([]))
      .finally(() => setLoading(false))
  }, [])

  const filtered = projects.filter(p =>
    p.title.toLowerCase().includes(query.toLowerCase()) ||
    (p.summary || '').toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="page-shell">
      {/* Hero */}
      <section className="hero-mesh" style={{ padding: '4.5rem 0 3.5rem', textAlign: 'center' }}>
        <div className="page-wrap">
          <div className="label-tag" style={{ justifyContent: 'center', marginBottom: '1.25rem' }}>
            <Briefcase style={{ width: '0.8rem', height: '0.8rem' }} /> Portfolio
          </div>
          <h1 className="display-xl" style={{ marginBottom: '1rem', fontSize: 'clamp(2rem,5vw,3.5rem)' }}>Case Studies</h1>
          <p style={{ color: '#64748b', maxWidth: '30rem', margin: '0 auto', lineHeight: 1.75 }}>
            Real AI solutions we've delivered — from rapid prototypes to full enterprise deployments.
          </p>
        </div>
      </section>

      {/* Search */}
      <section style={{ padding: '2rem 0' }}>
        <div className="page-wrap" style={{ maxWidth: '36rem', margin: '0 auto' }}>
          <div style={{ position: 'relative' }}>
            <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', width: '1rem', height: '1rem', color: '#475569' }} />
            <input
              className="form-input"
              style={{ paddingLeft: '2.75rem' }}
              placeholder="Search case studies…"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Grid */}
      <section style={{ padding: '2rem 0 6rem' }}>
        <div className="page-wrap">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '5rem', color: '#475569' }}>
              <div className="spinner" style={{ width: '1.5rem', height: '1.5rem', margin: '0 auto 1rem' }} />
              <p>Loading case studies…</p>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '5rem' }}>
              <Sparkles style={{ width: '2rem', height: '2rem', color: '#334155', margin: '0 auto 1rem' }} />
              <p style={{ color: '#475569' }}>{query ? 'No results for your search.' : 'No case studies yet. Check back soon.'}</p>
            </div>
          ) : (
            <div className="grid-3 stagger">
              {filtered.map((p, i) => {
                const imageSrc = getProjectImage(p, i)
                return (
                  <div key={p.id || i} className="card" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                    {imageSrc ? (
                      <img src={imageSrc} alt={p.title} style={{ width: '100%', height: '11rem', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '100%', height: '11rem', background: 'linear-gradient(135deg,rgba(16,185,129,0.12),rgba(6,182,212,0.08))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Briefcase style={{ width: '2.5rem', height: '2.5rem', color: '#1a273d' }} />
                      </div>
                    )}
                  <div style={{ padding: '1.75rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <h3 className="display-md" style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>{p.title}</h3>
                    <p style={{ color: '#475569', fontSize: '0.855rem', lineHeight: 1.65, flex: 1, marginBottom: '1.25rem' }}>{p.summary}</p>
                    <Link to={`/case-studies/${p.id}`} className="btn-outline" style={{ fontSize: '0.8rem', padding: '0.5rem 1rem', alignSelf: 'flex-start' }}>
                      Read More <ArrowRight style={{ width: '0.85rem', height: '0.85rem' }} />
                    </Link>
                  </div>
                </div>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { BookOpen, ArrowRight, Search, Calendar } from 'lucide-react'
import emergingImg from '../images/emerging.jpeg'
import aiBankingImg from '../images/aibanking.jpeg'
import roiImg from '../images/ROI.jpeg'

const API = 'http://127.0.0.1:8000/api'

const getBlogCoverImage = article => {
  if (!article?.title) return null
  const title = article.title.toLowerCase()
  if (title.includes('roi')) return roiImg
  if (title.includes('emerging markets') || title.includes('responsible ai')) return emergingImg
  if (title.includes('bank') || title.includes('banking')) return aiBankingImg
  return null
}

export default function Blog() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading]   = useState(true)
  const [query, setQuery]       = useState('')

  useEffect(() => {
    fetch(`${API}/blogs/?limit=50`)
      .then(r => r.json())
      .then(d => setArticles(d?.results || []))
      .catch(() => setArticles([]))
      .finally(() => setLoading(false))
  }, [])

  const filtered = articles.filter(a =>
    a.title.toLowerCase().includes(query.toLowerCase()) ||
    (a.excerpt || '').toLowerCase().includes(query.toLowerCase())
  )

  const renderArticleCard = (a, i) => {
    const coverImage = a.cover_url || getBlogCoverImage(a)
    return (
      <div key={a.id || i} className="card" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {coverImage ? (
          <img src={coverImage} alt={a.title} style={{ width: '100%', height: '10rem', objectFit: 'cover' }} />
        ) : (
          <div style={{ width: '100%', height: '10rem', background: 'linear-gradient(135deg,rgba(16,185,129,0.1),rgba(6,182,212,0.06))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BookOpen style={{ width: '2.5rem', height: '2.5rem', color: '#1a273d' }} />
          </div>
        )}
        <div style={{ padding: '1.75rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
          {a.published_at && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: '#475569', marginBottom: '0.75rem' }}>
              <Calendar style={{ width: '0.75rem', height: '0.75rem' }} />
              {new Date(a.published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
            </div>
          )}
          <h3 className="display-md" style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>{a.title}</h3>
          <p style={{ color: '#475569', fontSize: '0.855rem', lineHeight: 1.65, flex: 1, marginBottom: '1.25rem' }}>{a.excerpt}</p>
          <Link to={`/blog/${a.id}`} className="btn-outline" style={{ fontSize: '0.8rem', padding: '0.5rem 1rem', alignSelf: 'flex-start' }}>
            Read Article <ArrowRight style={{ width: '0.85rem', height: '0.85rem' }} />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="page-shell">
      <section className="hero-mesh" style={{ padding: '4.5rem 0 3.5rem', textAlign: 'center' }}>
        <div className="page-wrap">
          <div className="label-tag" style={{ justifyContent: 'center', marginBottom: '1.25rem' }}>
            <BookOpen style={{ width: '0.8rem', height: '0.8rem' }} /> Knowledge Hub
          </div>
          <h1 className="display-xl" style={{ marginBottom: '1rem', fontSize: 'clamp(2rem,5vw,3.5rem)' }}>Blog & Insights</h1>
          <p style={{ color: '#64748b', maxWidth: '30rem', margin: '0 auto', lineHeight: 1.75 }}>
            Expert articles on AI trends, implementation guides, and industry updates.
          </p>
        </div>
      </section>

      <section style={{ padding: '2rem 0' }}>
        <div className="page-wrap" style={{ maxWidth: '36rem', margin: '0 auto' }}>
          <div style={{ position: 'relative' }}>
            <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', width: '1rem', height: '1rem', color: '#475569' }} />
            <input className="form-input" style={{ paddingLeft: '2.75rem' }} placeholder="Search articles…" value={query} onChange={e => setQuery(e.target.value)} />
          </div>
        </div>
      </section>

      <section style={{ padding: '2rem 0 6rem' }}>
        <div className="page-wrap">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '5rem', color: '#475569' }}>
              <div className="spinner" style={{ width: '1.5rem', height: '1.5rem', margin: '0 auto 1rem' }} />
              <p>Loading articles…</p>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '5rem' }}>
              <p style={{ color: '#475569' }}>{query ? 'No results for your search.' : 'No articles yet. Check back soon.'}</p>
            </div>
          ) : (
            <div className="grid-3 stagger">
              {filtered.map(renderArticleCard)}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

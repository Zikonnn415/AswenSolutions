import { useParams, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { ArrowLeft, BookOpen, Calendar, Clock } from 'lucide-react'
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

export default function BlogPost() {
  const { id } = useParams()
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API}/blogs/${id}/`)
      .then(r => r.json())
      .then(setArticle)
      .catch(() => setArticle(null))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="page-shell" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div className="spinner" style={{ width: '1.5rem', height: '1.5rem' }} /></div>
  if (!article) return <div className="page-shell page-wrap" style={{ padding: '4rem 1.25rem', textAlign: 'center' }}><p style={{ color: '#475569' }}>Article not found.</p><Link to="/blog" className="btn-outline" style={{ marginTop: '1.5rem' }}>Back to Blog</Link></div>

  const readTime = Math.max(1, Math.ceil((article.body || '').split(' ').length / 200))
  const coverImage = article.cover_url || getBlogCoverImage(article)

  return (
    <div className="page-shell" style={{ padding: '3rem 0 6rem' }}>
      <div className="page-wrap" style={{ maxWidth: '52rem' }}>
        <Link to="/blog" className="btn-ghost" style={{ marginBottom: '2rem', display: 'inline-flex' }}>
          <ArrowLeft style={{ width: '0.9rem', height: '0.9rem' }} /> Back to Blog
        </Link>
        {coverImage && (
          <img src={coverImage} alt={article.title} style={{ width: '100%', height: '22rem', objectFit: 'cover', borderRadius: '1rem', marginBottom: '2rem', border: '1px solid rgba(16,185,129,0.15)' }} />
        )}
        <div className="card-glass" style={{ padding: '2.5rem' }}>
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <span className="badge badge-cyan"><BookOpen style={{ width: '0.65rem', height: '0.65rem' }} /> Article</span>
            {article.published_at && (
              <span style={{ fontSize: '0.78rem', color: '#475569', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Calendar style={{ width: '0.75rem', height: '0.75rem' }} />
                {new Date(article.published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            )}
            <span style={{ fontSize: '0.78rem', color: '#475569', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Clock style={{ width: '0.75rem', height: '0.75rem' }} /> {readTime} min read
            </span>
          </div>
          <h1 className="display-lg" style={{ marginBottom: '0.75rem' }}>{article.title}</h1>
          {article.excerpt && <p style={{ color: '#34d399', fontSize: '1.05rem', marginBottom: '2rem', fontWeight: 500, lineHeight: 1.6 }}>{article.excerpt}</p>}
          <hr style={{ border: 'none', borderTop: '1px solid rgba(16,185,129,0.12)', marginBottom: '2rem' }} />
          <div style={{ color: '#94a3b8', lineHeight: 1.85, fontSize: '0.95rem', whiteSpace: 'pre-wrap' }}>{article.body}</div>
        </div>
      </div>
    </div>
  )
}

// CaseStudyDetail.jsx
import { useParams, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { ArrowLeft, Briefcase, Calendar } from 'lucide-react'
import { getProjectImage } from '../utils/caseStudyImages.js'

const API = 'http://127.0.0.1:8000/api'

export function CaseStudyDetail() {
  const { id } = useParams()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API}/case-studies/${id}/`)
      .then(r => r.json())
      .then(setProject)
      .catch(() => setProject(null))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="page-shell" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div className="spinner" style={{ width: '1.5rem', height: '1.5rem' }} /></div>
  if (!project) return <div className="page-shell page-wrap" style={{ padding: '4rem 1.25rem', textAlign: 'center' }}><p style={{ color: '#475569' }}>Case study not found.</p><Link to="/case-studies" className="btn-outline" style={{ marginTop: '1.5rem' }}>Back to Case Studies</Link></div>

  const imageSrc = getProjectImage(project)

  return (
    <div className="page-shell" style={{ padding: '3rem 0 6rem' }}>
      <div className="page-wrap" style={{ maxWidth: '52rem' }}>
        <Link to="/case-studies" className="btn-ghost" style={{ marginBottom: '2rem', display: 'inline-flex' }}>
          <ArrowLeft style={{ width: '0.9rem', height: '0.9rem' }} /> Back to Case Studies
        </Link>
        {imageSrc && (
          <img src={imageSrc} alt={project.title} style={{ width: '100%', height: '22rem', objectFit: 'cover', borderRadius: '1rem', marginBottom: '2rem', border: '1px solid rgba(16,185,129,0.15)' }} />
        )}
        <div className="card-glass" style={{ padding: '2.5rem' }}>
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
            <span className="badge badge-green"><Briefcase style={{ width: '0.65rem', height: '0.65rem' }} /> Case Study</span>
            {project.created_at && <span style={{ fontSize: '0.78rem', color: '#475569', display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Calendar style={{ width: '0.75rem', height: '0.75rem' }} />{new Date(project.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>}
          </div>
          <h1 className="display-lg" style={{ marginBottom: '0.75rem' }}>{project.title}</h1>
          <p style={{ color: '#34d399', fontSize: '1.05rem', marginBottom: '2rem', fontWeight: 500 }}>{project.summary}</p>
          <div style={{ color: '#94a3b8', lineHeight: 1.8, fontSize: '0.95rem', whiteSpace: 'pre-wrap' }}>{project.description}</div>
        </div>
      </div>
    </div>
  )
}

export default CaseStudyDetail

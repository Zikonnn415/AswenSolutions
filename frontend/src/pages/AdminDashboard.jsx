import { useEffect, useState, useCallback } from 'react'
import {
  LayoutDashboard, FileText, Briefcase, Star, CalendarDays,
  LogOut, X, Eye, CheckCircle, Clock, Trash2, PenLine, Plus,
  AlertTriangle, Save, RefreshCw, Search, MessageSquare,
  Users, TrendingUp, Zap, ChevronDown, ChevronUp
} from 'lucide-react'

const BASE = 'http://127.0.0.1:8000/api'

/* ── Toast ───────────────────────────────────────────────────────── */
function Toast({ message, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t) }, [onClose])
  const colors = {
    success: { bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.35)', text: '#34d399' },
    error:   { bg: 'rgba(239,68,68,0.12)',  border: 'rgba(239,68,68,0.35)',  text: '#fca5a5' },
    info:    { bg: 'rgba(6,182,212,0.12)',  border: 'rgba(6,182,212,0.35)',  text: '#67e8f9' },
  }
  const c = colors[type] || colors.info
  return (
    <div className="animate-fade-in" style={{
      position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 100,
      display: 'flex', alignItems: 'center', gap: '0.75rem',
      padding: '0.85rem 1.25rem', borderRadius: '0.85rem',
      background: c.bg, border: `1px solid ${c.border}`, color: c.text,
      backdropFilter: 'blur(12px)', fontSize: '0.875rem', fontWeight: 500,
      minWidth: '16rem', boxShadow: '0 16px 40px rgba(0,0,0,0.4)'
    }}>
      {type === 'success' && <CheckCircle style={{ width: '1rem', height: '1rem', flexShrink: 0 }} />}
      {type === 'error'   && <AlertTriangle style={{ width: '1rem', height: '1rem', flexShrink: 0 }} />}
      {message}
      <button onClick={onClose} style={{ marginLeft: 'auto', opacity: 0.6, cursor: 'pointer', background: 'none', border: 'none', color: 'inherit' }}>
        <X style={{ width: '0.9rem', height: '0.9rem' }} />
      </button>
    </div>
  )
}

/* ── Confirm Modal ───────────────────────────────────────────────── */
function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 90, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', background: 'rgba(4,7,15,0.9)', backdropFilter: 'blur(8px)' }}>
      <div className="card-elevated" style={{ width: '100%', maxWidth: '22rem', padding: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ width: '2.75rem', height: '2.75rem', borderRadius: '50%', background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <AlertTriangle style={{ width: '1.1rem', height: '1.1rem', color: '#fca5a5' }} />
          </div>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.6 }}>{message}</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={onCancel}  className="btn-ghost" style={{ flex: 1 }}>Cancel</button>
          <button onClick={onConfirm} className="btn-danger" style={{ flex: 1 }}>Delete</button>
        </div>
      </div>
    </div>
  )
}

/* ── Inquiry View Modal ──────────────────────────────────────────── */
function InquiryModal({ inquiry, onClose }) {
  const fields = [
    ['Name', inquiry.name], ['Email', inquiry.email], ['Phone', inquiry.phone],
    ['Company', inquiry.company], ['Country', inquiry.country], ['Job Title', inquiry.job_title],
  ]
  return (
    <div className="admin-modal-backdrop">
      <div className="admin-modal admin-modal-inquiry">
        <div className="admin-modal-header">
          <div>
            <p>Inquiry</p>
            <h3>Inquiry Details</h3>
          </div>
          <button onClick={onClose} className="admin-modal-close" aria-label="Close inquiry details"><X style={{ width: '1rem', height: '1rem' }} /></button>
        </div>
        <div className="grid-2" style={{ marginBottom: '1.25rem', gap: '0.75rem' }}>
          {fields.map(([label, val]) => val ? (
            <div key={label} style={{ padding: '0.85rem', background: 'rgba(16,185,129,0.04)', border: '1px solid rgba(16,185,129,0.08)', borderRadius: '0.65rem' }}>
              <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.2rem' }}>{label}</p>
              <p style={{ fontSize: '0.875rem', color: '#94a3b8' }}>{val}</p>
            </div>
          ) : null)}
        </div>
        <div style={{ padding: '1rem', background: 'rgba(16,185,129,0.04)', border: '1px solid rgba(16,185,129,0.08)', borderRadius: '0.65rem' }}>
          <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>Project Details</p>
          <p style={{ fontSize: '0.875rem', color: '#94a3b8', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{inquiry.job_details}</p>
        </div>
      </div>
    </div>
  )
}

/* ── Form Modal ──────────────────────────────────────────────────── */
function FormModal({ type, item, token, onClose, onSaved, showToast }) {
  const isEdit = Boolean(item)
  const [form, setForm] = useState(item || {})
  const [saving, setSaving] = useState(false)

  const onChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const save = async () => {
    setSaving(true)
    const urlMap = { Blog: 'blogs', 'Case Study': 'case-studies', Testimonial: 'testimonials', Event: 'events' }
    const url = `${BASE}/${urlMap[type]}/${isEdit ? `${item.id}/` : ''}`
    const method = isEdit ? 'PUT' : 'POST'
    try {
      const res = await fetch(url, {
        method, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form)
      })
      if (!res.ok) throw new Error('Failed')
      showToast(`${type} ${isEdit ? 'updated' : 'created'} successfully`, 'success')
      onSaved(); onClose()
    } catch { showToast(`Failed to ${isEdit ? 'update' : 'create'} ${type}`, 'error') }
    finally { setSaving(false) }
  }

  const fieldSet = {
    Blog:        [['title','Title',true],['excerpt','Excerpt',false],['body','Body (content)',true],['cover_url','Cover Image URL',false]],
    'Case Study':[['title','Title',true],['summary','Summary',true],['description','Full Description',false],['image_url','Image URL',false]],
    Testimonial: [['client_name','Client Name',true],['organisation','Organisation',false],['stars','Stars (1-5)',false],['feedback','Feedback',true]],
    Event:       [['title','Title',true],['description','Description',false],['date','Date (YYYY-MM-DD)',false],['time','Time',false],['location','Location',false],['event_type','Event Type',false],['registration_link','Registration Link',false]],
  }

  const fields = fieldSet[type] || []
  const longFields = new Set(['body','description','feedback','excerpt'])

  return (
    <div className="admin-modal-backdrop">
      <div className="admin-modal">
        <div className="admin-modal-header">
          <div>
            <p>{isEdit ? 'Edit content' : 'New content'}</p>
            <h3>{isEdit ? 'Edit' : 'Create'} {type}</h3>
          </div>
          <button onClick={onClose} className="admin-modal-close" aria-label="Close form"><X style={{ width: '1rem', height: '1rem' }} /></button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {fields.map(([name, label, required]) => (
            <div key={name}>
              <label className="form-label">{label}{required && <span style={{ color: '#fca5a5' }}> *</span>}</label>
              {longFields.has(name)
                ? <textarea className="form-textarea" name={name} value={form[name] || ''} onChange={onChange} rows={4} />
                : <input className="form-input" type={name === 'stars' ? 'number' : 'text'} name={name} value={form[name] || ''} onChange={onChange} min={name === 'stars' ? 1 : undefined} max={name === 'stars' ? 5 : undefined} />
              }
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.75rem' }}>
          <button onClick={onClose} className="btn-ghost" style={{ flex: 1 }}>Cancel</button>
          <button onClick={save} className="btn-primary" style={{ flex: 1 }} disabled={saving}>
            {saving ? <><div className="spinner" /> Saving…</> : <><Save style={{ width: '0.9rem', height: '0.9rem' }} /> Save</>}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── Login Screen ────────────────────────────────────────────────── */
function LoginScreen({ onLogin }) {
  const [creds, setCreds] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async e => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const res = await fetch(`${BASE}/auth/login/`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(creds)
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Login failed')
      const token = data.access || data.token
      localStorage.setItem('nn_token', token)
      window.dispatchEvent(new Event('storage'))
      onLogin(token)
    } catch (err) { setError(err.message) }
    finally { setLoading(false) }
  }

  return (
    <div className="page-shell" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div className="card-elevated" style={{ width: '100%', maxWidth: '24rem', padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ width: '3.5rem', height: '3.5rem', borderRadius: '1rem', background: 'linear-gradient(135deg,#059669,#047857)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', boxShadow: '0 4px 20px rgba(16,185,129,0.4)' }}>
            <Zap style={{ width: '1.4rem', height: '1.4rem', color: 'white' }} />
          </div>
          <h1 className="display-md" style={{ fontSize: '1.3rem', marginBottom: '0.3rem' }}>Admin Portal</h1>
          <p style={{ color: '#475569', fontSize: '0.85rem' }}>AswenSolutions Dashboard</p>
        </div>
        {error && <div className="alert-error" style={{ marginBottom: '1.25rem' }}>{error}</div>}
        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label className="form-label">Username</label>
            <input className="form-input" type="text" value={creds.username} onChange={e => setCreds({ ...creds, username: e.target.value })} placeholder="admin" />
          </div>
          <div>
            <label className="form-label">Password</label>
            <input className="form-input" type="password" value={creds.password} onChange={e => setCreds({ ...creds, password: e.target.value })} placeholder="••••••••" />
          </div>
          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '0.5rem' }} disabled={loading}>
            {loading ? <><div className="spinner" /> Signing in…</> : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}

/* ── Main Dashboard ──────────────────────────────────────────────── */
export default function AdminDashboard() {
  const [token, setToken] = useState(localStorage.getItem('nn_token') || '')

  const [stats,        setStats]        = useState(null)
  const [activeTab,    setActiveTab]    = useState('Inquiries')
  const [inquiries,    setInquiries]    = useState([])
  const [blogs,        setBlogs]        = useState([])
  const [cases,        setCases]        = useState([])
  const [testimonials, setTestimonials] = useState([])
  const [events,       setEvents]       = useState([])
  const [loading,      setLoading]      = useState(false)
  const [toast,        setToast]        = useState(null)
  const [confirm,      setConfirm]      = useState(null)
  const [searchTerm,   setSearchTerm]   = useState('')
  const [filterUnrev,  setFilterUnrev]  = useState(false)
  const [inquiryModal, setInquiryModal] = useState(null)
  const [formModal,    setFormModal]    = useState(null)

  const showToast = useCallback((message, type = 'info') => setToast({ message, type }), [])

  const authFetch = useCallback((url, opts = {}) =>
    fetch(url, { ...opts, headers: { ...opts.headers, Authorization: `Bearer ${token}` } }), [token])

  const loadAll = useCallback(async () => {
    if (!token) return
    setLoading(true)
    try {
      const [s, i, b, c, t, e] = await Promise.all([
        authFetch(`${BASE}/analytics/`).then(r => r.json()),
        authFetch(`${BASE}/inquiries/?limit=100`).then(r => r.json()),
        authFetch(`${BASE}/blogs/?limit=100`).then(r => r.json()),
        authFetch(`${BASE}/case-studies/?limit=100`).then(r => r.json()),
        authFetch(`${BASE}/testimonials/?limit=100`).then(r => r.json()),
        authFetch(`${BASE}/events/?limit=100`).then(r => r.json()),
      ])
      setStats(s)
      setInquiries(i?.results || [])
      setBlogs(b?.results || [])
      setCases(c?.results || [])
      setTestimonials(t?.results || [])
      setEvents(e?.results || [])
    } catch { showToast('Failed to load data', 'error') }
    finally { setLoading(false) }
  }, [token, authFetch, showToast])

  useEffect(() => { if (token) loadAll() }, [token, loadAll])

  const logout = () => {
    localStorage.removeItem('nn_token')
    window.dispatchEvent(new Event('storage'))
    setToken('')
  }

  const del = async (endpoint, id, label) => {
    setConfirm({
      message: `Permanently delete this ${label}?`,
      onConfirm: async () => {
        setConfirm(null)
        try {
          const res = await authFetch(`${BASE}/${endpoint}/${id}/`, { method: 'DELETE' })
          if (!res.ok) throw new Error()
          showToast(`${label} deleted`, 'success')
          loadAll()
        } catch { showToast(`Failed to delete ${label}`, 'error') }
      }
    })
  }

  const toggleReview = async id => {
    try {
      await authFetch(`${BASE}/inquiries/${id}/toggle-review/`, { method: 'PATCH' })
      setInquiries(prev => prev.map(i => i.id === id ? { ...i, is_reviewed: !i.is_reviewed } : i))
      showToast('Status updated', 'success')
    } catch { showToast('Failed to update status', 'error') }
  }

  if (!token) return <LoginScreen onLogin={setToken} />

  const tabs = [
    { id: 'Inquiries',    icon: MessageSquare, count: inquiries.length },
    { id: 'Blogs',        icon: FileText,      count: blogs.length },
    { id: 'Case Studies', icon: Briefcase,     count: cases.length },
    { id: 'Testimonials', icon: Star,          count: testimonials.length },
    { id: 'Events',       icon: CalendarDays,  count: events.length },
  ]

  /* ── Filtered inquiries */
  const filteredInquiries = inquiries.filter(i => {
    const s = searchTerm.toLowerCase()
    const matchSearch = !s || i.name.toLowerCase().includes(s) || i.email.toLowerCase().includes(s) || (i.company || '').toLowerCase().includes(s)
    const matchFilter = !filterUnrev || !i.is_reviewed
    return matchSearch && matchFilter
  })

  const formatDate = value => value ? new Date(value).toLocaleDateString() : '-'
  const trimText = (value, max = 120) => {
    if (!value) return '-'
    const text = String(value)
    return text.length > max ? `${text.slice(0, max)}...` : text
  }

  return (
    <div className="page-shell admin-page">
      <div className="page-wrap">
        {/* Header */}
        <div className="admin-hero">
          <div>
            <div className="admin-eyebrow"><LayoutDashboard style={{ width: '0.9rem', height: '0.9rem' }} /> Admin Portal</div>
            <h1 className="display-md admin-title">Dashboard</h1>
            <p className="admin-subtitle">Review inquiries and manage public content from one clean workspace.</p>
          </div>
          <div className="admin-actions">
            <button onClick={loadAll} className="btn-ghost" disabled={loading}>
              <RefreshCw style={{ width: '0.9rem', height: '0.9rem', animation: loading ? 'spin 1s linear infinite' : 'none' }} />
              Refresh
            </button>
            <button onClick={logout} className="btn-danger">
              <LogOut style={{ width: '0.9rem', height: '0.9rem' }} /> Logout
            </button>
          </div>
        </div>

        {/* Stats */}
        {stats && (
          <div className="admin-stats">
            {[
              { label: 'Inquiries',    value: inquiries.length,    icon: MessageSquare, color: '#34d399' },
              { label: 'Case Studies', value: stats.case_studies,  icon: Briefcase,     color: '#22d3ee' },
              { label: 'Blog Posts',   value: stats.blogs,         icon: FileText,      color: '#fbbf24' },
              { label: 'Pending',      value: inquiries.filter(i => !i.is_reviewed).length, icon: Clock, color: '#fca5a5' },
            ].map(({ label, value, icon: Icon, color }, i) => (
              <div key={i} className="admin-stat-card">
                <div className="admin-stat-icon" style={{ color }}><Icon style={{ width: '1rem', height: '1rem' }} /></div>
                <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '1.75rem', fontWeight: 800, color, lineHeight: 1.1, marginBottom: '0.25rem' }}>{value ?? '—'}</div>
                <div style={{ fontSize: '0.72rem', fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Tabs */}
        <div className="admin-tabs">
          {tabs.map(({ id, icon: Icon, count }) => (
            <button key={id} onClick={() => { setActiveTab(id); setSearchTerm('') }}
              className={`admin-tab${activeTab === id ? ' active' : ''}`}>
              <Icon style={{ width: '0.85rem', height: '0.85rem' }} />
              {id}
              <span>{count}</span>
            </button>
          ))}
        </div>

        {/* ── Inquiries Tab ── */}
        {activeTab === 'Inquiries' && (
          <div>
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{ position: 'relative', flex: '1 1 16rem' }}>
                <Search style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', width: '0.9rem', height: '0.9rem', color: '#475569' }} />
                <input className="form-input" style={{ paddingLeft: '2.5rem', fontSize: '0.875rem', padding: '0.6rem 0.75rem 0.6rem 2.5rem' }} placeholder="Search inquiries…" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
              </div>
              <button onClick={() => setFilterUnrev(!filterUnrev)} className={filterUnrev ? 'btn-success' : 'btn-ghost'} style={{ fontSize: '0.8rem', padding: '0.55rem 1rem' }}>
                <Clock style={{ width: '0.8rem', height: '0.8rem' }} /> Pending Only
              </button>
            </div>
            <div className="card" style={{ overflow: 'hidden' }}>
              <div style={{ overflowX: 'auto' }}>
                <table className="as-table">
                  <thead><tr>
                    <th>Name</th><th>Email</th><th>Company</th><th>Status</th><th>Date</th><th>Actions</th>
                  </tr></thead>
                  <tbody>
                    {filteredInquiries.length === 0 ? (
                      <tr><td colSpan={6} style={{ textAlign: 'center', padding: '2.5rem', color: '#475569' }}>No inquiries found</td></tr>
                    ) : filteredInquiries.map(inq => (
                      <tr key={inq.id}>
                        <td style={{ color: '#ecfdf5', fontWeight: 500 }}>{inq.name}</td>
                        <td>{inq.email}</td>
                        <td>{inq.company || '—'}</td>
                        <td>
                          <span className={`badge ${inq.is_reviewed ? 'badge-green' : 'badge-amber'}`}>
                            {inq.is_reviewed ? <><CheckCircle style={{ width: '0.65rem', height: '0.65rem' }} /> Reviewed</> : <><Clock style={{ width: '0.65rem', height: '0.65rem' }} /> Pending</>}
                          </span>
                        </td>
                        <td>{inq.submitted_at ? new Date(inq.submitted_at).toLocaleDateString() : '—'}</td>
                        <td>
                          <div style={{ display: 'flex', gap: '0.4rem' }}>
                            <button onClick={() => setInquiryModal(inq)} className="btn-ghost" style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}><Eye style={{ width: '0.8rem', height: '0.8rem' }} /></button>
                            <button onClick={() => toggleReview(inq.id)} className={inq.is_reviewed ? 'btn-warning' : 'btn-success'} style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}>
                              {inq.is_reviewed ? <><Clock style={{ width: '0.8rem', height: '0.8rem' }} /> Undo</> : <><CheckCircle style={{ width: '0.8rem', height: '0.8rem' }} /> Mark</>}
                            </button>
                            <button onClick={() => del('inquiries', inq.id, 'inquiry')} className="btn-danger" style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}><Trash2 style={{ width: '0.8rem', height: '0.8rem' }} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── Generic CRUD Tabs ── */}
        {[
          { tab: 'Blogs',        data: blogs,        endpoint: 'blogs',        label: 'Blog',        cols: ['title','excerpt'], type: 'Blog' },
          { tab: 'Case Studies', data: cases,        endpoint: 'case-studies', label: 'Case Study',  cols: ['title','summary'], type: 'Case Study' },
          { tab: 'Testimonials', data: testimonials, endpoint: 'testimonials', label: 'Testimonial', cols: ['client_name','organisation'], type: 'Testimonial' },
          { tab: 'Events',       data: events,       endpoint: 'events',       label: 'Event',       cols: ['title','date'], type: 'Event' },
        ].map(({ tab, data, endpoint, label, cols, type }) => activeTab === tab && (
          <div key={tab}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.25rem' }}>
              <button onClick={() => setFormModal({ type, item: null })} className="btn-primary" style={{ fontSize: '0.85rem', padding: '0.6rem 1.1rem' }}>
                <Plus style={{ width: '0.9rem', height: '0.9rem' }} /> Add {label}
              </button>
            </div>
            <div className="card" style={{ overflow: 'hidden' }}>
              <div style={{ overflowX: 'auto' }}>
                <table className="as-table">
                  <thead><tr>
                    {cols.map(c => <th key={c} style={{ textTransform: 'capitalize' }}>{c.replace('_',' ')}</th>)}
                    <th>Actions</th>
                  </tr></thead>
                  <tbody>
                    {data.length === 0 ? (
                      <tr><td colSpan={cols.length + 1} style={{ textAlign: 'center', padding: '2.5rem', color: '#475569' }}>No {label.toLowerCase()}s yet</td></tr>
                    ) : data.map(item => (
                      <tr key={item.id}>
                        {cols.map(c => (
                          <td key={c} style={c === cols[0] ? { color: '#ecfdf5', fontWeight: 500 } : {}}>
                            {c === 'stars' ? '★'.repeat(item[c] || 5) : (item[c] ? String(item[c]).slice(0, 60) + (String(item[c]).length > 60 ? '…' : '') : '—')}
                          </td>
                        ))}
                        <td>
                          <div style={{ display: 'flex', gap: '0.4rem' }}>
                            <button onClick={() => setFormModal({ type, item })} className="btn-ghost" style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}><PenLine style={{ width: '0.8rem', height: '0.8rem' }} /></button>
                            <button onClick={() => del(endpoint, item.id, label)} className="btn-danger" style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}><Trash2 style={{ width: '0.8rem', height: '0.8rem' }} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modals */}
      {inquiryModal && <InquiryModal inquiry={inquiryModal} onClose={() => setInquiryModal(null)} />}
      {formModal    && <FormModal {...formModal} token={token} onClose={() => setFormModal(null)} onSaved={loadAll} showToast={showToast} />}
      {confirm      && <ConfirmModal message={confirm.message} onConfirm={confirm.onConfirm} onCancel={() => setConfirm(null)} />}
      {toast        && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}

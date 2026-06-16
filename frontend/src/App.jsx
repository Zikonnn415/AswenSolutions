import { BrowserRouter, Routes, Route, NavLink, Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Menu, X, Zap } from 'lucide-react'

import Home          from './pages/Home.jsx'
import Services      from './pages/Services.jsx'
import CaseStudies   from './pages/CaseStudies.jsx'
import CaseStudyDetail from './pages/CaseStudyDetail.jsx'
import Testimonials  from './pages/Testimonials.jsx'
import Blog          from './pages/Blog.jsx'
import BlogPost      from './pages/BlogPost.jsx'
import Events        from './pages/Events.jsx'
import EventDetail   from './pages/EventDetail.jsx'
import Contact       from './pages/Contact.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import ChatBot       from './components/ChatBot.jsx'
import nobglogo from './images/nobglogo.png'

const API = 'http://127.0.0.1:8000/api'

/* ── Logo ───────────────────────────────────────────────────────── */
function Logo({ compact = false }) {
  const logoImg = (
    <img src={nobglogo} alt="AswenSolutions logo" className="w-full h-full object-contain" style={{ filter: 'drop-shadow(0 12px 30px rgba(0,0,0,0.5))' }} />
  )

  if (compact) {
    return (
      <Link to="/" className="flex items-center group" style={{ textDecoration: 'none' }}>
        <div className="relative rounded flex-shrink-0" style={{ width: 'clamp(56px,9vw,120px)', height: 'clamp(40px,7vw,80px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {logoImg}
        </div>
      </Link>
    )
  }

  return (
    <Link to="/" className="flex items-center gap-2 group" style={{ textDecoration: 'none' }}>
      <div className="relative rounded flex items-center justify-center flex-shrink-0"
           style={{ width: 'clamp(72px,10vw,140px)', height: 'clamp(72px,10vw,140px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {logoImg}
      </div>
      <div className="flex flex-col leading-none">
        <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 800, fontSize: 'clamp(1.1rem,2.6vw,1.6rem)', letterSpacing: '-0.02em', color: '#ecfdf5' }}>
          Aswen<span style={{ color: '#34d399' }}>Solutions</span>
        </span>
        <span style={{ fontSize: 'clamp(0.65rem,1.8vw,0.9rem)', fontWeight: 600, letterSpacing: '0.12em', color: '#10b981', textTransform: 'uppercase' }}>
          Enterprise AI
        </span>
      </div>
    </Link>
  )
}

/* ── Navbar ─────────────────────────────────────────────────────── */
function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [isAdmin, setIsAdmin] = useState(Boolean(localStorage.getItem('nn_token')))
  const location = useLocation()

  useEffect(() => {
    setOpen(false)
  }, [location])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const sync = () => setIsAdmin(Boolean(localStorage.getItem('nn_token')))
    window.addEventListener('storage', sync)
    window.addEventListener('focus', sync)
    sync()
    return () => { window.removeEventListener('storage', sync); window.removeEventListener('focus', sync) }
  }, [])

  const navItems = [
    { to: '/',            label: 'Home' },
    { to: '/services',    label: 'Services' },
    { to: '/case-studies',label: 'Case Studies' },
    { to: '/testimonials',label: 'Testimonials' },
    { to: '/blog',        label: 'Blog' },
    { to: '/events',      label: 'Events' },
    { to: '/contact',     label: 'Contact' },
  ]

  return (
    <nav className={`nav-root${scrolled ? ' nav-root-scrolled' : ''}`}>
      <div className="page-wrap">
        <div className="nav-shell">
          <Logo compact />

          {/* Desktop links */}
          <div className="nav-links-wrap">
            {navItems.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
              >
                {label}
              </NavLink>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="nav-cta-wrap">
            {isAdmin ? (
              <Link to="/admin" className="nav-cta">
                Dashboard
              </Link>
            ) : (
              <Link to="/contact" className="nav-cta">
                Get Started
              </Link>
            )}
          </div>

          {/* Mobile burger */}
          <button
            onClick={() => setOpen(!open)}
            className="nav-menu-btn"
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="mobile-nav-panel">
          <div className="page-wrap">
            <div className="mobile-nav-card">
            {navItems.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
              >
                {label}
              </NavLink>
            ))}
            <div className="mobile-nav-cta">
              {isAdmin ? (
                <Link to="/admin" className="nav-cta">Dashboard</Link>
              ) : (
                <Link to="/contact" className="nav-cta">Get Started</Link>
              )}
            </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

/* ── Footer ─────────────────────────────────────────────────────── */
function Footer() {
  return (
    <footer style={{ borderTop: '1px solid rgba(16,185,129,0.1)', background: 'rgba(8,13,26,0.9)', marginTop: '4rem' }}>
      <div className="page-wrap py-10">
        <div className="grid-2 gap-8 mb-8">
          <div>
            <Logo />
            <p style={{ color: '#475569', fontSize: '0.875rem', lineHeight: 1.7, marginTop: '1rem', maxWidth: '26rem' }}>
              Building intelligent, scalable AI systems for forward-thinking businesses. From rapid prototypes to enterprise deployments.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-6" style={{ gridTemplateColumns: '1fr 1fr' }}>
            <div>
              <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#10b981', marginBottom: '0.85rem' }}>Company</p>
              {[['/', 'Home'], ['/services', 'Services'], ['/case-studies', 'Case Studies'], ['/blog', 'Blog']].map(([to, label]) => (
                <Link key={to} to={to} style={{ display: 'block', color: '#475569', fontSize: '0.875rem', marginBottom: '0.5rem', textDecoration: 'none', transition: 'color 0.2s' }}
                      onMouseEnter={e => e.target.style.color = '#34d399'}
                      onMouseLeave={e => e.target.style.color = '#475569'}>{label}</Link>
              ))}
            </div>
            <div>
              <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#10b981', marginBottom: '0.85rem' }}>Connect</p>
              {[['/testimonials', 'Testimonials'], ['/events', 'Events'], ['/contact', 'Contact Us']].map(([to, label]) => (
                <Link key={to} to={to} style={{ display: 'block', color: '#475569', fontSize: '0.875rem', marginBottom: '0.5rem', textDecoration: 'none', transition: 'color 0.2s' }}
                      onMouseEnter={e => e.target.style.color = '#34d399'}
                      onMouseLeave={e => e.target.style.color = '#475569'}>{label}</Link>
              ))}
            </div>
          </div>
        </div>
        <div className="divider" />
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-6">
          <p style={{ color: '#334155', fontSize: '0.8rem' }}>
            © {new Date().getFullYear()} AswenSolutions. All rights reserved.
          </p>
          <p style={{ color: '#334155', fontSize: '0.8rem' }}>
            Built with ❤ in Kathmandu, Nepal
          </p>
        </div>
      </div>
    </footer>
  )
}

/* ── App ────────────────────────────────────────────────────────── */
export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main>
        <Routes>
          <Route path="/"              element={<Home />} />
          <Route path="/services"      element={<Services />} />
          <Route path="/case-studies"  element={<CaseStudies />} />
          <Route path="/case-studies/:id" element={<CaseStudyDetail />} />
          <Route path="/testimonials"  element={<Testimonials />} />
          <Route path="/blog"          element={<Blog />} />
          <Route path="/blog/:id"      element={<BlogPost />} />
          <Route path="/events"        element={<Events />} />
          <Route path="/events/:id"    element={<EventDetail />} />
          <Route path="/contact"       element={<Contact />} />
          <Route path="/admin"         element={<AdminDashboard />} />
          <Route path="*"              element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <ChatBot />
    </BrowserRouter>
  )
}

function NotFound() {
  return (
    <div className="page-shell" style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem' }}>
      <p style={{ fontSize: '6rem', fontFamily: "'Space Grotesk',sans-serif", fontWeight: 800, color: 'rgba(16,185,129,0.15)', lineHeight: 1 }}>404</p>
      <h1 className="display-lg" style={{ marginTop: '-1rem', marginBottom: '1rem' }}>Page Not Found</h1>
      <p style={{ color: '#64748b', marginBottom: '2rem' }}>The page you're looking for doesn't exist or has been moved.</p>
      <Link to="/" className="btn-primary">Back to Home</Link>
    </div>
  )
}

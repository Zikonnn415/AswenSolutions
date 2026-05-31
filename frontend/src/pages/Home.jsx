import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import {
  Rocket, Bot, LineChart, Building2, Hotel, Hospital,
  ShoppingCart, Landmark, Factory, MapPin, Phone, Mail,
  Globe2, ArrowRight, Sparkles, Zap, Shield, CheckCircle2,
  TrendingUp, Users, Award, ChevronRight
} from 'lucide-react'

const API = 'http://127.0.0.1:8000/api'

export default function Home() {
  const [stats, setStats] = useState(null)
  const [isAdmin, setIsAdmin] = useState(Boolean(localStorage.getItem('nn_token')))

  useEffect(() => {
    fetch(`${API}/analytics/`).then(r => r.json()).then(setStats).catch(() => {})
  }, [])

  useEffect(() => {
    const sync = () => setIsAdmin(Boolean(localStorage.getItem('nn_token')))
    window.addEventListener('storage', sync)
    window.addEventListener('focus', sync)
    sync()
    return () => { window.removeEventListener('storage', sync); window.removeEventListener('focus', sync) }
  }, [])

  const features = [
    {
      icon: Rocket, color: '#34d399',
      title: 'Rapid AI Prototyping',
      description: 'Validate AI concepts in days with real-world data and business-ready prototypes.',
      benefits: ['Faster time-to-market', 'Reduced development risk', 'Early stakeholder buy-in'],
    },
    {
      icon: Bot, color: '#22d3ee',
      title: 'Intelligent Virtual Assistant',
      description: 'Context-aware AI assistants that understand your business and serve users 24/7.',
      benefits: ['Always-on availability', 'Multilingual support', 'Seamless integrations'],
    },
    {
      icon: LineChart, color: '#fbbf24',
      title: 'Enterprise-Scale AI',
      description: 'From startup MVP to enterprise-grade systems — scalable, secure, and future-proof.',
      benefits: ['Cloud-native architecture', 'Auto-scaling infra', 'SOC 2 ready security'],
    },
  ]

  const industries = [
    { name: 'Banking & Finance',    icon: Building2,    desc: 'Fraud detection, risk assessment, automated underwriting' },
    { name: 'Tourism & Hospitality',icon: Hotel,         desc: 'Personalised itineraries, demand forecasting, booking AI' },
    { name: 'Healthcare',           icon: Hospital,      desc: 'Medical imaging, patient monitoring, clinical decision support' },
    { name: 'Retail & E-Commerce',  icon: ShoppingCart,  desc: 'Inventory optimisation, recommendation engines, analytics' },
    { name: 'Government',           icon: Landmark,      desc: 'Citizen services, document processing, policy analysis' },
    { name: 'Manufacturing',        icon: Factory,       desc: 'Quality control, predictive maintenance, supply chain AI' },
  ]

  const differentiators = [
    { icon: Globe2,  color: '#34d399', title: 'Local Expertise, Global Standards', desc: 'Deep knowledge of Nepal\'s business landscape with international-quality delivery.' },
    { icon: Award,   color: '#22d3ee', title: 'Proven Track Record',               desc: 'Successful deployments across banking, tourism, retail, healthcare, and government.' },
    { icon: Zap,     color: '#fbbf24', title: 'Rapid & Transparent',               desc: 'Fast prototyping, clear communication, and measurable business outcomes every time.' },
    { icon: Shield,  color: '#34d399', title: 'Enterprise Security',               desc: 'Production-hardened systems with token auth, rate limiting, and full audit trails.' },
  ]

  return (
    <div className="page-shell">

      {/* ── Hero ───────────────────────────────────────────────── */}
      <section className="hero-mesh" style={{ padding: 'clamp(3rem, 7vw, 5rem) 0 clamp(2.5rem, 5vw, 4rem)' }}>
        <div className="page-wrap">
          <div style={{ maxWidth: '52rem', margin: '0 auto', textAlign: 'center' }}>

            <h1 className="display-xl animate-fade-up" style={{ animationDelay: '0.06s', marginBottom: 'clamp(0.8rem, 2vw, 1.25rem)', fontSize: 'clamp(2.2rem, 6vw, 4.5rem)' }}>
              AswenSolutions
            </h1>
            <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 'clamp(1rem, 2.5vw, 1.4rem)', color: '#64748b', fontWeight: 500, letterSpacing: '-0.01em' }} className="animate-fade-up">
              Kathmandu
            </p>
            <p style={{ color: '#64748b', fontSize: 'clamp(0.95rem, 1.5vw, 1.05rem)', lineHeight: 1.75, maxWidth: '36rem', margin: 'clamp(1rem, 3vw, 1.5rem) auto clamp(1.5rem, 4vw, 2.5rem)', }} className="animate-fade-up">
              We build practical, powerful AI products for businesses — from rapid prototypes to enterprise-scale systems that deliver real results.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center animate-fade-up">
              <Link to="/contact" className="btn-primary">
                Start Your AI Journey <ArrowRight style={{ width: '1rem', height: '1rem' }} />
              </Link>
              <Link to="/case-studies" className="btn-outline">
                Explore Our Work
              </Link>
            </div>
          </div>

          {/* Floating badges */}
          <div className="hidden lg:flex justify-center gap-5 mt-12 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            {[
              { icon: CheckCircle2, label: 'Trusted Delivery', color: '#34d399' },
              { icon: TrendingUp,   label: 'Measurable ROI',   color: '#22d3ee' },
              { icon: Users,        label: '100+ Clients',     color: '#fbbf24' },
            ].map(({ icon: Icon, label, color }, i) => (
              <div key={i} className="card-glass flex items-center gap-2.5 animate-float"
                   style={{ padding: '0.6rem 1.1rem', animationDelay: `${i * 0.8}s` }}>
                <Icon style={{ width: '0.9rem', height: '0.9rem', color }} />
                <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#94a3b8' }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ──────────────────────────────────────────────── */}
      {stats && (
        <section style={{ padding: 'clamp(2rem, 5vw, 3rem) 0' }}>
          <div className="page-wrap">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 stagger">
              {[
                { value: stats.case_studies, label: 'Case Studies',      icon: Award },
                { value: '100+',             label: 'Happy Clients',     icon: Users },
                { value: stats.blogs,        label: 'Articles Published',icon: TrendingUp },
                { value: '5+',               label: 'Years Experience',  icon: Sparkles },
              ].map(({ value, label, icon: Icon }, i) => (
                <div key={i} className="card-stat">
                  <Icon style={{ width: '1.1rem', height: '1.1rem', color: '#10b981', margin: '0 auto 0.5rem' }} />
                  <div style={{
                    fontFamily: "'Space Grotesk',sans-serif",
                    fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.03em',
                    background: 'linear-gradient(135deg,#34d399,#22d3ee)',
                    WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent',
                    lineHeight: 1.1, marginBottom: '0.3rem'
                  }}>{value}</div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <div className="divider" style={{ margin: '0 2rem' }} />

      {/* ── Core Services ──────────────────────────────────────── */}
      <section style={{ padding: 'clamp(3rem, 7vw, 5rem) 0' }}>
        <div className="page-wrap">
          <div style={{ textAlign: 'center', marginBottom: 'clamp(2rem, 4vw, 3rem)' }}>
            <div className="section-label" style={{ justifyContent: 'center' }}>Our Capabilities</div>
            <h2 className="display-lg" style={{ marginBottom: 'clamp(0.5rem, 1.5vw, 0.75rem)', fontSize: 'clamp(1.6rem, 3.5vw, 2.75rem)' }}>Why Choose AswenSolutions?</h2>
            <p style={{ color: '#64748b', maxWidth: '32rem', margin: '0 auto', lineHeight: 1.7, fontSize: 'clamp(0.95rem, 1.5vw, 1.05rem)' }}>
              We combine deep local knowledge with global AI standards to deliver solutions that actually work.
            </p>
          </div>

          <div className="grid-3 stagger">
            {features.map(({ icon: Icon, color, title, description, benefits }, i) => (
              <div key={i} className="card" style={{ padding: '2rem' }}>
                <div className="icon-wrap" style={{ width: '3rem', height: '3rem', marginBottom: '1.25rem' }}>
                  <Icon style={{ width: '1.3rem', height: '1.3rem', color }} />
                </div>
                <h3 className="display-md" style={{ fontSize: '1.1rem', marginBottom: '0.6rem' }}>{title}</h3>
                <p style={{ color: '#475569', fontSize: '0.875rem', lineHeight: 1.7, marginBottom: '1.25rem' }}>{description}</p>
                <ul style={{ listStyle: 'none' }}>
                  {benefits.map((b, j) => (
                    <li key={j} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#64748b', marginBottom: '0.4rem' }}>
                      <ChevronRight style={{ width: '0.85rem', height: '0.85rem', color: '#10b981', flexShrink: 0 }} />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Industries ─────────────────────────────────────────── */}
      <section style={{ padding: 'clamp(3rem, 7vw, 5rem) 0', background: 'rgba(12,19,34,0.5)' }}>
        <div className="page-wrap">
          <div style={{ textAlign: 'center', marginBottom: 'clamp(2rem, 4vw, 3rem)' }}>
            <div className="section-label" style={{ justifyContent: 'center' }}>Verticals</div>
            <h2 className="display-lg" style={{ marginBottom: 'clamp(0.5rem, 1.5vw, 0.75rem)', fontSize: 'clamp(1.6rem, 3.5vw, 2.75rem)' }}>Industries We Serve</h2>
            <p style={{ color: '#64748b', maxWidth: '32rem', margin: '0 auto', lineHeight: 1.7, fontSize: 'clamp(0.95rem, 1.5vw, 1.05rem)' }}>
              From traditional sectors to emerging markets — we understand the unique AI opportunities in every vertical.
            </p>
          </div>
          <div className="grid-3 stagger">
            {industries.map(({ name, icon: Icon, desc }, i) => (
              <div key={i} className="card" style={{ padding: 'clamp(1.25rem, 3vw, 1.75rem)', display: 'flex', alignItems: 'flex-start', gap: 'clamp(0.75rem, 2vw, 1.25rem)' }}>
                <div className="icon-wrap" style={{ width: 'clamp(2.25rem, 4vw, 2.75rem)', height: 'clamp(2.25rem, 4vw, 2.75rem)', flexShrink: 0 }}>
                  <Icon style={{ width: '1rem', height: '1rem', color: '#10b981' }} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 'clamp(0.9rem, 1.5vw, 0.95rem)', color: '#ecfdf5', marginBottom: '0.3rem' }}>{name}</h3>
                  <p style={{ color: '#475569', fontSize: 'clamp(0.75rem, 1.3vw, 0.8rem)', lineHeight: 1.6 }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ─────────────────────────────────────────── */}
      <section style={{ padding: 'clamp(3rem, 7vw, 5rem) 0' }}>
        <div className="page-wrap">
          <div className="card-elevated" style={{ padding: 'clamp(2rem, 6vw, 3.5rem)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            <div style={{
              position: 'absolute', inset: 0, pointerEvents: 'none',
              background: 'radial-gradient(ellipse 60% 70% at 50% 0%, rgba(16,185,129,0.12), transparent 70%)'
            }} />
            <div className="label-tag" style={{ justifyContent: 'center', marginBottom: 'clamp(0.8rem, 2vw, 1.25rem)' }}>
              <Zap style={{ width: '0.8rem', height: '0.8rem' }} /> Ready to Transform?
            </div>
            <h2 className="display-lg" style={{ marginBottom: 'clamp(0.75rem, 2vw, 1.25rem)', fontSize: 'clamp(1.6rem, 3.5vw, 2.75rem)' }}>Ready to Transform with AI?</h2>
            <p style={{ color: '#64748b', maxWidth: '28rem', margin: '0 auto clamp(1.25rem, 3vw, 2rem)', lineHeight: 1.7, fontSize: 'clamp(0.95rem, 1.5vw, 1.05rem)' }}>
              Join the growing network of businesses leveraging AI for real competitive advantage.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to={isAdmin ? '/admin' : '/contact'} className="btn-primary">
                {isAdmin ? 'Go to Dashboard' : 'Get Started Today'} <ArrowRight style={{ width: '1rem', height: '1rem' }} />
              </Link>
              <Link to="/services" className="btn-outline">Explore Services</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Differentiators + Contact ───────────────────────────── */}
      <section style={{ padding: '0 0 clamp(3rem, 7vw, 5rem)' }}>
        <div className="page-wrap">
          <div className="grid-2" style={{ gap: 'clamp(1.5rem, 4vw, 3rem)', alignItems: 'start' }}>
            <div>
              <div className="section-label" style={{ marginBottom: '1rem' }}>Our Edge</div>
              <h2 className="display-lg" style={{ marginBottom: 'clamp(1.25rem, 3vw, 2rem)', fontSize: 'clamp(1.6rem, 3.5vw, 2.75rem)' }}>What Sets Us Apart</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(1.1rem, 2.5vw, 1.75rem)' }}>
                {differentiators.map(({ icon: Icon, color, title, desc }, i) => (
                  <div key={i} style={{ display: 'flex', gap: 'clamp(0.75rem, 2vw, 1.25rem)', alignItems: 'flex-start' }}>
                    <div className="icon-wrap-amber" style={{ width: 'clamp(2.25rem, 4vw, 2.75rem)', height: 'clamp(2.25rem, 4vw, 2.75rem)', minWidth: '2.25rem' }}>
                      <Icon style={{ width: '1rem', height: '1rem', color }} />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 'clamp(0.9rem, 1.5vw, 0.95rem)', color: '#ecfdf5', marginBottom: '0.25rem' }}>{title}</h3>
                      <p style={{ color: '#475569', fontSize: 'clamp(0.8rem, 1.3vw, 0.85rem)', lineHeight: 1.65 }}>{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card-glass" style={{ padding: 'clamp(1.5rem, 4vw, 2.5rem)' }}>
              <div className="section-label" style={{ marginBottom: '1rem' }}>Reach Out</div>
              <h3 className="display-md" style={{ fontSize: 'clamp(1.1rem, 2vw, 1.3rem)', marginBottom: 'clamp(1.25rem, 3vw, 1.75rem)' }}>Get in Touch</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(0.9rem, 2vw, 1.25rem)' }}>
                {[
                  { icon: MapPin, text: 'Hattisar, Kathmandu 44600, Nepal' },
                  { icon: Phone,  text: '+977-1-5551234' },
                  { icon: Mail,   text: 'hello@aswensolutions.com.np' },
                  { icon: Globe2, text: 'Serving Kathmandu Valley and beyond' },
                ].map(({ icon: Icon, text }, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 'clamp(0.65rem, 1.5vw, 0.95rem)' }}>
                    <div className="icon-wrap" style={{ width: 'clamp(2rem, 3vw, 2.25rem)', height: 'clamp(2rem, 3vw, 2.25rem)', minWidth: '2rem' }}>
                      <Icon style={{ width: '0.9rem', height: '0.9rem', color: '#10b981' }} />
                    </div>
                    <span style={{ color: '#64748b', fontSize: 'clamp(0.8rem, 1.3vw, 0.9rem)', wordBreak: 'break-word' }}>{text}</span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 'clamp(1.25rem, 3vw, 2rem)' }}>
                <Link to="/contact" className="btn-primary" style={{ width: '100%' }}>
                  Start a Conversation <ArrowRight style={{ width: '1rem', height: '1rem' }} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

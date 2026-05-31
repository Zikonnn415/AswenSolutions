import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import {
  Building2, Hospital, Hotel, ShoppingCart, Landmark, Factory,
  Code, Cpu, Brain, Database, Cloud, Shield, Workflow, BarChart3,
  Cog, Server, Camera, Bot, Rocket, ArrowRight, Sparkles
} from 'lucide-react'

const API = 'http://127.0.0.1:8000/api'

const iconMap = {
  ai: Brain, ml: Brain, machine_learning: Brain, llm: Bot, chat: Bot, chatbot: Bot, nlp: Bot,
  prototype: Code, prototyping: Code, dev: Code, development: Code, integration: Cog,
  automation: Workflow, rpa: Workflow, data: Database, analytics: BarChart3, analysis: BarChart3,
  cloud: Cloud, devops: Server, infrastructure: Server, security: Shield, vision: Camera, cv: Camera,
  cpu: Cpu, rocket: Rocket, strategy: Brain, consulting: Brain, assistant: Bot, virtual_assistant: Bot,
}
const emojiMap = { '🤖': Bot, '🚀': Rocket, '📈': BarChart3, '🧠': Brain, '🛠️': Cog, '⚙️': Cog, '☁️': Cloud, '🔒': Shield, '📦': Server, '🖼️': Camera, '💾': Database }

function resolveIcon(raw, title) {
  if (raw && emojiMap[raw]) return emojiMap[raw]
  if (raw) { const k = raw.toLowerCase().replace(/\s+/g, '_'); if (iconMap[k]) return iconMap[k] }
  if (!title) return null
  const t = title.toLowerCase()
  if (t.includes('automation') || t.includes('process')) return Workflow
  if (t.includes('data') || t.includes('analytics')) return Database
  if (t.includes('assistant')) return Bot
  if (t.includes('prototype')) return Code
  if (t.includes('vision') || t.includes('image')) return Camera
  return Brain
}

const steps = [
  { step: '01', title: 'Discovery & Analysis',  desc: 'Deep dive into your business goals, challenges, and technical landscape.' },
  { step: '02', title: 'Strategy & Roadmap',    desc: 'A tailored AI strategy with clear milestones, priorities, and ROI targets.' },
  { step: '03', title: 'Prototype & Validate',  desc: 'Rapid working prototypes to test ideas before committing to full build.' },
  { step: '04', title: 'Build & Integrate',     desc: 'Production-ready development with seamless integration into your stack.' },
  { step: '05', title: 'Test & Optimise',       desc: 'Rigorous QA, performance tuning, and edge-case hardening.' },
  { step: '06', title: 'Deploy & Support',      desc: 'Smooth launch with ongoing monitoring, updates, and dedicated support.' },
]

const industries = [
  { name: 'Banking',       icon: Building2,   items: ['Fraud Detection', 'Risk Assessment', 'Credit Scoring'] },
  { name: 'Healthcare',    icon: Hospital,     items: ['Medical Imaging', 'Patient Monitoring', 'Clinical AI'] },
  { name: 'Tourism',       icon: Hotel,        items: ['Recommendation Engine', 'Demand Forecasting', 'Chatbots'] },
  { name: 'Retail',        icon: ShoppingCart, items: ['Inventory AI', 'Customer Analytics', 'Price Engine'] },
  { name: 'Government',    icon: Landmark,     items: ['Citizen Services', 'Document Processing', 'Policy AI'] },
  { name: 'Manufacturing', icon: Factory,      items: ['Quality Control', 'Predictive Maintenance', 'Supply Chain'] },
]

export default function Services() {
  const [services, setServices] = useState([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    fetch(`${API}/services/`)
      .then(r => r.json())
      .then(d => setServices(d?.results || []))
      .catch(() => setServices([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="page-shell">
      {/* Hero */}
      <section className="hero-mesh" style={{ padding: 'clamp(3rem, 6vw, 4.5rem) 0 clamp(2.5rem, 4vw, 3.5rem)' }}>
        <div className="page-wrap" style={{ textAlign: 'center' }}>
          <div className="label-tag" style={{ marginBottom: 'clamp(0.9rem, 2vw, 1.25rem)', justifyContent: 'center' }}>
            <Sparkles style={{ width: '0.8rem', height: '0.8rem' }} /> What We Offer
          </div>
          <h1 className="display-xl" style={{ marginBottom: 'clamp(0.8rem, 2vw, 1.25rem)', fontSize: 'clamp(2.2rem, 6vw, 4.5rem)' }}>Our AI Services</h1>
          <p style={{ color: '#64748b', maxWidth: '32rem', margin: '0 auto clamp(1.25rem, 3vw, 2rem)', lineHeight: 1.75, fontSize: 'clamp(0.95rem, 1.5vw, 1.05rem)' }}>
            End-to-end AI solutions from strategy to production — built for real business outcomes.
          </p>
          <Link to="/contact" className="btn-primary">
            Get a Free Consultation <ArrowRight style={{ width: '1rem', height: '1rem' }} />
          </Link>
        </div>
      </section>

      {/* Service Cards */}
      <section style={{ padding: 'clamp(3rem, 7vw, 5rem) 0' }}>
        <div className="page-wrap">
          <div className="section-label" style={{ justifyContent: 'center', marginBottom: 'clamp(1.5rem, 4vw, 2.5rem)' }}>Core Services</div>
          {loading ? (
            <div style={{ textAlign: 'center', padding: 'clamp(2rem, 5vw, 4rem)', color: '#475569' }}>
              <div className="spinner" style={{ width: '1.5rem', height: '1.5rem', margin: '0 auto 1rem' }} />
              <p>Loading services…</p>
            </div>
          ) : services.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 'clamp(2rem, 5vw, 4rem)' }}>
              <p style={{ color: '#475569' }}>No services listed yet. Check back soon.</p>
            </div>
          ) : (
            <div className="grid-3 stagger">
              {services.map((svc, i) => {
                const Icon = resolveIcon(svc.icon, svc.title) || Brain
                return (
                  <div key={i} className="card" style={{ padding: 'clamp(1.25rem, 3vw, 2rem)', display: 'flex', flexDirection: 'column' }}>
                    <div className="icon-wrap" style={{ width: 'clamp(2.5rem, 4vw, 3rem)', height: 'clamp(2.5rem, 4vw, 3rem)', marginBottom: 'clamp(0.9rem, 2vw, 1.25rem)' }}>
                      <Icon style={{ width: '1.2rem', height: '1.2rem', color: '#10b981' }} />
                    </div>
                    <h3 className="display-md" style={{ fontSize: 'clamp(0.95rem, 1.8vw, 1.1rem)', marginBottom: '0.6rem' }}>{svc.title}</h3>
                    <p style={{ color: '#475569', fontSize: 'clamp(0.8rem, 1.3vw, 0.9rem)', lineHeight: 1.7, flex: 1 }}>{svc.description}</p>
                    {svc.price_label && (
                      <div style={{ marginTop: 'clamp(0.9rem, 2vw, 1.25rem)', paddingTop: '1rem', borderTop: '1px solid rgba(16,185,129,0.1)' }}>
                        <span className="badge badge-green">{svc.price_label}</span>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}

          {/* Fallback static cards if no DB services */}
          {!loading && services.length === 0 && (
            <div className="grid-3 stagger" style={{ marginTop: 'clamp(1.5rem, 3vw, 2rem)' }}>
              {[
                { Icon: Rocket,   title: 'AI Prototyping',        desc: 'Validate concepts fast with real data and working prototypes.' },
                { Icon: Bot,      title: 'Virtual Assistants',    desc: 'Smart chatbots and assistants trained on your business knowledge.' },
                { Icon: Brain,    title: 'ML Consulting',         desc: 'Expert guidance on ML strategy, data pipelines, and model ops.' },
                { Icon: BarChart3,title: 'Data Analytics',        desc: 'Turn raw data into actionable insights and forecasts.' },
                { Icon: Cloud,    title: 'Cloud AI Integration',  desc: 'Deploy AI into your existing cloud infrastructure seamlessly.' },
                { Icon: Shield,   title: 'AI Security & Audit',   desc: 'Assess, harden, and monitor your AI systems for production.' },
              ].map(({ Icon, title, desc }, i) => (
                <div key={i} className="card" style={{ padding: 'clamp(1.25rem, 3vw, 2rem)' }}>
                  <div className="icon-wrap" style={{ width: 'clamp(2.5rem, 4vw, 3rem)', height: 'clamp(2.5rem, 4vw, 3rem)', marginBottom: 'clamp(0.9rem, 2vw, 1.25rem)' }}>
                    <Icon style={{ width: '1.2rem', height: '1.2rem', color: '#10b981' }} />
                  </div>
                  <h3 className="display-md" style={{ fontSize: 'clamp(0.95rem, 1.8vw, 1.1rem)', marginBottom: '0.6rem' }}>{title}</h3>
                  <p style={{ color: '#475569', fontSize: 'clamp(0.8rem, 1.3vw, 0.9rem)', lineHeight: 1.7 }}>{desc}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <div className="divider" style={{ margin: '0 clamp(1rem, 3vw, 2rem)' }} />

      {/* Process */}
      <section style={{ padding: 'clamp(3rem, 7vw, 5rem) 0' }}>
        <div className="page-wrap">
          <div style={{ textAlign: 'center', marginBottom: 'clamp(2rem, 4vw, 3rem)' }}>
            <div className="section-label" style={{ justifyContent: 'center' }}>How We Work</div>
            <h2 className="display-lg" style={{ marginBottom: 'clamp(0.5rem, 1.5vw, 0.75rem)', fontSize: 'clamp(1.6rem, 3.5vw, 2.75rem)' }}>Our Delivery Process</h2>
            <p style={{ color: '#64748b', maxWidth: '30rem', margin: '0 auto', fontSize: 'clamp(0.95rem, 1.5vw, 1.05rem)' }}>
              A clear, repeatable process that takes you from idea to production without surprises.
            </p>
          </div>
          <div className="grid-2 stagger">
            {steps.map(({ step, title, desc }, i) => (
              <div key={i} className="card" style={{ padding: 'clamp(1.25rem, 3vw, 1.75rem)', display: 'flex', gap: 'clamp(0.9rem, 2vw, 1.25rem)', alignItems: 'flex-start' }}>
                <div className="step-num">{step}</div>
                <div style={{ minWidth: 0 }}>
                  <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 'clamp(0.95rem, 1.5vw, 1.05rem)', color: '#ecfdf5', marginBottom: '0.35rem' }}>{title}</h3>
                  <p style={{ color: '#475569', fontSize: 'clamp(0.8rem, 1.3vw, 0.85rem)', lineHeight: 1.65 }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries */}
      <section style={{ padding: '0 0 clamp(3rem, 7vw, 5rem)' }}>
        <div className="page-wrap">
          <div style={{ textAlign: 'center', marginBottom: 'clamp(2rem, 4vw, 3rem)' }}>
            <div className="section-label" style={{ justifyContent: 'center' }}>Verticals</div>
            <h2 className="display-lg" style={{ marginBottom: 'clamp(0.5rem, 1.5vw, 0.75rem)', fontSize: 'clamp(1.6rem, 3.5vw, 2.75rem)' }}>Industry Expertise</h2>
          </div>
          <div className="grid-3 stagger">
            {industries.map(({ name, icon: Icon, items }, i) => (
              <div key={i} className="card" style={{ padding: 'clamp(1.25rem, 3vw, 1.75rem)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(0.65rem, 1.5vw, 0.95rem)', marginBottom: 'clamp(0.75rem, 2vw, 1.25rem)' }}>
                  <div className="icon-wrap" style={{ width: 'clamp(2rem, 3vw, 2.5rem)', height: 'clamp(2rem, 3vw, 2.5rem)', minWidth: '2rem' }}>
                    <Icon style={{ width: '0.9rem', height: '0.9rem', color: '#10b981' }} />
                  </div>
                  <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 'clamp(0.9rem, 1.5vw, 0.95rem)', color: '#ecfdf5' }}>{name}</h3>
                </div>
                <ul style={{ listStyle: 'none' }}>
                  {items.map((item, j) => (
                    <li key={j} style={{ fontSize: 'clamp(0.75rem, 1.2vw, 0.82rem)', color: '#64748b', padding: '0.3rem 0', borderBottom: j < items.length - 1 ? '1px solid rgba(16,185,129,0.06)' : 'none' }}>
                      · {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '0 0 clamp(3rem, 7vw, 5rem)' }}>
        <div className="page-wrap">
          <div className="card-elevated" style={{ padding: 'clamp(2rem, 6vw, 3rem)', textAlign: 'center' }}>
            <h2 className="display-lg" style={{ marginBottom: 'clamp(0.5rem, 1.5vw, 0.75rem)', fontSize: 'clamp(1.6rem, 3.5vw, 2.75rem)' }}>Ready to Get Started?</h2>
            <p style={{ color: '#64748b', marginBottom: 'clamp(1.25rem, 3vw, 2rem)', fontSize: 'clamp(0.95rem, 1.5vw, 1.05rem)' }}>Tell us about your project and we'll respond within 24 hours.</p>
            <Link to="/contact" className="btn-primary">
              Contact Our Team <ArrowRight style={{ width: '1rem', height: '1rem' }} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

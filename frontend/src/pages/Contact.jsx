import { useState } from 'react'
import { MapPin, Phone, Mail, Clock, CheckCircle2, Send } from 'lucide-react'

const API = 'http://127.0.0.1:8000/api/inquiries/'

const contactInfo = [
  { icon: MapPin, label: 'Office', value: 'Hattisar, Kathmandu 44600, Nepal' },
  { icon: Phone, label: 'Phone', value: '+977-1-5551234' },
  { icon: Mail, label: 'Email', value: 'hello@aswensolutions.com.np' },
  { icon: Clock, label: 'Hours', value: 'Sun–Thu: 9 AM–6 PM · Fri: 9 AM–1 PM' },
]

/** Empty form state */
const INITIAL_FORM = {
  name: '',
  email: '',
  phone: '',
  company: '',
  country: '',
  job_title: '',
  job_details: '',
}

/** Validation message constants (exact copy per requirements) */
const MSG = {
  nameRequired: 'Full Name is required.',
  emailRequired: 'Email Address is required.',
  emailInvalid: 'Please enter a valid email address.',
  phoneRequired: 'Phone Number is required.',
  phoneInvalid: 'Please enter a valid phone number.',
  countryRequired: 'Country is required.',
  projectRequired: 'Project Description is required.',
}

/** Email format: local@domain.tld */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Phone: digits with optional +, spaces, dashes, parentheses (10–15 digits) */
const PHONE_REGEX = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/

function isValidPhone(value) {
  const digits = value.replace(/\D/g, '')
  return digits.length >= 10 && digits.length <= 15 && PHONE_REGEX.test(value.trim())
}

/**
 * Validates a single field and returns an error string (empty = valid).
 * Required fields are checked first; format rules apply only when value is present.
 */
function validateField(name, value) {
  const trimmed = typeof value === 'string' ? value.trim() : ''

  switch (name) {
    case 'name':
      if (!trimmed) return MSG.nameRequired
      return ''

    case 'email':
      if (!trimmed) return MSG.emailRequired
      if (!EMAIL_REGEX.test(trimmed)) return MSG.emailInvalid
      return ''

    case 'phone':
      if (!trimmed) return MSG.phoneRequired
      if (!isValidPhone(trimmed)) return MSG.phoneInvalid
      return ''

    case 'country':
      if (!trimmed) return MSG.countryRequired
      return ''

    case 'job_details':
      if (!trimmed) return MSG.projectRequired
      return ''

    default:
      return ''
  }
}

/**
 * Validates every required field and returns an errors object.
 * Keys match form field names; only fields with errors are included.
 */
function validateForm(form) {
  const errors = {}
  const requiredKeys = ['name', 'email', 'phone', 'country', 'job_details']

  for (const key of requiredKeys) {
    const message = validateField(key, form[key])
    if (message) errors[key] = message
  }

  return errors
}

export default function Contact() {
  const [form, setForm] = useState(INITIAL_FORM)
  const [errors, setErrors] = useState({})
  const [submitAttempted, setSubmitAttempted] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  /**
   * Re-validates one field and updates errors state.
   * Clears the error when input becomes valid (requirement #3).
   */
  const updateFieldError = (fieldName, nextForm) => {
    const message = validateField(fieldName, nextForm[fieldName])
    setErrors((prev) => {
      const next = { ...prev }
      if (message) next[fieldName] = message
      else delete next[fieldName]
      return next
    })
  }

  /** On change: update form value and re-validate if user already tried to submit */
  const onChange = (e) => {
    const { name, value } = e.target
    const nextForm = { ...form, [name]: value }
    setForm(nextForm)

    // After first submit attempt, re-validate on every change so errors clear when fixed
    if (submitAttempted) {
      updateFieldError(name, nextForm)
    }
  }

  /**
   * On submit: validate all required fields, show errors immediately,
   * and block API call until the form is valid (requirements #2, #7).
   */
  const onSubmit = async (e) => {
    e.preventDefault()
    setSubmitAttempted(true)
    setSubmitStatus(null)

    const validationErrors = validateForm(form)
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length > 0) return

    setSubmitting(true)
    try {
      const res = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const d = await res.json()
        throw new Error(d.detail || 'Failed')
      }
      setSubmitStatus('success')
      setForm(INITIAL_FORM)
      setErrors({})
      setSubmitAttempted(false)
    } catch {
      setSubmitStatus('error')
    } finally {
      setSubmitting(false)
    }
  }

  /** Show inline error only after the user has clicked Submit */
  const showError = (fieldName) => submitAttempted && errors[fieldName]

  const textFields = [
    { key: 'name', label: 'Full Name', required: true, type: 'text', placeholder: 'e.g. Sita Sharma' },
    { key: 'email', label: 'Email Address', required: true, type: 'email', placeholder: 'e.g. sita@company.com' },
    { key: 'phone', label: 'Phone Number', required: true, type: 'tel', placeholder: 'e.g. +977 98XXXXXXXX' },
    { key: 'company', label: 'Company Name', required: false, type: 'text', placeholder: 'Your organisation' },
    { key: 'country', label: 'Country', required: true, type: 'text', placeholder: 'e.g. Nepal' },
    { key: 'job_title', label: 'Job Title', required: false, type: 'text', placeholder: 'e.g. CTO' },
  ]

  return (
    <div className="page-shell">
      <section className="hero-mesh" style={{ padding: 'clamp(3rem, 6vw, 4rem) 0 clamp(2rem, 4vw, 3rem)', textAlign: 'center' }}>
        <div className="page-wrap">
          <div className="label-tag" style={{ justifyContent: 'center', marginBottom: 'clamp(0.8rem, 2vw, 1.2rem)' }}>
            <Mail style={{ width: '0.8rem', height: '0.8rem' }} /> Get in Touch
          </div>
          <h1 className="display-xl" style={{ marginBottom: 'clamp(0.8rem, 2vw, 1.2rem)', fontSize: 'clamp(1.8rem, 5vw, 3.5rem)' }}>
            Let's Build Something Together
          </h1>
          <p style={{ color: '#64748b', maxWidth: '30rem', margin: '0 auto', lineHeight: 1.75, fontSize: 'clamp(0.95rem, 1.5vw, 1.05rem)' }}>
            Tell us about your project and we'll get back to you within 24 hours with a personalised plan.
          </p>
        </div>
      </section>

      <section style={{ padding: 'clamp(3rem, 8vw, 4rem) 0 clamp(4rem, 10vw, 6rem)' }}>
        <div className="page-wrap">
          <div className="grid-2" style={{ gap: 'clamp(1.5rem, 4vw, 2.5rem)', alignItems: 'start' }}>

            <div className="card" style={{ padding: 'clamp(1.5rem, 5vw, 2.5rem)' }}>
              <div className="section-label" style={{ marginBottom: '1.25rem' }}>Send a Message</div>
              <h2 className="display-md" style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.3rem)', marginBottom: 'clamp(1.25rem, 3vw, 2rem)' }}>
                Your Project Details
              </h2>

              {submitStatus === 'success' && (
                <div className="alert-success" style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '1.5rem' }}>
                  <CheckCircle2 style={{ width: '1.1rem', height: '1.1rem', color: '#34d399', flexShrink: 0, marginTop: '0.05rem' }} />
                  <span>Your inquiry has been received! We'll respond within 24 hours.</span>
                </div>
              )}
              {submitStatus === 'error' && (
                <div className="alert-error" style={{ marginBottom: '1.5rem' }}>
                  Submission failed. Please try again or email us directly.
                </div>
              )}

              <form onSubmit={onSubmit} noValidate>
                <div className="grid-form" style={{ marginBottom: '1rem' }}>
                  {textFields.map(({ key, label, required, type, placeholder }) => {
                    const hasError = showError(key)
                    const inputId = `contact-${key}`
                    const errorId = `${inputId}-error`

                    return (
                      <div key={key}>
                        <label className="form-label" htmlFor={inputId}>
                          {label}
                          {required && <span className="form-required" aria-hidden="true"> *</span>}
                        </label>
                        <input
                          id={inputId}
                          className={`form-input${hasError ? ' is-invalid' : ''}`}
                          type={type}
                          name={key}
                          value={form[key]}
                          onChange={onChange}
                          placeholder={placeholder}
                          aria-invalid={hasError ? 'true' : 'false'}
                          aria-describedby={hasError ? errorId : undefined}
                        />
                        {hasError && (
                          <p id={errorId} className="form-error" role="alert">
                            {errors[key]}
                          </p>
                        )}
                      </div>
                    )
                  })}
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label className="form-label" htmlFor="contact-job_details">
                    Project Description
                    <span className="form-required" aria-hidden="true"> *</span>
                  </label>
                  <textarea
                    id="contact-job_details"
                    className={`form-textarea${showError('job_details') ? ' is-invalid' : ''}`}
                    name="job_details"
                    value={form.job_details}
                    onChange={onChange}
                    placeholder="Tell us about your project, goals, and timeline…"
                    rows={5}
                    aria-invalid={showError('job_details') ? 'true' : 'false'}
                    aria-describedby={showError('job_details') ? 'contact-job_details-error' : undefined}
                  />
                  {showError('job_details') && (
                    <p id="contact-job_details-error" className="form-error" role="alert">
                      {errors.job_details}
                    </p>
                  )}
                </div>

                <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={submitting}>
                  {submitting ? (
                    <>
                      <div className="spinner" /> Sending…
                    </>
                  ) : (
                    <>
                      Send Message <Send style={{ width: '0.9rem', height: '0.9rem' }} />
                    </>
                  )}
                </button>
              </form>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(1rem, 2.5vw, 1.5rem)' }}>
              <div className="card-glass" style={{ padding: 'clamp(1.5rem, 4vw, 2rem)' }}>
                <div className="section-label" style={{ marginBottom: '1.25rem' }}>Contact Details</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(0.9rem, 2vw, 1.25rem)' }}>
                  {contactInfo.map(({ icon: Icon, label, value }, i) => (
                    <div key={i} style={{ display: 'flex', gap: 'clamp(0.75rem, 2vw, 1rem)', alignItems: 'flex-start' }}>
                      <div className="icon-wrap" style={{ width: 'clamp(2rem, 4vw, 2.5rem)', height: 'clamp(2rem, 4vw, 2.5rem)', minWidth: '2rem' }}>
                        <Icon style={{ width: '0.9rem', height: '0.9rem', color: '#10b981' }} />
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.1rem' }}>{label}</p>
                        <p style={{ fontSize: 'clamp(0.8rem, 1.5vw, 0.9rem)', color: '#94a3b8', wordBreak: 'break-word' }}>{value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card-glass" style={{ padding: 'clamp(1.5rem, 4vw, 2rem)' }}>
                <div className="section-label" style={{ marginBottom: '1rem' }}>Why Work With Us</div>
                {[
                  'Free initial consultation',
                  '24-hour response guarantee',
                  'Customised solution proposals',
                  'Dedicated project manager',
                  'Ongoing post-launch support',
                ].map((item, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      padding: '0.5rem 0',
                      borderBottom: i < 4 ? '1px solid rgba(16,185,129,0.06)' : 'none',
                    }}
                  >
                    <CheckCircle2 style={{ width: '0.85rem', height: '0.85rem', color: '#10b981', flexShrink: 0 }} />
                    <span style={{ fontSize: 'clamp(0.8rem, 1.5vw, 0.9rem)', color: '#64748b' }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

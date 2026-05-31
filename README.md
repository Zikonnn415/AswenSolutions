# AswenSolutions — Enterprise AI Platform

> A complete full-stack web application with React frontend and Django REST API backend.

---

## 🎨 Design Theme

| Attribute | AswenSolutions |
|-----------|---------------|
| Primary   | Emerald green `#10b981` / `#059669` |
| Secondary | Cyan `#06b6d4` |
| Accent    | Amber `#f59e0b` |
| Background| Navy dark `#080d1a` → `#0c1322` |
| Font (Headings) | Space Grotesk |
| Font (Body) | Manrope |
| Card style | Glass morphism with teal borders |
| Hero style | Radial gradient mesh, floating badges |

---

## 📁 Project Structure

```
AswenSolutions/
├── frontend/                 # React + Vite + Tailwind
│   ├── src/
│   │   ├── components/
│   │   │   └── ChatBot.jsx   # Floating AI chat widget
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Services.jsx
│   │   │   ├── CaseStudies.jsx
│   │   │   ├── CaseStudyDetail.jsx
│   │   │   ├── Testimonials.jsx
│   │   │   ├── Blog.jsx
│   │   │   ├── BlogPost.jsx
│   │   │   ├── Events.jsx
│   │   │   ├── EventDetail.jsx
│   │   │   ├── Contact.jsx
│   │   │   └── AdminDashboard.jsx
│   │   ├── App.jsx           # Router + Navbar + Footer
│   │   ├── main.jsx
│   │   └── index.css         # Complete design system
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
│
└── backend/                  # Django + DRF
    ├── config/
    │   ├── settings.py
    │   ├── urls.py
    │   └── wsgi.py
    ├── core/
    │   ├── models.py         # ContactRequest, Article, Project, Review, PromoEvent, Solution
    │   ├── serializers.py    # DRF serializers with field aliases
    │   ├── views.py          # All API views
    │   ├── urls.py           # URL routing
    │   ├── middleware.py     # Token→Bearer middleware
    │   ├── admin.py          # Django admin
    │   └── management/commands/seed_data.py
    ├── manage.py
    └── requirements.txt
```

---

## 🚀 Quick Start

### 1. Backend Setup

```bash
cd AswenSolutions/backend

# Create virtual environment
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Seed demo data (creates admin user + sample content)
python manage.py seed_data

# Start development server
python manage.py runserver
```

Backend runs at: **http://127.0.0.1:8000**

### 2. Frontend Setup

```bash
cd AswenSolutions/frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

Frontend runs at: **http://localhost:3000**

---

## 🔐 Admin Access

After running `seed_data`:

| Field    | Value   |
|----------|---------|
| Username | `admin` |
| Password | `admin123` |
| URL      | Navigate to `/admin` on the frontend |

---

## 🔌 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/login/` | Public | Get JWT token |
| GET | `/api/analytics/` | Public | Site statistics |
| GET | `/api/services/` | Public | List AI services |
| GET/POST | `/api/blogs/` | GET: Public, POST: Admin | Blog articles |
| GET/PUT/DELETE | `/api/blogs/<id>/` | GET: Public, else Admin | Article detail |
| GET/POST | `/api/case-studies/` | GET: Public, POST: Admin | Case studies |
| GET/PUT/DELETE | `/api/case-studies/<id>/` | GET: Public, else Admin | Project detail |
| GET/POST | `/api/testimonials/` | GET: Public, POST: Admin | Testimonials |
| GET/PUT/DELETE | `/api/testimonials/<id>/` | GET: Public, else Admin | Review detail |
| GET/POST | `/api/events/` | GET: Public, POST: Admin | Events |
| GET/PUT/DELETE | `/api/events/<id>/` | GET: Public, else Admin | Event detail |
| POST | `/api/inquiries/` | Public | Submit contact form |
| GET | `/api/inquiries/` | Admin | List all inquiries |
| DELETE | `/api/inquiries/<id>/` | Admin | Delete inquiry |
| PATCH | `/api/inquiries/<id>/toggle-review/` | Admin | Toggle reviewed status |
| POST | `/api/chat/` | Public | AI chatbot endpoint |

---

## 📄 Pages

| Route | Page |
|-------|------|
| `/` | Home — Hero, Stats, Services, Industries, CTA |
| `/services` | Services — Cards, Process steps, Industries |
| `/case-studies` | Case Studies — Filterable grid |
| `/case-studies/:id` | Case Study Detail |
| `/testimonials` | Testimonials — Rating cards |
| `/blog` | Blog — Searchable article grid |
| `/blog/:id` | Blog Post Detail |
| `/events` | Events — Upcoming & past |
| `/events/:id` | Event Detail |
| `/contact` | Contact Form |
| `/admin` | Admin Dashboard (login required) |

---

## 🛠 Tech Stack

**Frontend:** React 18 · React Router 6 · Vite · Tailwind CSS · Lucide React · Space Grotesk + Manrope fonts

**Backend:** Django 5 · Django REST Framework · SimpleJWT · django-cors-headers · SQLite

---

*Built with ❤ in Kathmandu, Nepal — AswenSolutions*

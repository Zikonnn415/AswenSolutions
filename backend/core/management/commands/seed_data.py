"""
Management command to seed AswenSolutions demo data.
Usage: python manage.py seed_data
"""
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from core.models import Article, Project, Review, PromoEvent, Solution

User = get_user_model()


class Command(BaseCommand):
    help = 'Seed AswenSolutions demo data'

    def handle(self, *args, **kwargs):
        self.stdout.write('🌱 Seeding AswenSolutions demo data…')

        # ── Superuser ──
        if not User.objects.filter(username='admin').exists():
            User.objects.create_superuser('admin', 'admin@aswensolutions.com.np', 'admin123')
            self.stdout.write('  ✓ Admin user created  (username: admin / password: admin123)')
        else:
            self.stdout.write('  · Admin user already exists')

        # ── Services ──
        services = [
            ('🚀', 'AI Rapid Prototyping',
             'We transform your idea into a working AI prototype in 2–4 weeks using real business data.',
             ['Concept validation', 'Data pipeline setup', 'Working demo', 'Stakeholder presentation'],
             '2–4 weeks', 'NPR 1,50,000'),
            ('🤖', 'Intelligent Virtual Assistant',
             'Custom AI chatbots and voice assistants trained on your knowledge base, available 24/7.',
             ['Multilingual support', 'CRM integration', 'Analytics dashboard', 'Ongoing training'],
             '4–6 weeks', 'NPR 2,00,000'),
            ('📊', 'Enterprise Data Analytics',
             'Turn your raw data into actionable insights with custom dashboards and ML-powered forecasting.',
             ['Data warehousing', 'ETL pipelines', 'Interactive dashboards', 'Predictive models'],
             '6–10 weeks', 'NPR 3,00,000'),
            ('🧠', 'ML Strategy Consulting',
             'Expert guidance on your AI roadmap, data strategy, and model operations.',
             ['Gap analysis', 'Roadmap design', 'Vendor selection', 'Team training'],
             '2–3 weeks', 'NPR 80,000'),
            ('☁️', 'Cloud AI Integration',
             'Deploy AI into your existing infrastructure on AWS, GCP, or Azure with full CI/CD.',
             ['Cloud architecture', 'Auto-scaling', 'Monitoring & alerts', 'Cost optimisation'],
             '4–8 weeks', 'NPR 2,50,000'),
            ('🔒', 'AI Security & Audit',
             'Assess, harden, and continuously monitor your AI systems for production readiness.',
             ['Security assessment', 'Compliance audit', 'Penetration testing', 'Remediation plan'],
             '2–4 weeks', 'NPR 1,20,000'),
        ]
        Solution.objects.all().delete()
        for icon, title, desc, features, timeline, price in services:
            Solution.objects.create(icon=icon, title=title, description=desc,
                                    feature_list=features, delivery_time=timeline, price_from=price)
        self.stdout.write(f'  ✓ {len(services)} services seeded')

        # ── Case Studies ──
        if Project.objects.count() < 3:
            projects = [
                ('AI-Powered Loan Risk Scoring — Nepal Bank',
                 'Reduced loan default rates by 34% using ML-based credit scoring.',
                 'Built a real-time credit risk model integrated into the bank\'s core banking system. The system analyses 120+ features including transaction history and behavioural patterns to produce a risk score in under 500ms.'),
                ('Smart Tourism Recommender — Visit Nepal Platform',
                 'Personalised itinerary recommendations boosted bookings by 28%.',
                 'Developed a collaborative-filtering recommendation engine that matches tourists with experiences based on preferences, budget, and travel history.'),
                ('Medical Image Analysis — Kathmandu Diagnostics',
                 'AI-assisted X-ray screening reduced radiologist review time by 60%.',
                 'Trained a CNN model on 50,000 labelled chest X-rays to flag potential abnormalities, integrated into the PACS system with a confidence overlay.'),
                ('Inventory Optimisation — Bhatbhateni Superstore',
                 'Reduced overstock by 22% and stockouts by 18% using demand forecasting.',
                 'Implemented a time-series demand forecasting system with seasonal decomposition, integrated with the ERP for automated purchase orders.'),
            ]
            for title, summary, desc in projects:
                Project.objects.create(title=title, summary=summary, description=desc)
            self.stdout.write(f'  ✓ {len(projects)} case studies seeded')

        # ── Reviews ──
        if Review.objects.count() < 3:
            reviews = [
                ('Rohan Shrestha', 'Nepal Investment Bank', 5, 'AswenSolutions delivered our credit-scoring AI ahead of schedule. The model accuracy exceeded our expectations, and the team\'s transparency throughout was outstanding.'),
                ('Priya Adhikari', 'Visit Nepal Tourism Board', 5, 'Our booking conversion improved by 28% within 3 months. The recommendation engine genuinely understands what travellers want. Truly impressed.'),
                ('Dr. Sushila Karki', 'Kathmandu Diagnostics Pvt.', 5, 'The medical imaging AI has transformed our radiology department. Radiologists now focus on complex cases while routine scans are pre-screened automatically.'),
                ('Bikash Tamang', 'Bhatbhateni Superstore', 4, 'Excellent demand forecasting solution. The team was responsive, and the integration with our ERP was seamless. Minor tweaks were needed post-launch but resolved quickly.'),
                ('Anjali Poudel', 'Nepal Telecom', 5, 'We engaged AswenSolutions for an AI strategy review. The roadmap they produced was actionable and has guided our digital transformation for the past year.'),
            ]
            for name, org, stars, feedback in reviews:
                Review.objects.create(client_name=name, organisation=org, stars=stars, feedback=feedback)
            self.stdout.write(f'  ✓ {len(reviews)} testimonials seeded')

        # ── Blog Articles ──
        if Article.objects.count() < 2:
            articles = [
                ('AI in Nepal\'s Banking Sector: Opportunities and Challenges',
                 'How Nepali banks are leveraging AI for fraud detection, credit scoring, and customer service.',
                 'Nepal\'s banking sector is undergoing a quiet revolution. With NRB pushing digital transformation and a growing pool of local AI talent, financial institutions are exploring machine learning for everything from AML compliance to hyper-personalised banking…'),
                ('Building Responsible AI for Emerging Markets',
                 'Ethical considerations and practical guidelines for deploying AI in developing economies.',
                 'As AI adoption accelerates across South Asia, organisations face unique challenges around data quality, infrastructure constraints, and regulatory uncertainty. This article explores the principles AswenSolutions follows to ensure our AI deployments are responsible, explainable, and genuinely beneficial…'),
                ('The ROI of AI: A Practical Guide for Nepali Businesses',
                 'How to measure and maximise the return on your AI investment.',
                 'One of the most common questions we hear from clients is: "What ROI can we realistically expect from AI?" The honest answer is — it depends. But in this guide, we\'ll break down how to frame the question, set meaningful KPIs, and build a business case that your board will approve…'),
            ]
            for title, excerpt, body in articles:
                Article.objects.create(title=title, excerpt=excerpt, body=body)
            self.stdout.write(f'  ✓ {len(articles)} blog articles seeded')

        # ── Events ──
        if PromoEvent.objects.count() < 2:
            events = [
                ('Nepal AI Summit 2026', '2026-06-15',
                 'Annual gathering of AI practitioners, business leaders, and policymakers shaping Nepal\'s AI ecosystem. AswenSolutions will be presenting our latest work in healthcare AI and financial services automation.'),
                ('AI for Business: Free Webinar Series', '2026-05-28',
                 'A free 4-part webinar series designed for business leaders who want to understand AI without the jargon. Sessions cover AI strategy, selecting vendors, managing AI projects, and measuring ROI.'),
                ('Hack for Nepal: AI Hackathon', '2026-07-05',
                 '48-hour hackathon focused on using AI to solve Nepal\'s most pressing development challenges. Prizes worth NPR 5,00,000. AswenSolutions is a headline sponsor and mentor partner.'),
            ]
            from datetime import date
            for title, event_date, desc in events:
                PromoEvent.objects.create(title=title, event_date=date.fromisoformat(event_date), description=desc)
            self.stdout.write(f'  ✓ {len(events)} events seeded')

        self.stdout.write(self.style.SUCCESS('\n✅ AswenSolutions seed data complete!'))
        self.stdout.write('   → Run the dev server: python manage.py runserver')
        self.stdout.write('   → Admin login:        admin / admin123')

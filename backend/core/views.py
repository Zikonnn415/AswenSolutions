from django.contrib.auth import authenticate
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken

from .models import ContactRequest, Article, Project, Review, PromoEvent, Solution
from .serializers import (
    ContactRequestSerializer, ArticleSerializer,
    ProjectSerializer, ReviewSerializer, PromoEventSerializer, SolutionSerializer,
)


def _paginate(queryset, serializer_cls, request):
    try:
        limit  = max(1, int(request.query_params.get('limit',  20)))
        offset = max(0, int(request.query_params.get('offset', 0)))
    except ValueError:
        limit, offset = 20, 0
    total   = queryset.count()
    records = queryset[offset: offset + limit]
    data    = serializer_cls(records, many=True).data
    return Response({'count': total, 'results': data})


def _get_or_404(model, pk):
    try:
        return model.objects.get(pk=pk)
    except model.DoesNotExist:
        return None


# ── Auth ──────────────────────────────────────────────────────────
class ObtainTokenView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username', '').strip()
        password = request.data.get('password', '').strip()
        if not username or not password:
            return Response({'detail': 'Both username and password are required.'}, status=400)
        user = authenticate(request, username=username, password=password)
        if user is None:
            return Response({'detail': 'Invalid credentials. Please try again.'}, status=401)
        tokens = RefreshToken.for_user(user)
        access_str = str(tokens.access_token)
        return Response({'token': access_str, 'access': access_str, 'refresh': str(tokens)})


# ── Inquiries ─────────────────────────────────────────────────────
class ContactListView(APIView):
    def get_permissions(self):
        return [AllowAny()] if self.request.method == 'POST' else [IsAuthenticated()]

    def get(self, request):
        qs = ContactRequest.objects.all()
        reviewed_param = request.query_params.get('reviewed')
        if reviewed_param is not None:
            qs = qs.filter(is_reviewed=reviewed_param.lower() == 'true')
        return _paginate(qs, ContactRequestSerializer, request)

    def post(self, request):
        s = ContactRequestSerializer(data=request.data)
        if s.is_valid():
            s.save()
            return Response(s.data, status=201)
        return Response(s.errors, status=400)


class ContactDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        obj = _get_or_404(ContactRequest, pk)
        if obj is None: return Response({'detail': 'Not found.'}, status=404)
        return Response(ContactRequestSerializer(obj).data)

    def delete(self, request, pk):
        obj = _get_or_404(ContactRequest, pk)
        if obj is None: return Response({'detail': 'Not found.'}, status=404)
        obj.delete()
        return Response(status=204)


class ToggleReviewView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        obj = _get_or_404(ContactRequest, pk)
        if obj is None: return Response({'detail': 'Not found.'}, status=404)
        obj.is_reviewed = not obj.is_reviewed
        obj.save(update_fields=['is_reviewed'])
        return Response({'id': obj.pk, 'is_reviewed': obj.is_reviewed})


# ── Articles ──────────────────────────────────────────────────────
class ArticleListView(APIView):
    def get_permissions(self):
        return [AllowAny()] if self.request.method == 'GET' else [IsAuthenticated()]

    def get(self, request):
        return _paginate(Article.objects.all(), ArticleSerializer, request)

    def post(self, request):
        data = {
            'title':     request.data.get('title', ''),
            'excerpt':   request.data.get('excerpt', ''),
            'body':      request.data.get('content', request.data.get('body', '')),
            'cover_url': request.data.get('cover_image_url', request.data.get('cover_url', '')),
        }
        if not data['title']:
            return Response({'title': ['This field is required.']}, status=400)
        obj = Article(**{k: v for k, v in data.items() if v != ''})
        obj.save()
        return Response(ArticleSerializer(obj).data, status=201)


class ArticleDetailView(APIView):
    def get_permissions(self):
        return [AllowAny()] if self.request.method == 'GET' else [IsAuthenticated()]

    def get(self, request, pk):
        obj = _get_or_404(Article, pk)
        if obj is None: return Response({'detail': 'Not found.'}, status=404)
        return Response(ArticleSerializer(obj).data)

    def put(self, request, pk):
        obj = _get_or_404(Article, pk)
        if obj is None: return Response({'detail': 'Not found.'}, status=404)
        obj.title     = request.data.get('title',   obj.title)
        obj.excerpt   = request.data.get('excerpt', obj.excerpt)
        obj.body      = request.data.get('content', request.data.get('body', obj.body))
        obj.cover_url = request.data.get('cover_image_url', request.data.get('cover_url', obj.cover_url))
        obj.save()
        return Response(ArticleSerializer(obj).data)

    def delete(self, request, pk):
        obj = _get_or_404(Article, pk)
        if obj is None: return Response({'detail': 'Not found.'}, status=404)
        obj.delete()
        return Response(status=204)


# ── Projects ──────────────────────────────────────────────────────
class ProjectListView(APIView):
    def get_permissions(self):
        return [AllowAny()] if self.request.method == 'GET' else [IsAuthenticated()]

    def get(self, request):
        return _paginate(Project.objects.all(), ProjectSerializer, request)

    def post(self, request):
        title       = request.data.get('name',    request.data.get('title', ''))
        summary     = request.data.get('summary', '')
        description = request.data.get('details', request.data.get('description', ''))
        image_url   = request.data.get('image_url', '')
        if not title:
            return Response({'name': ['This field is required.']}, status=400)
        obj = Project(title=title, summary=summary, description=description, image_url=image_url)
        obj.save()
        return Response(ProjectSerializer(obj).data, status=201)


class ProjectDetailView(APIView):
    def get_permissions(self):
        return [AllowAny()] if self.request.method == 'GET' else [IsAuthenticated()]

    def get(self, request, pk):
        obj = _get_or_404(Project, pk)
        if obj is None: return Response({'detail': 'Not found.'}, status=404)
        return Response(ProjectSerializer(obj).data)

    def put(self, request, pk):
        obj = _get_or_404(Project, pk)
        if obj is None: return Response({'detail': 'Not found.'}, status=404)
        obj.title       = request.data.get('name',    request.data.get('title',       obj.title))
        obj.summary     = request.data.get('summary',  obj.summary)
        obj.description = request.data.get('details',  request.data.get('description', obj.description))
        obj.image_url   = request.data.get('image_url', obj.image_url)
        obj.save()
        return Response(ProjectSerializer(obj).data)

    def delete(self, request, pk):
        obj = _get_or_404(Project, pk)
        if obj is None: return Response({'detail': 'Not found.'}, status=404)
        obj.delete()
        return Response(status=204)


# ── Reviews ───────────────────────────────────────────────────────
class ReviewListView(APIView):
    def get_permissions(self):
        return [AllowAny()] if self.request.method == 'GET' else [IsAuthenticated()]

    def get(self, request):
        return _paginate(Review.objects.all(), ReviewSerializer, request)

    def post(self, request):
        client_name  = request.data.get('author',  request.data.get('client_name', ''))
        organisation = request.data.get('company', request.data.get('organisation', ''))
        stars        = request.data.get('rating',  request.data.get('stars', 5))
        feedback     = request.data.get('text',    request.data.get('feedback', ''))
        if not client_name: return Response({'author': ['This field is required.']}, status=400)
        if not feedback:    return Response({'text':   ['This field is required.']}, status=400)
        try: stars = max(1, min(5, int(stars)))
        except: stars = 5
        obj = Review(client_name=client_name, organisation=organisation, stars=stars, feedback=feedback)
        obj.save()
        return Response(ReviewSerializer(obj).data, status=201)


class ReviewDetailView(APIView):
    def get_permissions(self):
        return [AllowAny()] if self.request.method == 'GET' else [IsAuthenticated()]

    def get(self, request, pk):
        obj = _get_or_404(Review, pk)
        if obj is None: return Response({'detail': 'Not found.'}, status=404)
        return Response(ReviewSerializer(obj).data)

    def put(self, request, pk):
        obj = _get_or_404(Review, pk)
        if obj is None: return Response({'detail': 'Not found.'}, status=404)
        obj.client_name  = request.data.get('author',  request.data.get('client_name',  obj.client_name))
        obj.organisation = request.data.get('company', request.data.get('organisation', obj.organisation))
        obj.feedback     = request.data.get('text',    request.data.get('feedback',     obj.feedback))
        try:
            obj.stars = max(1, min(5, int(request.data.get('rating', request.data.get('stars', obj.stars)))))
        except: pass
        obj.save()
        return Response(ReviewSerializer(obj).data)

    def delete(self, request, pk):
        obj = _get_or_404(Review, pk)
        if obj is None: return Response({'detail': 'Not found.'}, status=404)
        obj.delete()
        return Response(status=204)


# ── Events ────────────────────────────────────────────────────────
class EventListView(APIView):
    def get_permissions(self):
        return [AllowAny()] if self.request.method == 'GET' else [IsAuthenticated()]

    def get(self, request):
        return _paginate(PromoEvent.objects.all(), PromoEventSerializer, request)

    def post(self, request):
        title       = request.data.get('title', '')
        event_date  = request.data.get('date', request.data.get('event_date', ''))
        description = request.data.get('description', '')
        image_url   = request.data.get('image_url', '')
        if not title:      return Response({'title': ['This field is required.']}, status=400)
        if not event_date: return Response({'date':  ['This field is required.']}, status=400)
        obj = PromoEvent(title=title, event_date=event_date, description=description, image_url=image_url)
        obj.save()
        return Response(PromoEventSerializer(obj).data, status=201)


class EventDetailView(APIView):
    def get_permissions(self):
        return [AllowAny()] if self.request.method == 'GET' else [IsAuthenticated()]

    def get(self, request, pk):
        obj = _get_or_404(PromoEvent, pk)
        if obj is None: return Response({'detail': 'Not found.'}, status=404)
        return Response(PromoEventSerializer(obj).data)

    def put(self, request, pk):
        obj = _get_or_404(PromoEvent, pk)
        if obj is None: return Response({'detail': 'Not found.'}, status=404)
        obj.title       = request.data.get('title',       obj.title)
        obj.event_date  = request.data.get('date', request.data.get('event_date', obj.event_date))
        obj.description = request.data.get('description', obj.description)
        obj.image_url   = request.data.get('image_url',   obj.image_url)
        obj.save()
        return Response(PromoEventSerializer(obj).data)

    def delete(self, request, pk):
        obj = _get_or_404(PromoEvent, pk)
        if obj is None: return Response({'detail': 'Not found.'}, status=404)
        obj.delete()
        return Response(status=204)


# ── Solutions (Services) ──────────────────────────────────────────
class SolutionListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        return _paginate(Solution.objects.all(), SolutionSerializer, request)


# ── Analytics ─────────────────────────────────────────────────────
class StatsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        return Response({
            'inquiries':            ContactRequest.objects.count(),
            'unreviewed_inquiries': ContactRequest.objects.filter(is_reviewed=False).count(),
            'blogs':                Article.objects.count(),
            'case_studies':         Project.objects.count(),
            'testimonials':         Review.objects.count(),
            'events':               PromoEvent.objects.count(),
            'pending_review':       ContactRequest.objects.filter(is_reviewed=False).count(),
            'total_solutions':      Solution.objects.count(),
        })


# ── ChatBot ───────────────────────────────────────────────────────
class ChatBotView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        user_message = request.data.get('message', '').strip()
        if not user_message:
            return Response({'error': 'Message is required'}, status=400)

        msg = user_message.lower()

        if any(w in msg for w in ['hello', 'hi', 'hey', 'greetings', 'namaste']):
            response = "Hello! Welcome to AswenSolutions. I'm Aswen, your AI assistant. How can I help you today?"
        elif any(w in msg for w in ['service', 'services', 'offer', 'provide', 'what do you']):
            response = "We offer: AI Prototyping, Intelligent Virtual Assistants, Data Engineering, ML Consulting, and Cloud AI Integration. Which interests you most?"
        elif any(w in msg for w in ['contact', 'email', 'phone', 'address', 'reach']):
            response = "📍 Hattisar, Kathmandu 44600, Nepal\n📞 +977-1-5551234\n📧 hello@aswensolutions.com.np\nWe respond within 24 hours!"
        elif any(w in msg for w in ['price', 'cost', 'pricing', 'how much', 'charge']):
            response = "We offer custom pricing based on your project scope. Our engagements start from consultation — book a free discovery call at /contact."
        elif any(w in msg for w in ['time', 'long', 'duration', 'timeline', 'deliver']):
            response = "Timelines vary by project: AI prototypes take 2–4 weeks, full deployments 2–6 months. We'll give you a precise estimate after a discovery call."
        elif any(w in msg for w in ['industry', 'sector', 'banking', 'healthcare', 'tourism']):
            response = "We serve Banking & Finance, Tourism & Hospitality, Healthcare, Retail & E-Commerce, Government, and Manufacturing sectors across Nepal and beyond."
        elif any(w in msg for w in ['team', 'who', 'about', 'company', 'aswensolutions']):
            response = "AswenSolutions is a Kathmandu-based AI company delivering practical, enterprise-grade AI products. We combine local expertise with global-standard engineering."
        elif any(w in msg for w in ['case', 'project', 'portfolio', 'example', 'work']):
            response = "Explore our case studies at /case-studies — we've delivered solutions for banks, tourism platforms, healthcare systems, and more."
        elif any(w in msg for w in ['thank', 'thanks', 'great', 'awesome', 'perfect']):
            response = "You're welcome! Is there anything else I can help you with? 😊"
        elif any(w in msg for w in ['bye', 'goodbye', 'see you', 'cya']):
            response = "Goodbye! Feel free to reach out anytime. We're always here to help. 👋"
        else:
            response = f"Thanks for your message! I can help with info about our services, pricing, team, or how to get started. What would you like to know?"

        return Response({'response': response, 'status': 'success'})

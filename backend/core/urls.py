from django.urls import path
from .views import (
    ObtainTokenView,
    ContactListView, ContactDetailView, ToggleReviewView,
    ArticleListView, ArticleDetailView,
    ProjectListView, ProjectDetailView,
    ReviewListView,  ReviewDetailView,
    EventListView,   EventDetailView,
    SolutionListView,
    StatsView,
    ChatBotView,
)

urlpatterns = [
    # Auth
    path('auth/login/', ObtainTokenView.as_view()),

    # Inquiries
    path('inquiries/',                     ContactListView.as_view()),
    path('inquiries/<int:pk>/',            ContactDetailView.as_view()),
    path('inquiries/<int:pk>/toggle-review/', ToggleReviewView.as_view()),

    # Blog articles
    path('blogs/',           ArticleListView.as_view()),
    path('blogs/<int:pk>/',  ArticleDetailView.as_view()),

    # Case studies
    path('case-studies/',           ProjectListView.as_view()),
    path('case-studies/<int:pk>/',  ProjectDetailView.as_view()),

    # Testimonials
    path('testimonials/',           ReviewListView.as_view()),
    path('testimonials/<int:pk>/',  ReviewDetailView.as_view()),

    # Events
    path('events/',           EventListView.as_view()),
    path('events/<int:pk>/',  EventDetailView.as_view()),

    # Services
    path('services/',  SolutionListView.as_view()),

    # Analytics
    path('analytics/', StatsView.as_view()),

    # ChatBot
    path('chat/',      ChatBotView.as_view()),
]

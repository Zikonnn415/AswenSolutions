from rest_framework import serializers
from .models import ContactRequest, Article, Project, Review, PromoEvent, Solution


class ContactRequestSerializer(serializers.ModelSerializer):
    reviewed   = serializers.BooleanField(source='is_reviewed', read_only=True)
    created_at = serializers.DateTimeField(source='submitted_at', read_only=True)

    class Meta:
        model  = ContactRequest
        fields = (
            'id', 'name', 'email', 'phone', 'company', 'country',
            'job_title', 'job_details',
            'reviewed', 'created_at',
            'is_reviewed', 'submitted_at',
        )
        read_only_fields = ('id', 'is_reviewed', 'submitted_at', 'reviewed', 'created_at')


class ArticleSerializer(serializers.ModelSerializer):
    content         = serializers.CharField(source='body',      read_only=True)
    cover_image_url = serializers.URLField(source='cover_url',  read_only=True)
    created_at      = serializers.DateTimeField(source='published_at', read_only=True)

    class Meta:
        model  = Article
        fields = (
            'id', 'title', 'excerpt',
            'content', 'cover_image_url', 'created_at',
            'body', 'cover_url', 'published_at',
        )
        read_only_fields = ('id', 'published_at')


class ProjectSerializer(serializers.ModelSerializer):
    name    = serializers.CharField(source='title',       read_only=True)
    details = serializers.CharField(source='description', read_only=True)

    class Meta:
        model  = Project
        fields = (
            'id', 'name', 'details',
            'title', 'summary', 'description', 'image_url', 'created_at',
        )
        read_only_fields = ('id', 'created_at')


class ReviewSerializer(serializers.ModelSerializer):
    author  = serializers.CharField(source='client_name',  read_only=True)
    company = serializers.CharField(source='organisation',  read_only=True)
    rating  = serializers.IntegerField(source='stars',      read_only=True)
    text    = serializers.CharField(source='feedback',      read_only=True)

    class Meta:
        model  = Review
        fields = (
            'id', 'author', 'company', 'rating', 'text',
            'client_name', 'organisation', 'stars', 'feedback', 'created_at',
        )
        read_only_fields = ('id', 'created_at')


class PromoEventSerializer(serializers.ModelSerializer):
    date = serializers.DateField(source='event_date', read_only=True)

    class Meta:
        model  = PromoEvent
        fields = (
            'id', 'title',
            'date', 'event_date',
            'description', 'image_url', 'created_at',
        )
        read_only_fields = ('id', 'created_at')


class SolutionSerializer(serializers.ModelSerializer):
    features       = serializers.JSONField(source='feature_list',  read_only=True)
    timeline       = serializers.CharField(source='delivery_time', read_only=True)
    starting_price = serializers.CharField(source='price_from',    read_only=True)

    class Meta:
        model  = Solution
        fields = (
            'id', 'icon', 'title', 'description',
            'features', 'timeline', 'starting_price',
            'feature_list', 'delivery_time', 'price_from', 'created_at',
        )
        read_only_fields = ('id', 'created_at')

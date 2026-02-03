"""OSmOSE Website API Routing"""
from rest_framework import routers

from backend.osmosewebsite.views import (
    NewsViewSet,
    ProjectViewSet,
    BibliographyViewSet,
)
from backend.osmosewebsite.views.scientific_talk import ScientificTalkViewSet

# API urls are meant to be used by our React frontend
website_router = routers.DefaultRouter()
website_router.register(r"news", NewsViewSet, basename="news")
website_router.register(
    r"scientific-talk", ScientificTalkViewSet, basename="scientific-talk"
)
website_router.register(r"projects", ProjectViewSet, basename="projects")
website_router.register(r"bibliography", BibliographyViewSet, basename="bibliography")

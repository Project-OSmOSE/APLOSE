"""OSmOSE Website API Routing"""
from rest_framework import routers

from backend.osmosewebsite.views import (
    ProjectViewSet,
    BibliographyViewSet,
)

# API urls are meant to be used by our React frontend
website_router = routers.DefaultRouter()
website_router.register(r"projects", ProjectViewSet, basename="projects")
website_router.register(r"bibliography", BibliographyViewSet, basename="bibliography")

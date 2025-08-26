""" APLOSE API Routing"""
from rest_framework import routers

from backend.api.view import (
    DownloadViewSet,
    AnnotationPhaseViewSet,
    LabelSetViewSet,
    AnnotationFileRangeViewSet,
)
from backend.api.view.annotation.annotation_campaign import AnnotationCampaignViewSet

# API urls are meant to be used by our React frontend
api_router = routers.DefaultRouter()
api_router.register(
    r"annotation-campaign", AnnotationCampaignViewSet, basename="annotation-campaign"
)
api_router.register(
    r"annotation-campaign-phase",
    AnnotationPhaseViewSet,
    basename="annotation-campaign-phase",
)
api_router.register(
    r"annotation-file-range",
    AnnotationFileRangeViewSet,
    basename="annotation-file-range",
)
api_router.register(r"label-set", LabelSetViewSet, basename="label-set")
api_router.register("download", DownloadViewSet, basename="download")

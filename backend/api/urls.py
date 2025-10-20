""" APLOSE API Routing"""
from rest_framework import routers

from backend.api.view import (
    AnnotationViewSet,
    DownloadViewSet,
    AnnotationPhaseViewSet,
    LabelSetViewSet,
    AnnotationFileRangeViewSet,
    ConfidenceSetViewSet,
    AnnotationCampaignViewSet,
    AnnotationCommentViewSet,
    AnnotationTaskViewSet,
)

# API urls are meant to be used by our React frontend
api_router = routers.DefaultRouter()
api_router.register(r"annotation", AnnotationViewSet, basename="annotation")
api_router.register(
    r"annotation-comment", AnnotationCommentViewSet, basename="annotation-comment"
)
api_router.register(
    r"annotation-task", AnnotationTaskViewSet, basename="annotation-task"
)
api_router.register(
    r"annotation-campaign", AnnotationCampaignViewSet, basename="annotation-campaign"
)
api_router.register(
    r"annotation-phase",
    AnnotationPhaseViewSet,
    basename="annotation-phase",
)
api_router.register(
    r"annotation-file-range",
    AnnotationFileRangeViewSet,
    basename="annotation-file-range",
)
api_router.register(r"label-set", LabelSetViewSet, basename="label-set")
api_router.register(r"confidence-set", ConfidenceSetViewSet, basename="confidence-set")
api_router.register("download", DownloadViewSet, basename="download")

""" APLOSE API Routing"""
from backend.api.views import (
    DatasetViewSet,
    AnnotationCommentViewSet,
    ConfidenceIndicatorSetViewSet,
    DetectorViewSet,
    AnnotationResultViewSet,
    AudioMetadatumViewSet,
    SpectrogramConfigurationViewSet,
    DatasetFileViewSet,
)
from rest_framework import routers

# API urls are meant to be used by our React frontend
api_router = routers.DefaultRouter()
api_router.register(r"dataset", DatasetViewSet, basename="dataset")
api_router.register(r"dataset-file", DatasetFileViewSet, basename="dataset-file")
api_router.register(r"detector", DetectorViewSet, basename="detector")
api_router.register(
    r"annotation-result", AnnotationResultViewSet, basename="annotation-result"
)
api_router.register(
    r"annotation-comment", AnnotationCommentViewSet, basename="annotation-comment"
)
api_router.register(
    r"confidence-indicator",
    ConfidenceIndicatorSetViewSet,
    basename="confidence-indicator",
)

api_router.register(
    r"spectrogram-configuration",
    SpectrogramConfigurationViewSet,
    basename="spectrogram-configuration",
)
api_router.register(r"audio-metadata", AudioMetadatumViewSet, basename="audio-metadata")

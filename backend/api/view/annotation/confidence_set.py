"""Confidence Indicator Set DRF-Viewset file"""

from rest_framework import viewsets, permissions

from backend.api.models import ConfidenceSet
from backend.api.serializers import ConfidenceSetSerializer
from backend.utils.filters import ModelFilter


class ConfidenceSetViewSet(viewsets.ReadOnlyModelViewSet):
    """
    A simple ViewSet for confidence set
    """

    queryset = ConfidenceSet.objects.prefetch_related(
        "indicator_relations",
        "indicator_relations__confidence",
    )
    serializer_class = ConfidenceSetSerializer
    filter_backends = (ModelFilter,)
    permission_classes = (permissions.IsAuthenticated,)

from django_filters import OrderingFilter

from backend.api.models import SpectrogramAnalysis
from backend.utils.schema.filters import BaseFilterSet


class SpectrogramAnalysisFilterSet(BaseFilterSet):
    """SpectrogramAnalysis filters"""

    class Meta:
        model = SpectrogramAnalysis
        fields = {
            "dataset": ("exact",),
            "annotation_campaigns__id": ("exact",),
        }

    order_by = OrderingFilter(fields=("created_at", "name"))

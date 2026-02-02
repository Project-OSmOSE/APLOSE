from django.db.models import (
    Q,
)
from django_extension.filters import ExtendedFilterSet
from django_filters import BooleanFilter, CharFilter, OrderingFilter
from graphene_django.filter import TypedFilter

from backend.api.models import AnnotationPhase
from backend.api.schema.enums import AnnotationPhaseType


class AnnotationPhaseFilterSet(ExtendedFilterSet):
    """AnnotationPhase filters"""

    is_campaign_archived = BooleanFilter(
        field_name="annotation_campaign__archive", lookup_expr="isnull", exclude=True
    )

    phase = TypedFilter(
        input_type=AnnotationPhaseType,
        field_name="phase",
        lookup_expr="exact",
    )
    search = CharFilter(method="search_filter", label="search")

    class Meta:
        model = AnnotationPhase
        fields = {
            "annotation_campaign_id": ("exact",),
            "annotation_campaign__owner_id": ("exact",),
            "annotation_file_ranges__annotator_id": ("exact",),
        }

    order_by = OrderingFilter(fields=(("phase", "phase"),))

    def search_filter(self, queryset, name, value):
        """Search an AnnotationPhase"""
        return queryset.filter(
            Q(annotation_campaign__name__icontains=value)
            | Q(annotation_campaign__dataset__name__icontains=value)
        )

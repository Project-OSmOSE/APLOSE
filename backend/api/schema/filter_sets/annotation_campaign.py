from django.db.models import Q
from django_filters import BooleanFilter, CharFilter, OrderingFilter
from graphene_django.filter import TypedFilter

from backend.api.models import AnnotationCampaign
from backend.api.schema.enums import AnnotationPhaseType
from backend.utils.schema.filters import BaseFilterSet


class AnnotationCampaignFilterSet(BaseFilterSet):
    """AnnotationCampaign filters"""

    is_archived = BooleanFilter(
        field_name="archive", lookup_expr="isnull", exclude=True
    )
    phases__phase = TypedFilter(
        input_type=AnnotationPhaseType,
        field_name="phases__phase",
        lookup_expr="exact",
    )
    search = CharFilter(method="search_filter", label="search")

    class Meta:
        model = AnnotationCampaign
        fields = {
            "phases__annotation_file_ranges__annotator_id": ("exact",),
            "owner_id": ("exact",),
        }

    order_by = OrderingFilter(fields=("name",))

    def search_filter(self, queryset, name, value):
        """Search an AnnotationCampaign"""
        return queryset.filter(
            Q(name__icontains=value) | Q(dataset__name__icontains=value)
        )

from django_filters import FilterSet, OrderingFilter

from backend.api.models import Dataset


class DatasetFilterSet(FilterSet):
    """Dataset filters"""

    class Meta:
        # pylint: disable=missing-class-docstring, too-few-public-methods
        model = Dataset
        fields = {}

    order_by = OrderingFilter(fields=("created_at", "name"))

from django_filters import FilterSet, OrderingFilter

from backend.api.models import Dataset


class DatasetFilterSet(FilterSet):
    """Dataset filters"""

    class Meta:
        model = Dataset
        fields = {
            "archived": [
                "exact",
            ]
        }

    order_by = OrderingFilter(
        fields=(
            ("created_at", "created_at"),
            ("name", "name"),
        )
    )

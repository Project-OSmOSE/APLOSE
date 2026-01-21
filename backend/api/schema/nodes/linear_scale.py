from django_extension.schema.types import ExtendedNode

from backend.api.models import LinearScale


class LinearScaleNode(ExtendedNode):
    """LinearScale schema"""

    class Meta:
        model = LinearScale
        fields = "__all__"
        filter_fields = ()

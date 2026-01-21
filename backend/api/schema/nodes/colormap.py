"""Colormap model"""
from django_extension.schema.types import ExtendedNode

from backend.api.models import Colormap


class ColormapNode(ExtendedNode):
    """Colormap schema"""

    class Meta:
        model = Colormap
        fields = "__all__"
        filter_fields = "__all__"

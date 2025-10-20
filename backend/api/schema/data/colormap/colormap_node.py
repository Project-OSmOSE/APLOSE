"""Colormap model"""

from backend.api.models import Colormap
from backend.utils.schema.types import BaseObjectType, BaseNode


class ColormapNode(BaseObjectType):
    """Colormap schema"""

    class Meta:
        # pylint: disable=missing-class-docstring, too-few-public-methods
        model = Colormap
        fields = "__all__"
        filter_fields = "__all__"
        interfaces = (BaseNode,)

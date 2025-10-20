from backend.api.models import LinearScale
from backend.utils.schema.types import BaseObjectType, BaseNode


class LinearScaleNode(BaseObjectType):
    """LinearScale schema"""

    class Meta:
        # pylint: disable=missing-class-docstring, too-few-public-methods
        model = LinearScale
        fields = "__all__"
        filter_fields = ()
        interfaces = (BaseNode,)

from backend.api.models import AcousticFeatures
from backend.api.schema.enums import SignalTrendType
from backend.utils.schema.types import BaseNode, BaseObjectType


class AcousticFeaturesNode(BaseObjectType):
    """Annotation schema"""

    trend = SignalTrendType()

    class Meta:
        # pylint: disable=missing-class-docstring, too-few-public-methods
        model = AcousticFeatures
        fields = "__all__"
        interfaces = (BaseNode,)

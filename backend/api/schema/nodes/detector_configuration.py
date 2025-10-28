from backend.api.models import DetectorConfiguration
from backend.utils.schema.types import BaseObjectType, BaseNode


class DetectorConfigurationNode(BaseObjectType):
    """DetectorConfiguration schema"""

    class Meta:
        # pylint: disable=missing-class-docstring, too-few-public-methods
        model = DetectorConfiguration
        fields = "__all__"
        interfaces = (BaseNode,)

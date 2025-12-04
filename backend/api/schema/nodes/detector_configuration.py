from backend.api.models import DetectorConfiguration
from backend.utils.schema.types import BaseObjectType, BaseNode


class DetectorConfigurationNode(BaseObjectType):
    """DetectorConfiguration schema"""

    class Meta:
        model = DetectorConfiguration
        fields = "__all__"
        interfaces = (BaseNode,)

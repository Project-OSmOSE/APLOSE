import graphene

from backend.api.models import Detector
from backend.utils.schema.types import BaseObjectType, BaseNode
from ..detector_configuration.configuration_node import DetectorConfigurationNode


class DetectorNode(BaseObjectType):
    """Detector schema"""

    configurations = graphene.List(DetectorConfigurationNode)

    class Meta:
        # pylint: disable=missing-class-docstring, too-few-public-methods
        model = Detector
        fields = "__all__"
        filter_fields = {}
        interfaces = (BaseNode,)

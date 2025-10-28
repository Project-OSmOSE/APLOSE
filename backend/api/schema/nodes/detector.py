import graphene
import graphene_django_optimizer

from backend.api.models import Detector
from backend.utils.schema.types import BaseObjectType, BaseNode
from .detector_configuration import DetectorConfigurationNode


class DetectorNode(BaseObjectType):
    """Detector schema"""

    class Meta:
        # pylint: disable=missing-class-docstring, too-few-public-methods
        model = Detector
        fields = "__all__"
        filter_fields = {}
        interfaces = (BaseNode,)

    configurations = graphene.List(DetectorConfigurationNode)

    @graphene_django_optimizer.resolver_hints()
    def resolve_configurations(self: Detector, info):
        return self.configurations.all()

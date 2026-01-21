import graphene
import graphene_django_optimizer
from django_extension.schema.types import ExtendedNode

from backend.api.models import Detector
from .detector_configuration import DetectorConfigurationNode


class DetectorNode(ExtendedNode):
    """Detector schema"""

    class Meta:
        model = Detector
        fields = "__all__"
        filter_fields = {}

    configurations = graphene.List(DetectorConfigurationNode)

    @graphene_django_optimizer.resolver_hints()
    def resolve_configurations(self: Detector, info):
        return self.configurations.all()

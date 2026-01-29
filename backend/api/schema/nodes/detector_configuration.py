from django_extension.schema.types import ExtendedNode

from backend.api.models import DetectorConfiguration


class DetectorConfigurationNode(ExtendedNode):
    """DetectorConfiguration schema"""

    class Meta:
        model = DetectorConfiguration
        fields = "__all__"

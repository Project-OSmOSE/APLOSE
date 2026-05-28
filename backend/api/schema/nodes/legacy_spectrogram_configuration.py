"""LegacySpectrogramConfiguration schema"""
from django_extension.schema.types import ExtendedNode

from backend.api.models import LegacySpectrogramConfiguration


class LegacySpectrogramConfigurationNode(ExtendedNode):
    """LegacySpectrogramConfiguration schema"""

    class Meta:
        model = LegacySpectrogramConfiguration
        fields = "__all__"
        filter_fields = {}

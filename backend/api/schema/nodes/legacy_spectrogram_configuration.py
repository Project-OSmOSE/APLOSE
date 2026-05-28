"""LegacySpectrogramConfiguration schema"""
import graphene_django_optimizer
from django_extension.schema.types import ExtendedNode
from graphene import String

from backend.api.models import LegacySpectrogramConfiguration
from .linear_scale import LinearScaleNode
from .multi_linear_scale import MultiLinearScaleNode


class LegacySpectrogramConfigurationNode(ExtendedNode):
    """LegacySpectrogramConfiguration schema"""

    class Meta:
        model = LegacySpectrogramConfiguration
        fields = "__all__"
        filter_fields = {}

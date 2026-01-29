"""LegacySpectrogramConfiguration schema"""
import graphene_django_optimizer
from django_extension.schema.types import ExtendedNode
from graphene import String

from backend.api.models import LegacySpectrogramConfiguration
from .linear_scale import LinearScaleNode
from .multi_linear_scale import MultiLinearScaleNode


class LegacySpectrogramConfigurationNode(ExtendedNode):
    """LegacySpectrogramConfiguration schema"""

    linear_frequency_scale = LinearScaleNode()
    multi_linear_frequency_scale = MultiLinearScaleNode()

    class Meta:
        model = LegacySpectrogramConfiguration
        fields = "__all__"
        filter_fields = {}

    scale_name = String()

    @graphene_django_optimizer.resolver_hints(
        select_related=("linear_frequency_scale", "multi_linear_frequency_scale")
    )
    def resolve_scale_name(self: LegacySpectrogramConfiguration, info):
        """Get scale name"""
        if self.multi_linear_frequency_scale:
            return self.multi_linear_frequency_scale.name
        if self.linear_frequency_scale:
            return self.linear_frequency_scale.name
        return None

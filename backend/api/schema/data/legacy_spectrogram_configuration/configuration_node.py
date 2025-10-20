"""LegacySpectrogramConfiguration schema"""
import graphene_django_optimizer
from graphene import ObjectType, String

from backend.api.models import LegacySpectrogramConfiguration
from backend.utils.schema.types import BaseObjectType, BaseNode


class LegacySpectrogramConfigurationNode(BaseObjectType):
    """LegacySpectrogramConfiguration schema"""

    scale_name = String()

    class Meta:
        # pylint: disable=missing-class-docstring, too-few-public-methods
        model = LegacySpectrogramConfiguration
        fields = "__all__"
        filter_fields = {}
        interfaces = (BaseNode,)

    @graphene_django_optimizer.resolver_hints(
        select_related=("linear_frequency_scale", "multi_linear_frequency_scale")
    )
    def resolve_scale_name(self, info):
        """Get scale name"""
        if self.multi_linear_frequency_scale:
            return self.multi_linear_frequency_scale.name
        if self.linear_frequency_scale:
            return self.linear_frequency_scale.name
        return None

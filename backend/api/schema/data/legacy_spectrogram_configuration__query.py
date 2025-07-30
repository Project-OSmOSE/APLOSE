"""LegacySpectrogramConfiguration schema"""
from graphene import relay, ObjectType

from backend.api.models import LegacySpectrogramConfiguration
from backend.utils.schema import ApiObjectType, AuthenticatedDjangoConnectionField


class LegacySpectrogramConfigurationNode(ApiObjectType):
    """LegacySpectrogramConfiguration schema"""

    class Meta:
        # pylint: disable=missing-class-docstring, too-few-public-methods
        model = LegacySpectrogramConfiguration
        fields = "__all__"
        filter_fields = {}
        interfaces = (relay.Node,)


class LegacySpectrogramConfigurationQuery(ObjectType):
    """LegacySpectrogramConfiguration queries"""

    all_legacy_spectrogram_configurations = AuthenticatedDjangoConnectionField(
        LegacySpectrogramConfigurationNode
    )

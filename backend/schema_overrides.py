from typing import Optional

import graphene
import graphene_django_optimizer
from metadatax.ontology.models import Label, Source, Sound
from metadatax.ontology.schema import (
    LabelNode as MxLabelNode,
    SourceNode as MxSourceNode,
    SoundNode as MxSoundNode,
)

from .aplose.models import AploseUser, LabelDisplayPreference


class SourceNode(MxSourceNode):
    """Override of Metadatax source node"""

    class Meta:
        model = Source
        fields = "__all__"
        filter_fields = {}

    preferred_display = graphene.String(required=True)

    @graphene_django_optimizer.resolver_hints()
    def resolve_preferred_display(self: Source, info) -> str:
        aplose_user: Optional[AploseUser] = AploseUser.objects.filter(
            user=info.context.user
        ).first()
        name = str(self)

        if (
            aplose_user
            and aplose_user.label_display_preference == LabelDisplayPreference.FRENCH
        ):
            return self.french_name or name

        if (
            aplose_user
            and aplose_user.label_display_preference == LabelDisplayPreference.CODE
        ):
            return self.code_name or name

        return name


class SoundNode(MxSoundNode):
    """Override of Metadatax sound node"""

    class Meta:
        model = Sound
        fields = "__all__"
        filter_fields = {}

    preferred_display = graphene.String(required=True)

    @graphene_django_optimizer.resolver_hints()
    def resolve_preferred_display(self: Sound, info) -> str:
        aplose_user: Optional[AploseUser] = AploseUser.objects.filter(
            user=info.context.user
        ).first()
        name = str(self)

        if (
            aplose_user
            and aplose_user.label_display_preference == LabelDisplayPreference.FRENCH
        ):
            return self.french_name or name

        if (
            aplose_user
            and aplose_user.label_display_preference == LabelDisplayPreference.CODE
        ):
            return self.code_name or name

        return name


class LabelNode(MxLabelNode):
    """Override of Metadatax label node"""

    class Meta:
        model = Label
        fields = "__all__"
        filter_fields = {}

    preferred_display = graphene.String(required=True)

    @graphene_django_optimizer.resolver_hints()
    def resolve_preferred_display(self: Label, info) -> str:
        source_name = SourceNode.resolve_preferred_display(self.source, info)

        if self.sound:
            return f"{source_name} - {SoundNode.resolve_preferred_display(self.sound, info)}"

        return source_name

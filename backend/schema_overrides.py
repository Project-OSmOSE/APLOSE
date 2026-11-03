from typing import Optional

import graphene
import graphene_django_optimizer
from django_extension.schema.fields import ByIdField
from graphene_django_pagination import DjangoPaginationConnectionField
from metadatax.ontology.models import Label
from metadatax.ontology.schema import (
    LabelNode as MxLabelNode,
)

from .aplose.models import AploseUser, LabelDisplayPreference


class LabelNode(MxLabelNode):
    """Override of Metadatax label node"""

    class Meta:
        model = Label
        fields = "__all__"
        filter_fields = {}

    preferred_display = graphene.String(required=True)

    @graphene_django_optimizer.resolver_hints()
    def resolve_preferred_display(self: Label, info) -> str:
        aplose_user: Optional[AploseUser] = AploseUser.objects.filter(
            user=info.context.user
        ).first()
        source_name = str(self.source)
        sound_name = str(self.sound) if self.sound else None

        if (
            aplose_user
            and aplose_user.label_display_preference == LabelDisplayPreference.FRENCH
        ):
            source_name = self.source.french_name or source_name
            sound_name = self.sound.french_name or sound_name if self.sound else None

        if (
            aplose_user
            and aplose_user.label_display_preference == LabelDisplayPreference.CODE
        ):
            source_name = self.source.code_name or source_name
            sound_name = self.sound.code_name or sound_name if self.sound else None

        return source_name + (" - " + sound_name if sound_name else "")


class QueryOverrides(graphene.ObjectType):
    all_labels = DjangoPaginationConnectionField(LabelNode)
    label_by_id = ByIdField(LabelNode)

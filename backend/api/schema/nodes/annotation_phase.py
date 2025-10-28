import graphene
import graphene_django_optimizer

from backend.api.models import AnnotationPhase
from backend.api.schema.context_filters import AnnotationPhaseContextFilter
from backend.api.schema.enums import AnnotationPhaseType
from backend.api.schema.filter_sets import AnnotationPhaseFilterSet
from backend.api.schema.connections import AnnotationFileRangeConnectionField
from backend.utils.schema import AuthenticatedDjangoConnectionField
from backend.utils.schema.types import BaseObjectType, BaseNode
from .annotation_file_range import AnnotationFileRangeNode
from .annotation_spectrogram import AnnotationSpectrogramNode


class AnnotationPhaseNode(BaseObjectType):
    """AnnotationPhase schema"""

    annotation_campaign_id = graphene.Field(
        graphene.ID, source="annotation_campaign_id", required=True
    )
    annotation_file_ranges = AnnotationFileRangeConnectionField(AnnotationFileRangeNode)
    annotation_spectrograms = AuthenticatedDjangoConnectionField(
        AnnotationSpectrogramNode, source="annotations__spectrogram"
    )

    phase = graphene.NonNull(AnnotationPhaseType)

    is_completed = graphene.Boolean(required=True)
    is_open = graphene.Boolean(required=True)

    class Meta:
        # pylint: disable=missing-class-docstring, too-few-public-methods
        model = AnnotationPhase
        fields = "__all__"
        filterset_class = AnnotationPhaseFilterSet
        context_filter = AnnotationPhaseContextFilter
        interfaces = (BaseNode,)

    has_annotations = graphene.Field(graphene.Boolean, required=True)

    @graphene_django_optimizer.resolver_hints()
    def resolve_has_annotations(self: AnnotationPhase, info):
        return self.annotations.exists()

    can_manage = graphene.Field(graphene.Boolean, required=True)

    @graphene_django_optimizer.resolver_hints()
    def resolve_can_manage(self: AnnotationPhase, info):
        if not self.is_open:
            return False
        if self.annotation_campaign.archive:
            return False
        if self.annotation_campaign.owner.id == info.context.user.id:
            return True
        if info.context.user.is_staff:
            return True
        if info.context.user.is_superuser:
            return True
        return False

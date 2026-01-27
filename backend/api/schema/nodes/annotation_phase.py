import graphene
import graphene_django_optimizer
from django.db.models import Sum

from backend.api.models import AnnotationPhase, AnnotationTask
from backend.api.schema.enums import AnnotationPhaseType
from backend.api.schema.filter_sets import AnnotationPhaseFilterSet
from backend.utils.schema import AuthenticatedDjangoConnectionField
from backend.utils.schema.types import BaseObjectType, BaseNode
from .annotation_file_range import AnnotationFileRangeNode
from .annotation_spectrogram import AnnotationSpectrogramNode


class AnnotationPhaseNode(BaseObjectType):
    """AnnotationPhase schema"""

    annotation_campaign_id = graphene.Field(
        graphene.ID, source="annotation_campaign_id", required=True
    )
    annotation_file_ranges = AuthenticatedDjangoConnectionField(AnnotationFileRangeNode)
    annotation_spectrograms = AuthenticatedDjangoConnectionField(
        AnnotationSpectrogramNode, source="annotations__spectrogram"
    )

    phase = graphene.NonNull(AnnotationPhaseType)

    is_completed = graphene.Boolean(required=True)
    is_open = graphene.Boolean(required=True)

    class Meta:
        model = AnnotationPhase
        fields = "__all__"
        filterset_class = AnnotationPhaseFilterSet
        # context_filter = AnnotationPhaseContextFilter
        interfaces = (BaseNode,)

    has_annotations = graphene.Field(graphene.Boolean, required=True)

    @graphene_django_optimizer.resolver_hints()
    def resolve_has_annotations(self: AnnotationPhase, info):
        if self.phase == AnnotationPhase.Type.ANNOTATION:
            return self.annotations.exists()
        return self.annotation_campaign.phases.get(
            phase=AnnotationPhase.Type.ANNOTATION
        ).annotations.exists()

    can_manage = graphene.Boolean(required=True)

    @graphene_django_optimizer.resolver_hints()
    def resolve_can_manage(self: AnnotationPhase, info):
        # Cannot manage ended/archived phase
        if self.ended_at or self.ended_by or self.annotation_campaign.archive:
            return False

        if info.context.user.is_staff or info.context.user.is_superuser:
            return True

        return self.annotation_campaign.owner_id == info.context.user.id

    tasks_count = graphene.Int(required=True)

    @graphene_django_optimizer.resolver_hints()
    def resolve_tasks_count(self: AnnotationPhase, info):
        return self.annotation_file_ranges.aggregate(sum=Sum("files_count"))["sum"]

    user_tasks_count = graphene.Int(required=True)

    @graphene_django_optimizer.resolver_hints()
    def resolve_user_tasks_count(self: AnnotationPhase, info):
        return self.annotation_file_ranges.filter(
            annotator=info.context.user
        ).aggregate(sum=Sum("files_count"))["sum"]

    completed_tasks_count = graphene.Int(required=True)

    @graphene_django_optimizer.resolver_hints()
    def resolve_completed_tasks_count(self: AnnotationPhase, info):
        return self.annotation_tasks.filter(
            status=AnnotationTask.Status.FINISHED
        ).count()

    user_completed_tasks_count = graphene.Int(required=True)

    @graphene_django_optimizer.resolver_hints()
    def resolve_user_completed_tasks_count(self: AnnotationPhase, info):
        return self.annotation_tasks.filter(
            annotator=info.context.user.id, status=AnnotationTask.Status.FINISHED
        ).count()

import graphene
import graphene_django_optimizer
from django.db.models import Sum
from django_extension.schema.types import ExtendedNode
from graphql import GraphQLResolveInfo

from backend.api.models import AnnotationPhase, AnnotationTask
from backend.api.schema.enums import AnnotationPhaseType
from backend.api.schema.filter_sets import AnnotationPhaseFilterSet
from backend.aplose.models import User
from backend.aplose.schema import UserNode
from .__abstract_permission import AbstractPermissionNode


class AnnotationPhaseNode(AbstractPermissionNode, ExtendedNode):
    """AnnotationPhase schema"""

    annotation_campaign_id = graphene.Field(
        graphene.ID, source="annotation_campaign_id", required=True
    )

    phase = graphene.NonNull(AnnotationPhaseType)

    class Meta:
        model = AnnotationPhase
        fields = "__all__"
        filterset_class = AnnotationPhaseFilterSet

    has_annotations = graphene.Field(graphene.Boolean, required=True)

    @graphene_django_optimizer.resolver_hints()
    def resolve_has_annotations(self: AnnotationPhase, info):
        if self.phase == AnnotationPhase.Type.ANNOTATION:
            return self.annotations.exists()
        return self.annotation_campaign.phases.get(
            phase=AnnotationPhase.Type.ANNOTATION
        ).annotations.exists()

    tasks_count = graphene.Int(required=True)

    @graphene_django_optimizer.resolver_hints()
    def resolve_tasks_count(self: AnnotationPhase, info):
        return self.annotation_file_ranges.aggregate(sum=Sum("files_count"))["sum"] or 0

    user_tasks_count = graphene.Int(required=True)

    @graphene_django_optimizer.resolver_hints()
    def resolve_user_tasks_count(self: AnnotationPhase, info):
        return (
            self.annotation_file_ranges.filter(annotator=info.context.user).aggregate(
                sum=Sum("files_count")
            )["sum"]
            or 0
        )

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

    annotators = graphene.List(graphene.NonNull(UserNode), required=True)

    @graphene_django_optimizer.resolver_hints()
    def resolve_annotators(self: AnnotationPhase, info):
        return UserNode.resolve_queryset(
            User.objects.filter(
                annotation_file_ranges__annotation_phase=self
            ).distinct(),
            info,
        )

    has_file_range_change_permission = graphene.Boolean(required=True)

    @graphene_django_optimizer.resolver_hints()
    def resolve_has_file_range_change_permission(
            self: AnnotationPhase, info: GraphQLResolveInfo
    ):
        # pylint: disable=not-callable
        return self.has_file_range_change_permission(info.context.user)

import graphene
import graphene_django_optimizer
from django.db import models
from django.db.models import (
    Subquery,
    Value,
    Func,
    F,
    OuterRef,
    QuerySet,
    ExpressionWrapper,
    Q,
)
from django.db.models.functions import Coalesce
from graphql import GraphQLResolveInfo

from backend.api.context_filters import AnnotationPhaseContextFilter
from backend.api.models import AnnotationPhase, AnnotationFileRange, AnnotationTask
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
    can_manage = graphene.Boolean(required=True)

    tasks_count = graphene.Int(required=True)
    user_tasks_count = graphene.Int(required=True)
    completed_tasks_count = graphene.Int(required=True)
    user_completed_tasks_count = graphene.Int(required=True)

    class Meta:
        model = AnnotationPhase
        fields = "__all__"
        filterset_class = AnnotationPhaseFilterSet
        context_filter = AnnotationPhaseContextFilter
        interfaces = (BaseNode,)

    has_annotations = graphene.Field(graphene.Boolean, required=True)

    @graphene_django_optimizer.resolver_hints()
    def resolve_has_annotations(self: AnnotationPhase, info):
        if self.phase == AnnotationPhase.Type.ANNOTATION:
            return self.annotations.exists()
        return self.annotation_campaign.phases.get(
            phase=AnnotationPhase.Type.ANNOTATION
        ).annotations.exists()

    @classmethod
    def resolve_queryset(cls, queryset: QuerySet, info: GraphQLResolveInfo):
        return (
            super()
            .resolve_queryset(queryset, info)
            .annotate(
                can_manage=Coalesce(
                    ExpressionWrapper(
                        Q(
                            annotation_campaign__archive__isnull=True,
                            ended_at__isnull=True,
                            ended_by__isnull=True,
                        )
                        & (
                            Q()
                            if info.context.user.is_staff
                            or info.context.user.is_superuser
                            else Q(annotation_campaign__owner_id=info.context.user.id)
                        ),
                        output_field=models.BooleanField(),
                    ),
                    Value(False),
                ),
                tasks_count=Coalesce(
                    Subquery(
                        AnnotationFileRange.objects.filter(
                            annotation_phase_id=OuterRef("pk"),
                        )
                        .annotate(sum=Func(F("files_count"), function="Sum"))
                        .values("sum")
                    ),
                    Value(0),
                ),
                user_tasks_count=Coalesce(
                    Subquery(
                        AnnotationFileRange.objects.filter(
                            annotation_phase_id=OuterRef("pk"),
                            annotator_id=info.context.user.id,
                        )
                        .annotate(sum=Func(F("files_count"), function="Sum"))
                        .values("sum")
                    ),
                    Value(0),
                ),
                completed_tasks_count=Subquery(
                    AnnotationTask.objects.filter(
                        annotation_phase_id=OuterRef("pk"),
                        status=AnnotationTask.Status.FINISHED,
                    )
                    .annotate(count=Func(F("id"), function="count"))
                    .values("count")
                ),
                user_completed_tasks_count=Subquery(
                    AnnotationTask.objects.filter(
                        annotation_phase_id=OuterRef("pk"),
                        status=AnnotationTask.Status.FINISHED,
                        annotator_id=info.context.user.id,
                    )
                    .annotate(count=Func(F("id"), function="count"))
                    .values("count")
                ),
            )
        )

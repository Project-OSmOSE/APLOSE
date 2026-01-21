import graphene
import graphene_django_optimizer
from django.db import models
from django.db.models import (
    Exists,
    OuterRef,
    QuerySet,
    F,
    Q,
    ExpressionWrapper,
    Subquery,
    Func,
    Value,
)
from django.db.models.functions import Coalesce
from django_extension.schema.fields import AuthenticatedPaginationConnectionField
from graphql import GraphQLResolveInfo

from backend.api.models import (
    AnnotationCampaign,
    AnnotationFileRange,
    Detector,
    AnnotationTask,
    Spectrogram,
)
from backend.api.schema.filter_sets import AnnotationCampaignFilterSet
from backend.aplose.models import User
from backend.aplose.schema import UserNode
from backend.utils.schema.types import BaseObjectType, BaseNode
from .annotation_phase import AnnotationPhaseNode
from .archive import ArchiveNode
from .detector import DetectorNode
from .label import AnnotationLabelNode


class AnnotationCampaignNode(BaseObjectType):
    """AnnotationCampaign schema"""

    archive = ArchiveNode()
    is_archived = graphene.Boolean(required=True)
    can_manage = graphene.Boolean(required=True)

    dataset_name = graphene.String(required=True)

    # pylint: disable=duplicate-code
    tasks_count = graphene.Int(required=True)
    user_tasks_count = graphene.Int(required=True)
    completed_tasks_count = graphene.Int(required=True)
    user_completed_tasks_count = graphene.Int(required=True)

    class Meta:
        model = AnnotationCampaign
        fields = "__all__"
        filterset_class = AnnotationCampaignFilterSet
        interfaces = (BaseNode,)

    phases = AuthenticatedPaginationConnectionField(AnnotationPhaseNode)

    @graphene_django_optimizer.resolver_hints()
    def resolve_phases(self: AnnotationCampaign, info, **kwargs):
        return AnnotationPhaseNode.resolve_queryset(self.phases.all(), info)

    detectors = graphene.List(DetectorNode)

    @graphene_django_optimizer.resolver_hints()
    def resolve_detectors(self: AnnotationCampaign, info):
        return Detector.objects.filter(
            configurations__annotations__annotation_phase__in=self.phases.all()
        )

    annotators = graphene.List(UserNode)

    @graphene_django_optimizer.resolver_hints()
    def resolve_annotators(self: AnnotationCampaign, info):
        return UserNode.resolve_queryset(
            User.objects.filter(
                Exists(
                    AnnotationFileRange.objects.filter(
                        annotation_phase__annotation_campaign_id=self.id,
                        annotator_id=OuterRef("id"),
                    )
                )
            ),
            info,
        )

    labels_with_acoustic_features = graphene.List(AnnotationLabelNode)

    @graphene_django_optimizer.resolver_hints()
    def resolve_labels_with_acoustic_features(self: AnnotationCampaign, info):
        """Resolve featured labels"""
        return self.labels_with_acoustic_features.all()

    spectrograms_count = graphene.Int(required=True)

    @graphene_django_optimizer.resolver_hints()
    def resolve_spectrograms_count(self: AnnotationCampaign, info):
        return (
            Spectrogram.objects.filter(analysis__annotation_campaigns=self)
            .distinct()
            .count()
        )

    @classmethod
    def resolve_queryset(cls, queryset: QuerySet, info: GraphQLResolveInfo):
        # pylint: disable=duplicate-code
        return (
            super()
            .resolve_queryset(queryset, info)
            .distinct()
            .select_related("dataset")
            .prefetch_related("phases")
            .annotate(
                dataset_name=F("dataset__name"),
                is_archived=ExpressionWrapper(
                    Q(archive__isnull=False),
                    output_field=models.BooleanField(),
                ),
                can_manage=ExpressionWrapper(
                    Q(archive__isnull=True)
                    & (
                        Q()
                        if info.context.user.is_staff or info.context.user.is_superuser
                        else Q(owner_id=info.context.user.id)
                    ),
                    output_field=models.BooleanField(),
                ),
                tasks_count=Coalesce(  # 0.03774690628051758 + 0.0019426345825195312
                    Subquery(
                        AnnotationFileRange.objects.filter(
                            annotation_phase__annotation_campaign_id=OuterRef("pk"),
                        )
                        .annotate(sum=Func(F("files_count"), function="Sum"))
                        .values("sum")
                    ),
                    Value(0),
                ),
                user_tasks_count=Coalesce(
                    Subquery(
                        AnnotationFileRange.objects.filter(
                            annotation_phase__annotation_campaign_id=OuterRef("pk"),
                            annotator_id=info.context.user.id,
                        )
                        .annotate(sum=Func(F("files_count"), function="Sum"))
                        .values("sum")
                    ),
                    Value(0),
                ),
                completed_tasks_count=Subquery(
                    AnnotationTask.objects.filter(
                        annotation_phase__annotation_campaign_id=OuterRef("pk"),
                        status=AnnotationTask.Status.FINISHED,
                    )
                    .annotate(count=Func(F("id"), function="count"))
                    .values("count")
                ),
                user_completed_tasks_count=Subquery(
                    AnnotationTask.objects.filter(
                        annotation_phase__annotation_campaign_id=OuterRef("pk"),
                        status=AnnotationTask.Status.FINISHED,
                        annotator_id=info.context.user.id,
                    )
                    .annotate(count=Func(F("id"), function="count"))
                    .values("count")
                ),
            )
        )

import graphene
import graphene_django_optimizer
from django.db.models import (
    Exists,
    OuterRef,
    QuerySet,
    F,
    Subquery,
    Func,
    Value,
)
from django.db.models.functions import Coalesce
from django_extension.schema.fields import AuthenticatedPaginationConnectionField
from django_extension.schema.types import ExtendedNode
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
from .__abstract_permission import AbstractPermissionNode
from .annotation_phase import AnnotationPhaseNode
from .detector import DetectorNode
from .label import AnnotationLabelNode


class AnnotationCampaignNode(AbstractPermissionNode, ExtendedNode):
    """AnnotationCampaign schema"""

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

    phases = AuthenticatedPaginationConnectionField(AnnotationPhaseNode)

    @graphene_django_optimizer.resolver_hints()
    def resolve_phases(self: AnnotationCampaign, info, **kwargs):
        return AnnotationPhaseNode.resolve_queryset(self.phases.all(), info)

    detectors = graphene.List(DetectorNode)

    @graphene_django_optimizer.resolver_hints()
    def resolve_detectors(self: AnnotationCampaign, info):
        return Detector.objects.filter(
            configurations__annotations__annotation_phase__in=self.phases.all()
        ).distinct()

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
            .order_by()
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
            .prefetch_related("phases")
            .annotate(
                dataset_name=F("dataset__name"),
                tasks_count=Coalesce(
                    Subquery(
                        AnnotationFileRange.objects.filter(
                            annotation_phase__annotation_campaign_id=OuterRef("pk"),
                        )
                        .order_by()
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
                        .order_by()
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
                    .order_by()
                    .annotate(count=Func(F("id"), function="count"))
                    .values("count")
                ),
                user_completed_tasks_count=Subquery(
                    AnnotationTask.objects.filter(
                        annotation_phase__annotation_campaign_id=OuterRef("pk"),
                        status=AnnotationTask.Status.FINISHED,
                        annotator_id=info.context.user.id,
                    )
                    .order_by()
                    .annotate(count=Func(F("id"), function="count"))
                    .values("count")
                ),
            )
        )

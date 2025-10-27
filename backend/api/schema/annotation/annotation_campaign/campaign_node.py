import graphene_django_optimizer
from django.db.models import (
    Q,
    QuerySet,
    ExpressionWrapper,
    F,
    CharField,
    Count,
    BooleanField,
    Value,
    Case,
    When,
    Exists,
    OuterRef,
)
from django_filters import CharFilter, OrderingFilter, BooleanFilter
from graphene import Field, String, Boolean, List, Int
from graphene_django.filter import TypedFilter
from graphql import GraphQLResolveInfo

from backend.api.models import AnnotationCampaign, AnnotationFileRange
from backend.api.schema.enums import AnnotationPhaseType
from backend.aplose.models import User
from backend.aplose.schema.user import UserNode
from backend.utils.schema.filters import BaseFilterSet
from backend.utils.schema.types import BaseObjectType, BaseNode
from .campaign_context_filter import AnnotationCampaignContextFilter
from ..annotation_phase.phase_node import AnnotationPhaseNode
from ..detector.node import DetectorNode
from ..label.label_node import AnnotationLabelNode
from ...archive import ArchiveNode


class AnnotationCampaignFilter(BaseFilterSet):
    """AnnotationCampaign filters"""

    archive = ArchiveNode()

    is_archived = BooleanFilter(
        field_name="archive", lookup_expr="isnull", exclude=True
    )
    phases__phase = TypedFilter(
        input_type=AnnotationPhaseType,
        field_name="phases__phase",
        lookup_expr="exact",
    )
    search = CharFilter(method="search_filter", label="search")

    class Meta:
        # pylint: disable=missing-class-docstring, too-few-public-methods
        model = AnnotationCampaign
        fields = {
            "phases__annotation_file_ranges__annotator_id": ("exact",),
            "owner_id": ("exact",),
        }

    order_by = OrderingFilter(fields=("name",))

    def search_filter(self, queryset, name, value):
        # pylint: disable=unused-argument
        """Search an AnnotationCampaign"""
        return queryset.filter(
            Q(name__icontains=value) | Q(dataset__name__icontains=value)
        )


class AnnotationCampaignNode(BaseObjectType):
    """AnnotationCampaign schema"""

    phases = List(AnnotationPhaseNode)

    dataset_name = Field(String, required=True)
    is_archived = Field(Boolean, required=True)

    detectors = List(
        DetectorNode, source="phases__annotations__detector_configuration__detector"
    )
    files_count = Int(required=True)

    can_manage = Field(Boolean, required=True, default_value=False)

    class Meta:
        # pylint: disable=missing-class-docstring, too-few-public-methods
        model = AnnotationCampaign
        fields = "__all__"
        filterset_class = AnnotationCampaignFilter
        context_filter = AnnotationCampaignContextFilter
        interfaces = (BaseNode,)

    annotators = List(UserNode)

    @graphene_django_optimizer.resolver_hints()
    def resolve_annotators(self: AnnotationCampaign, info):
        return User.objects.filter(
            Exists(
                AnnotationFileRange.objects.filter(
                    annotation_phase__annotation_campaign_id=self.id,
                    annotator_id=OuterRef("id"),
                )
            )
        )

    labels_with_acoustic_features = List(AnnotationLabelNode)

    @graphene_django_optimizer.resolver_hints()
    def resolve_labels_with_acoustic_features(self: AnnotationCampaign, info):
        """Resolve featured labels"""
        return self.labels_with_acoustic_features.all()

    @classmethod
    def resolve_queryset(cls, queryset: QuerySet, info: GraphQLResolveInfo):
        return (
            super()
            .resolve_queryset(queryset, info)
            .annotate(
                dataset_name=ExpressionWrapper(
                    F("dataset__name"), output_field=CharField()
                ),
                files_count=Count("analysis__spectrograms", distinct=True),
                is_archived=ExpressionWrapper(
                    ~Q(archive_id=None), output_field=BooleanField()
                ),
                can_manage=ExpressionWrapper(
                    Q(archive__isnull=True)
                    & (
                        Q(owner_id=info.context.user.id)
                        | Value(info.context.user.is_staff)
                        | Value(info.context.user.is_superuser)
                    ),
                    output_field=BooleanField(default=False),
                ),
            )
        )

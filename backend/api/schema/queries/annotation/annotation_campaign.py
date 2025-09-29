"""AnnotationCampaign schema"""
import graphene_django_optimizer
from django.db.models import (
    QuerySet,
    Q,
    ExpressionWrapper,
    CharField,
    F,
    BooleanField,
    Value,
)
from django_filters import (
    FilterSet,
    BooleanFilter,
    OrderingFilter,
    CharFilter,
)
from graphene import relay, ObjectType, Field, String, Boolean
from graphene_django.filter import TypedFilter
from graphql import GraphQLResolveInfo

from backend.api.models import (
    AnnotationCampaign,
)
from backend.aplose.schema.user import UserNode
from backend.utils.schema import (
    ApiObjectType,
    AuthenticatedDjangoConnectionField,
    GraphQLPermissions,
    GraphQLResolve,
    PKFilter,
    PK,
)
from .annotation_phase import AnnotationPhaseNode, AnnotationPhaseType
from .detector import DetectorNode
from .label import AnnotationLabelNode
from ..data.spectrogram_analysis import SpectrogramAnalysisNode
from ...context_filters import AnnotationCampaignContextFilter


class AnnotationCampaignFilter(FilterSet):
    """AnnotationCampaign filters"""

    annotator_pk = PKFilter(field_name="phases__annotation_file_ranges__annotator_id")
    owner_pk = PKFilter(field_name="owner_id")
    is_archived = BooleanFilter(
        field_name="archive", lookup_expr="isnull", exclude=True
    )
    phase_type = TypedFilter(
        input_type=AnnotationPhaseType,
        field_name="phases__phase",
        lookup_expr="exact",
    )
    search = CharFilter(method="search_filter", label="search")

    class Meta:
        # pylint: disable=missing-class-docstring, too-few-public-methods
        model = AnnotationCampaign
        fields = {}

    order_by = OrderingFilter(fields=("name",))

    def search_filter(self, queryset, name, value):
        # pylint: disable=unused-argument
        """Search an AnnotationCampaign"""
        return queryset.filter(
            Q(name__icontains=value) | Q(dataset__name__icontains=value)
        )


class AnnotationCampaignNode(ApiObjectType):
    """AnnotationCampaign schema"""

    dataset_name = Field(String, required=True)
    is_archived = Field(Boolean, required=True)

    phases = AuthenticatedDjangoConnectionField(AnnotationPhaseNode)
    analysis = AuthenticatedDjangoConnectionField(SpectrogramAnalysisNode)
    labels_with_acoustic_features = AuthenticatedDjangoConnectionField(
        AnnotationLabelNode
    )
    detectors = AuthenticatedDjangoConnectionField(
        DetectorNode, source="phases__annotations__detector_configuration__detector"
    )
    annotators = AuthenticatedDjangoConnectionField(
        UserNode, source="phases__file_ranges__annotator"
    )

    can_manage = Field(Boolean, required=True)

    class Meta:
        # pylint: disable=missing-class-docstring, too-few-public-methods
        model = AnnotationCampaign
        fields = "__all__"
        filterset_class = AnnotationCampaignFilter
        interfaces = (relay.Node,)

    @classmethod
    def get_queryset(
        cls, queryset: QuerySet[AnnotationCampaign], info: GraphQLResolveInfo
    ):
        queryset = AnnotationCampaignContextFilter.get_queryset(info.context)
        return graphene_django_optimizer.query(
            queryset.select_related("dataset").annotate(
                dataset_name=ExpressionWrapper(
                    F("dataset__name"), output_field=CharField()
                ),
                is_archived=ExpressionWrapper(
                    ~Q(archive_id=None), output_field=BooleanField()
                ),
                can_manage=ExpressionWrapper(
                    Q(owner_id=info.context.user.id)
                    | Value(info.context.user.is_staff)
                    | Value(info.context.user.is_superuser),
                    output_field=BooleanField(),
                ),
            ),
            info,
        )


class AnnotationCampaignQuery(ObjectType):  # pylint: disable=too-few-public-methods
    """AnnotationCampaign queries"""

    all_annotation_campaigns = AuthenticatedDjangoConnectionField(
        AnnotationCampaignNode
    )

    annotation_campaign_by_pk = Field(AnnotationCampaignNode, pk=PK(required=True))

    @GraphQLResolve(permission=GraphQLPermissions.AUTHENTICATED)
    def resolve_annotation_campaign_by_pk(self, info, pk: int):
        """Get AnnotationCampaign by id"""
        return AnnotationCampaignNode.get_node(info, pk)

"""AnnotationPhase schema"""
import graphene_django_optimizer
from django.db.models import QuerySet, Q, Count
from django_filters import FilterSet, OrderingFilter, BooleanFilter, CharFilter
from graphene import relay, Boolean, Int, ObjectType, Field, Enum, NonNull
from graphene_django.filter import TypedFilter
from graphql import GraphQLResolveInfo

from backend.api.models import AnnotationPhase, AnnotationTask
from backend.api.schema.context_filters import AnnotationPhaseContextFilter
from backend.utils.schema import (
    ApiObjectType,
    GraphQLResolve,
    GraphQLPermissions,
    AuthenticatedDjangoConnectionField,
    PK,
    PKFilter,
)


class AnnotationPhaseType(Enum):
    """From AnnotationPhase.Type"""

    Annotation = "A"
    Verification = "V"


class AnnotationPhaseFilter(FilterSet):
    """AnnotationPhase filters"""

    is_campaign_archived = BooleanFilter(
        field_name="annotation_campaign__archive", lookup_expr="isnull", exclude=True
    )
    campaign_pk = PKFilter(field_name="annotation_campaign_id")
    campaign_owner_pk = PKFilter(field_name="annotation_campaign__owner_id")

    annotator_pk = PKFilter(field_name="annotation_file_ranges__annotator_id")

    phase_type = TypedFilter(
        input_type=AnnotationPhaseType,
        field_name="phase",
        lookup_expr="exact",
    )
    search = CharFilter(method="search_filter", label="search")

    class Meta:
        # pylint: disable=missing-class-docstring, too-few-public-methods
        model = AnnotationPhase
        fields = {}

    order_by = OrderingFilter(fields=("phase",))

    def search_filter(self, queryset, name, value):
        # pylint: disable=unused-argument
        """Search an AnnotationPhase"""
        return queryset.filter(
            Q(annotation_campaign__name__icontains=value)
            | Q(annotation_campaign__dataset__name__icontains=value)
        )


class AnnotationPhaseNode(ApiObjectType):
    """AnnotationPhase schema"""

    annotation_campaign_pk = Field(Int, source="annotation_campaign_id", required=True)

    phase = NonNull(AnnotationPhaseType)

    is_completed = Boolean(required=True)
    is_open = Boolean(required=True)
    has_annotations = Boolean(required=True)

    tasks_count = Int(required=True)
    completed_tasks_count = Int(required=True)

    user_tasks_count = Int(required=True)
    user_completed_tasks_count = Int(required=True)

    class Meta:
        # pylint: disable=missing-class-docstring, too-few-public-methods
        model = AnnotationPhase
        fields = "__all__"
        filterset_class = AnnotationPhaseFilter
        interfaces = (relay.Node,)

    @classmethod
    def get_queryset(
        cls, queryset: QuerySet[AnnotationPhase], info: GraphQLResolveInfo
    ):
        queryset = AnnotationPhaseContextFilter.get_queryset(info.context)
        return graphene_django_optimizer.query(
            queryset.annotate(
                tasks_count=Count("annotation_tasks", distinct=True),
                completed_tasks_count=Count(
                    "annotation_tasks",
                    filter=Q(annotation_tasks__status=AnnotationTask.Status.FINISHED),
                    distinct=True,
                ),
                user_tasks_count=Count(
                    "annotation_tasks",
                    filter=Q(annotation_tasks__annotator_id=info.context.user.id),
                    distinct=True,
                ),
                user_completed_tasks_count=Count(
                    "annotation_tasks",
                    filter=Q(
                        annotation_tasks__annotator_id=info.context.user.id,
                        annotation_tasks__status=AnnotationTask.Status.FINISHED,
                    ),
                    distinct=True,
                ),
            ),
            info,
        )


class AnnotationPhaseQuery(ObjectType):  # pylint: disable=too-few-public-methods
    """AnnotationPhase queries"""

    all_annotation_phases = AuthenticatedDjangoConnectionField(AnnotationPhaseNode)

    annotation_phase_for_campaign = Field(
        AnnotationPhaseNode,
        campaign_id=PK(required=True),
        phase_type=AnnotationPhaseType(required=True),
    )

    @GraphQLResolve(permission=GraphQLPermissions.AUTHENTICATED)
    def resolve_annotation_campaign_by_id(
        self, info, campaign_id: int, phase_type: AnnotationPhaseType
    ):
        """Get AnnotationCampaign by id"""
        return AnnotationPhase.objects.get(
            annotation_campaign_id=campaign_id,
            phase=phase_type.value,
        )

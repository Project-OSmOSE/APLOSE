"""AnnotationPhase schema"""
from django_filters import FilterSet, OrderingFilter
from graphene import relay, Boolean, Int, ID, ObjectType, Field, Enum

from backend.api.models import AnnotationPhase
from backend.utils.schema import (
    ApiObjectType,
    GraphQLResolve,
    GraphQLPermissions,
    AuthenticatedDjangoConnectionField,
)


class AnnotationPhaseType(Enum):
    """From AnnotationPhase.Type"""

    Annotation = "A"
    Verification = "V"


class AnnotationPhaseFilter(FilterSet):
    """AnnotationPhase filters"""

    class Meta:
        # pylint: disable=missing-class-docstring, too-few-public-methods
        model = AnnotationPhase
        fields = {}

    order_by = OrderingFilter(fields=("phase",))


class AnnotationPhaseNode(ApiObjectType):
    """AnnotationPhase schema"""

    phase = AnnotationPhaseType()

    is_completed = Boolean()
    has_annotations = Boolean()

    tasks_count = Int()
    completed_tasks_count = Int()

    user_tasks_count = Int()
    user_completed_tasks_count = Int()

    class Meta:
        # pylint: disable=missing-class-docstring, too-few-public-methods
        model = AnnotationPhase
        fields = "__all__"
        filterset_class = AnnotationPhaseFilter
        interfaces = (relay.Node,)

    # @classmethod
    # def get_queryset(
    #     cls, queryset: QuerySet[AnnotationPhase], info: GraphQLResolveInfo
    # ):
    #     return (
    #         graphene_django_optimizer.query(
    #             queryset.prefetch_related("annotations", "annotation_tasks",).annotate(
    #                 has_annotations=Q(annotations__isnull=False),
    #                 tasks_count=Count("annotation_tasks", distinct=True),
    #                 completed_tasks_count=Count(
    #                     "annotation_tasks",
    #                     filter=Q(
    #                         annotation_tasks__status=AnnotationTask.Status.FINISHED
    #                     ),
    #                     distinct=True,
    #                 ),
    #                 user_tasks_count=Count(
    #                     "annotation_tasks",
    #                     filter=Q(annotation_tasks__annotator_id=info.context.user.id),
    #                     distinct=True,
    #                 ),
    #                 user_completed_tasks_count=Count(
    #                     "annotation_tasks",
    #                     filter=Q(
    #                         annotation_tasks__annotator_id=info.context.user.id,
    #                         annotation_tasks__status=AnnotationTask.Status.FINISHED,
    #                     ),
    #                     distinct=True,
    #                 ),
    #             ),
    #             info,
    #         )
    #     )


class AnnotationPhaseQuery(ObjectType):  # pylint: disable=too-few-public-methods
    """AnnotationPhase queries"""

    all_annotation_phases = AuthenticatedDjangoConnectionField(AnnotationPhaseNode)

    annotation_phase_for_campaign = Field(
        AnnotationPhaseNode,
        campaign_id=ID(required=True),
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

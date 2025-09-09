"""AnnotationCampaign schema"""
import graphene_django_optimizer
from django.db import models
from django.db.models import QuerySet, Count, Q, Case, When, F, Value
from django.db.models.functions import Now
from django_filters import (
    FilterSet,
    BooleanFilter,
    OrderingFilter,
    CharFilter,
)
from graphene import relay, ObjectType, Int, Field, String, Boolean
from graphene_django.filter import TypedFilter
from graphql import GraphQLResolveInfo

from backend.api.models import (
    AnnotationCampaign,
    AnnotationTask,
)
from backend.aplose.schema import UserNode
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


class AnnotationCampaignFilter(FilterSet):
    """AnnotationCampaign filters"""

    annotator_id = PKFilter(field_name="phases__annotation_file_ranges__annotator_id")
    owner_id = PKFilter()
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

    tasks_count = Int()
    finished_tasks_count = Int()

    user_tasks_count = Int()
    user_finished_tasks_count = Int()

    state = String()

    is_edit_allowed = Boolean()

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
        return graphene_django_optimizer.query(
            queryset.prefetch_related(
                "phases",
                "phases__annotation_tasks",
                "archive",
            )
            .annotate(
                tasks_count=Count("phases__annotation_tasks", distinct=True),
                finished_tasks_count=Count(
                    "phases__annotation_tasks",
                    filter=Q(
                        phases__annotation_tasks__status=AnnotationTask.Status.FINISHED
                    ),
                    distinct=True,
                ),
                user_tasks_count=Count(
                    "phases__annotation_tasks",
                    filter=Q(
                        phases__annotation_tasks__annotator_id=info.context.user.id
                    ),
                    distinct=True,
                ),
                user_finished_tasks_count=Count(
                    "phases__annotation_tasks",
                    filter=Q(
                        phases__annotation_tasks__annotator_id=info.context.user.id,
                        phases__annotation_tasks__status=AnnotationTask.Status.FINISHED,
                    ),
                    distinct=True,
                ),
            )
            .annotate(
                state=Case(
                    When(archive__isnull=False, then=Value("Archived")),
                    When(finished_tasks_count=F("tasks_count"), then=Value("Finished")),
                    When(deadline__lte=Now(), then=Value("Due date")),
                    default=Value("Open"),
                    output_field=models.CharField(
                        choices=["Archived", "Finished", "Due date", "Open"]
                    ),
                ),
                is_edit_allowed=Case(
                    When(archive__isnull=False, then=Value(False)),
                    When(owner_id=info.context.user.id),
                    default=Value(
                        info.context.user.is_staff or info.context.user.is_superuser
                    ),
                    output_field=models.BooleanField(),
                ),
            ),
            info,
        )


class AnnotationCampaignQuery(ObjectType):  # pylint: disable=too-few-public-methods
    """AnnotationCampaign queries"""

    all_annotation_campaigns = AuthenticatedDjangoConnectionField(
        AnnotationCampaignNode
    )

    annotation_campaign_by_id = Field(AnnotationCampaignNode, id=PK(required=True))

    @GraphQLResolve(permission=GraphQLPermissions.AUTHENTICATED)
    def resolve_annotation_campaign_by_id(
        self, info, id: int
    ):  # pylint: disable=redefined-builtin
        """Get AnnotationCampaign by id"""
        return AnnotationCampaignNode.get_node(info, id)

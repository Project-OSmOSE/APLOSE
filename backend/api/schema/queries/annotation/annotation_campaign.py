"""AnnotationCampaign schema"""
from django.db import models
from django.db.models import QuerySet, Count, Q, Case, When, F, Value
from django.db.models.functions import Now
from django_filters import (
    FilterSet,
    NumberFilter,
    BooleanFilter,
    ChoiceFilter,
    OrderingFilter,
    CharFilter,
)
from graphene import relay, ObjectType, Int, ID, Field, String, Boolean
from graphql import GraphQLResolveInfo

from backend.api.models import (
    AnnotationCampaign,
    AnnotationTask,
    AnnotationPhase,
)
from backend.aplose.schema import UserNode
from backend.utils.schema import (
    ApiObjectType,
    AuthenticatedDjangoConnectionField,
    GraphQLPermissions,
    GraphQLResolve,
)
from .annotation_phase import AnnotationPhaseNode
from .detector import DetectorNode
from .label import AnnotationLabelNode
from ..data.spectrogram_analysis import SpectrogramAnalysisNode


class AnnotationCampaignFilter(FilterSet):
    """AnnotationCampaign filters"""

    annotator_id = NumberFilter(
        field_name="phases__annotation_file_ranges__annotator_id", lookup_expr="exact"
    )
    owner_id = NumberFilter(lookup_expr="exact")
    is_archived = BooleanFilter(
        field_name="archive", lookup_expr="isnull", exclude=True
    )
    phase_type = ChoiceFilter(
        field_name="phases__phase",
        choices=AnnotationPhase.Type.choices,
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

    user_tasks_count = Int(id=ID())
    user_finished_tasks_count = Int(id=ID())

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

        fields = cls._get_query_fields(info)

        cls._init_queryset_extensions()
        annotate_state = False
        annotate_is_edit_allowed = False
        for field in fields:
            if field.name.value in ["state", "tasksCount"]:
                cls.annotations = {
                    **cls.annotations,
                    "tasks_count": Count("phases__annotation_tasks", distinct=True),
                }
                cls.prefetch.append("phases__annotation_tasks")

            if field.name.value in ["state", "finishedTasksCount"]:
                cls.annotations = {
                    **cls.annotations,
                    "finished_tasks_count": Count(
                        "phases__annotation_tasks",
                        filter=Q(
                            phases__annotation_tasks__status=AnnotationTask.Status.FINISHED
                        ),
                        distinct=True,
                    ),
                }
                cls.prefetch.append("phases__annotation_tasks")

            if field.name.value == "userTasksCount":
                arguments = cls._get_argument(info, "userTasksCount")
                cls.annotations = {
                    **cls.annotations,
                    "user_tasks_count": Count(
                        "phases__annotation_tasks",
                        filter=Q(
                            phases__annotation_tasks__annotator_id=arguments.get("id")
                        ),
                        distinct=True,
                    ),
                }
                cls.prefetch.append("phases__annotation_tasks")

            if field.name.value == "userFinishedTasksCount":
                arguments = cls._get_argument(info, "userFinishedTasksCount")
                cls.annotations = {
                    **cls.annotations,
                    "user_finished_tasks_count": Count(
                        "phases__annotation_tasks",
                        filter=Q(
                            phases__annotation_tasks__annotator_id=arguments.get("id"),
                            phases__annotation_tasks__status=AnnotationTask.Status.FINISHED,
                        ),
                        distinct=True,
                    ),
                }
                cls.prefetch.append("phases__annotation_tasks")

            if field.name.value == "state":
                annotate_state = True
                cls.select.append("archive")
            if field.name.value == "isEditAllowed":
                annotate_is_edit_allowed = True
                cls.select.append("archive")

        qs = cls._finalize_queryset(
            super().get_queryset(
                AnnotationCampaign.objects.filter_user_access(info.context.user), info
            )
        )
        if annotate_state:
            qs = qs.annotate(
                state=Case(
                    When(archive__isnull=False, then=Value("Archived")),
                    When(finished_tasks_count=F("tasks_count"), then=Value("Finished")),
                    When(deadline__lte=Now(), then=Value("Due date")),
                    default=Value("Open"),
                    output_field=models.CharField(
                        choices=["Archived", "Finished", "Due date", "Open"]
                    ),
                ),
            )

        if annotate_is_edit_allowed:
            qs = qs.annotate(
                is_edit_allowed=Case(
                    When(archive__isnull=False, then=Value(False)),
                    When(owner_id=info.context.user.id),
                    default=Value(
                        info.context.user.is_staff or info.context.user.is_superuser
                    ),
                    output_field=models.BooleanField(),
                ),
            )
        return qs


class AnnotationCampaignQuery(ObjectType):  # pylint: disable=too-few-public-methods
    """AnnotationCampaign queries"""

    all_annotation_campaigns = AuthenticatedDjangoConnectionField(
        AnnotationCampaignNode
    )

    annotation_campaign_by_id = Field(AnnotationCampaignNode, id=ID(required=True))

    @GraphQLResolve(permission=GraphQLPermissions.AUTHENTICATED)
    def resolve_annotation_campaign_by_id(
        self, info, id: int
    ):  # pylint: disable=redefined-builtin
        """Get AnnotationCampaign by id"""
        return AnnotationCampaignNode.get_node(info, id)

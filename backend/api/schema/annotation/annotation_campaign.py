"""AnnotationCampaign schema"""
from django.db.models import QuerySet, Count, Q, Exists, OuterRef
from django_filters import (
    FilterSet,
    NumberFilter,
    BooleanFilter,
    ChoiceFilter,
    OrderingFilter,
    CharFilter,
)
from graphene import relay, ObjectType, Int, ID
from graphql import GraphQLResolveInfo

from backend.api.models import (
    AnnotationCampaign,
    AnnotationTask,
    AnnotationPhase,
    AnnotationFileRange,
)
from backend.utils.schema import ApiObjectType, AuthenticatedDjangoConnectionField
from .annotation_phase import AnnotationPhaseNode


class AnnotationCampaignFilter(FilterSet):
    """Dataset filters"""

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

    tasks_count = Int()
    finished_tasks_count = Int()

    user_tasks_count = Int(id=ID())
    user_finished_tasks_count = Int(id=ID())

    class Meta:
        # pylint: disable=missing-class-docstring, too-few-public-methods
        model = AnnotationCampaign
        fields = "__all__"
        filterset_class = AnnotationCampaignFilter
        interfaces = (relay.Node,)

    @classmethod
    def filter_queryset(cls, queryset: QuerySet, info: GraphQLResolveInfo):
        print(
            "filter",
            info.context.user,
            info.context.user.is_staff,
            info.context.user.is_superuser,
        )
        if info.context.user.is_staff or info.context.user.is_superuser:
            return queryset
        return queryset.filter(
            Q(owner_id=info.context.user.id)
            | (
                Q(archive__isnull=True)
                & Exists(
                    AnnotationFileRange.objects.filter(
                        annotation_phase__annotation_campaign_id=OuterRef("pk"),
                        annotator_id=info.context.user.id,
                    )
                )
            )
        )

    @classmethod
    def get_queryset(
        cls, queryset: QuerySet[AnnotationCampaign], info: GraphQLResolveInfo
    ):

        fields = cls._get_query_fields(info)

        cls._init_queryset_extensions()
        for field in fields:

            if field.name.value == "tasksCount":
                cls.annotations = {
                    **cls.annotations,
                    "tasks_count": Count("phases__annotation_tasks", distinct=True),
                }
                cls.prefetch.append("phases__annotation_tasks")

            if field.name.value == "finishedTasksCount":
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
                print("userTasksCount", arguments)
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
                print("userFinishedTasksCount", arguments)
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

        return cls._finalize_queryset(super().get_queryset(queryset, info))


class AnnotationCampaignQuery(ObjectType):  # pylint: disable=too-few-public-methods
    """AnnotationCampaign queries"""

    all_annotation_campaigns = AuthenticatedDjangoConnectionField(
        AnnotationCampaignNode
    )

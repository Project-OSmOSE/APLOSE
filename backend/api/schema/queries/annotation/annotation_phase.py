"""AnnotationPhase schema"""
from django.db import models
from django.db.models import QuerySet, Count, Q, When, Case, F, Value
from django_filters import FilterSet, OrderingFilter
from graphene import relay, Scalar, Boolean, Int, ID, ObjectType, Field
from graphql import GraphQLResolveInfo
from graphql.language import ast

from backend.api.models import AnnotationPhase, AnnotationTask
from backend.utils.schema import (
    ApiObjectType,
    GraphQLResolve,
    GraphQLPermissions,
    AuthenticatedDjangoConnectionField,
)


class PhaseTypeEnum(Scalar):
    # pylint: disable=missing-class-docstring

    @staticmethod
    def serialize(value):
        """Serialize enum"""
        return AnnotationPhase.Type(value).label

    @staticmethod
    def parse_literal(node, _variables=None):
        """Parse literal"""
        if isinstance(node, ast.StringValueNode):
            index = AnnotationPhase.Type.labels.index(node.value)
            value = AnnotationPhase.Type.values[index]
            return AnnotationPhase.Type(value)
        return None

    @staticmethod
    def parse_value(value):
        """Parse value"""
        index = AnnotationPhase.Type.labels.index(value)
        value = AnnotationPhase.Type.values[index]
        return AnnotationPhase.Type(value)


class AnnotationPhaseFilter(FilterSet):
    """AnnotationPhase filters"""

    class Meta:
        # pylint: disable=missing-class-docstring, too-few-public-methods
        model = AnnotationPhase
        fields = {}

    order_by = OrderingFilter(fields=("phase",))


class AnnotationPhaseNode(ApiObjectType):
    """AnnotationPhase schema"""

    phase = PhaseTypeEnum()

    is_completed = Boolean()
    has_annotations = Boolean()

    tasks_count = Int()
    completed_tasks_count = Int()

    user_tasks_count = Int(id=ID())
    user_completed_tasks_count = Int(id=ID())

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

        fields = cls._get_query_fields(info)

        cls._init_queryset_extensions()
        annotate_is_completed = False
        for field in fields:
            if field.name.value == "isCompleted":
                annotate_is_completed = True

            if field.name.value == "hasAnnotations":
                cls.annotations = {
                    **cls.annotations,
                    "has_annotations": Q(annotations__isnull=False),
                }
                cls.prefetch.append("annotations")

            if field.name.value in ["isCompleted", "tasksCount"]:
                cls.annotations = {
                    **cls.annotations,
                    "tasks_count": Count("annotation_tasks", distinct=True),
                }
                cls.prefetch.append("annotation_tasks")

            if field.name.value in ["isCompleted", "completedTasksCount"]:
                cls.annotations = {
                    **cls.annotations,
                    "completed_tasks_count": Count(
                        "annotation_tasks",
                        filter=Q(
                            annotation_tasks__status=AnnotationTask.Status.FINISHED
                        ),
                        distinct=True,
                    ),
                }
                cls.prefetch.append("annotation_tasks")

            if field.name.value == "userTasksCount":
                arguments = cls._get_argument(info, "userTasksCount")
                print("userTasksCount", arguments)
                cls.annotations = {
                    **cls.annotations,
                    "user_tasks_count": Count(
                        "annotation_tasks",
                        filter=Q(annotation_tasks__annotator_id=arguments.get("id")),
                        distinct=True,
                    ),
                }
                cls.prefetch.append("annotation_tasks")

            if field.name.value == "userCompletedTasksCount":
                arguments = cls._get_argument(info, "userCompletedTasksCount")
                cls.annotations = {
                    **cls.annotations,
                    "user_completed_tasks_count": Count(
                        "annotation_tasks",
                        filter=Q(
                            annotation_tasks__annotator_id=arguments.get("id"),
                            annotation_tasks__status=AnnotationTask.Status.FINISHED,
                        ),
                        distinct=True,
                    ),
                }
                cls.prefetch.append("annotation_tasks")

        qs = cls._finalize_queryset(super().get_queryset(queryset, info))
        if annotate_is_completed:
            qs = qs.annotate(
                is_completed=Case(
                    When(finished_tasks_count=F("tasks_count"), then=Value(1)),
                    default=Value(0),
                    output_field=models.BooleanField(),
                ),
            )
        return qs


class AnnotationPhaseQuery(ObjectType):  # pylint: disable=too-few-public-methods
    """AnnotationPhase queries"""

    all_annotation_phases = AuthenticatedDjangoConnectionField(AnnotationPhaseNode)

    annotation_phase_for_campaign = Field(
        AnnotationPhaseNode,
        campaign_id=ID(required=True),
        phase_type=PhaseTypeEnum(required=True),
    )

    @GraphQLResolve(permission=GraphQLPermissions.AUTHENTICATED)
    def resolve_annotation_campaign_by_id(
        self, info, campaign_id: int, phase_type: AnnotationPhase.Type
    ):
        """Get AnnotationCampaign by id"""
        return AnnotationPhase.objects.get(
            annotation_campaign_id=campaign_id,
            phase=phase_type,
        )

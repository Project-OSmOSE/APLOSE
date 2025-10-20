from django.db.models import Q, QuerySet, Count, ExpressionWrapper, Value, BooleanField
from django_filters import BooleanFilter, CharFilter, OrderingFilter
from graphene import Field, Int, NonNull, Boolean, Enum, ID
from graphene_django.filter import TypedFilter
from graphql import GraphQLResolveInfo

from backend.api.models import AnnotationPhase, AnnotationTask
from backend.utils.schema.filters import BaseFilterSet
from backend.utils.schema.types import BaseObjectType, BaseNode


class AnnotationPhaseType(Enum):
    """From AnnotationPhase.Type"""

    Annotation = "A"
    Verification = "V"


class AnnotationPhaseFilter(BaseFilterSet):
    """AnnotationPhase filters"""

    is_campaign_archived = BooleanFilter(
        field_name="annotation_campaign__archive", lookup_expr="isnull", exclude=True
    )

    phase = TypedFilter(
        input_type=AnnotationPhaseType,
        field_name="phase",
        lookup_expr="exact",
    )
    search = CharFilter(method="search_filter", label="search")

    class Meta:
        # pylint: disable=missing-class-docstring, too-few-public-methods
        model = AnnotationPhase
        fields = {
            "annotation_campaign_id": ("exact",),
            "annotation_campaign__owner_id": ("exact",),
            "annotation_file_ranges__annotator_id": ("exact",),
        }

    order_by = OrderingFilter(fields=("phase",))

    def search_filter(self, queryset, name, value):
        # pylint: disable=unused-argument
        """Search an AnnotationPhase"""
        return queryset.filter(
            Q(annotation_campaign__name__icontains=value)
            | Q(annotation_campaign__dataset__name__icontains=value)
        )


class AnnotationPhaseNode(BaseObjectType):
    """AnnotationPhase schema"""

    annotation_campaign_id = Field(ID, source="annotation_campaign_id", required=True)

    phase = NonNull(AnnotationPhaseType)

    is_completed = Boolean(required=True)
    is_open = Boolean(required=True)
    has_annotations = Boolean(required=True)

    tasks_count = Int(required=True)
    completed_tasks_count = Int(required=True)

    user_tasks_count = Int(required=True)
    user_completed_tasks_count = Int(required=True)

    can_manage = Field(Boolean, required=True)

    class Meta:
        # pylint: disable=missing-class-docstring, too-few-public-methods
        model = AnnotationPhase
        fields = "__all__"
        filterset_class = AnnotationPhaseFilter
        interfaces = (BaseNode,)

    @classmethod
    def resolve_queryset(cls, queryset: QuerySet, info: GraphQLResolveInfo):
        return (
            super()
            .resolve_queryset(queryset, info)
            .annotate(
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
                can_manage=ExpressionWrapper(
                    Q(ended_by__isnull=True, annotation_campaign__archive__isnull=True)
                    & (
                        Q(annotation_campaign__owner_id=info.context.user.id)
                        | Value(info.context.user.is_staff)
                        | Value(info.context.user.is_superuser)
                    ),
                    output_field=BooleanField(),
                ),
            )
        )

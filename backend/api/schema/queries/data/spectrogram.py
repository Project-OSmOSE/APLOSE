"""Spectrogram schema"""
from django.db.models import QuerySet, Case, When, Value, Exists, Subquery, OuterRef, Q
from django_filters import FilterSet, OrderingFilter, CharFilter, BooleanFilter
from graphene import relay, ObjectType, Int, String, Decimal
from graphene_django.filter import GlobalIDFilter
from graphql import GraphQLResolveInfo

from backend.api.models import (
    Spectrogram,
    AnnotationTask,
    AnnotationFileRange,
    AnnotationPhase,
    Annotation,
)
from backend.utils.schema import ApiObjectType, AuthenticatedDjangoConnectionField
from ..annotation.annotation import AnnotationNode
from ..annotation.annotation_task import AnnotationTaskNode, TaskStatusEnum


class SpectrogramFilter(FilterSet):
    """Spectrogram filters"""

    campaign_id = GlobalIDFilter(
        field_name="analysis__annotation_campaigns__id",
        lookup_expr="exact",
    )
    phase_type = CharFilter(method="fake_filter")
    annotator_id = GlobalIDFilter(method="fake_filter")

    is_task_completed = BooleanFilter(method="fake_filter")
    has_annotations = BooleanFilter(method="fake_filter")
    annotated_by_annotator = GlobalIDFilter(method="fake_filter")
    annotated_by_detector = GlobalIDFilter(method="fake_filter")
    annotated_with_label = CharFilter(method="fake_filter")
    annotated_with_confidence = CharFilter(method="fake_filter")
    annotated_with_features = BooleanFilter(method="fake_filter")

    class Meta:
        # pylint: disable=missing-class-docstring, too-few-public-methods
        model = Spectrogram
        fields = {
            "start": ["exact", "lt", "lte", "gt", "gte"],
            "end": ["exact", "lt", "lte", "gt", "gte"],
        }

    order_by = OrderingFilter(fields=("start",))

    def fake_filter(self, queryset, name, value):
        """Fake filter method - Filter is directly used in the filter_queryset method"""
        return queryset

    def filter_queryset(self, queryset):
        compatible_file_ranges = AnnotationFileRange.objects.all()
        compatible_tasks = AnnotationTask.objects.all()
        compatible_annotations = Annotation.objects.all()

        f = Q()
        if self.data.get("campaign_id"):
            f &= Q(
                annotation_phase__annotation_campaign_id=self.data.get("campaign_id")
            )
        if self.data.get("phase_type"):
            f &= Q(
                annotation_phase__phase=AnnotationPhase.Type.values[
                    AnnotationPhase.Type.labels.index(self.data.get("phase_type"))
                ]
            )
        compatible_annotations = compatible_annotations.filter(f)
        if self.data.get("annotator_id"):
            f &= Q(annotator_id=self.data.get("annotator_id"))

        compatible_file_ranges = compatible_file_ranges.filter(f)
        compatible_tasks = compatible_tasks.filter(f)

        if self.data.get("is_task_completed"):
            queryset = queryset.filter(
                Exists(
                    Subquery(
                        compatible_tasks.filter(
                            spectrogram_id=OuterRef("id"),
                            status=AnnotationTask.Status.FINISHED,
                        )
                    )
                )
            )
        if self.data.get("has_annotations") is not None:
            if self.data.get("has_annotations"):
                queryset = queryset.filter(Exists(Subquery(compatible_annotations)))
            else:
                queryset = queryset.filter(~Exists(Subquery(compatible_annotations)))
        if self.data.get("annotated_by_annotator"):
            queryset = queryset.filter(
                Exists(
                    Subquery(
                        compatible_annotations.filter(
                            annotator_id=OuterRef("annotated_by_annotator"),
                        )
                    )
                )
            )
        if self.data.get("annotated_by_detector"):
            queryset = queryset.filter(
                Exists(
                    Subquery(
                        compatible_annotations.filter(
                            detector_configuration__detector_id=OuterRef(
                                "annotated_by_detector"
                            ),
                        )
                    )
                )
            )
        if self.data.get("annotated_with_label"):
            queryset = queryset.filter(
                Exists(
                    Subquery(
                        compatible_annotations.filter(
                            label__name=OuterRef("annotated_with_label"),
                        )
                    )
                )
            )
        if self.data.get("annotated_with_confidence"):
            queryset = queryset.filter(
                Exists(
                    Subquery(
                        compatible_annotations.filter(
                            confidence__label=OuterRef("annotated_with_confidence"),
                        )
                    )
                )
            )
        if self.data.get("annotated_with_features") is not None:
            f = Q(acoustic_features__isnull=self.data.get("annotated_with_features"))
            if self.data.get("annotated_with_features"):
                queryset = queryset.filter(
                    ~Exists(Subquery(compatible_annotations.filter(f)))
                )
            else:
                queryset = queryset.filter(
                    Exists(Subquery(compatible_annotations.filter(f)))
                )

        queryset = queryset.filter(
            Exists(
                Subquery(
                    compatible_file_ranges.filter(
                        from_datetime__lte=OuterRef("start"),
                        to_datetime__gte=OuterRef("end"),
                    )
                )
            )
        )

        return super().filter_queryset(queryset)


class SpectrogramNode(ApiObjectType):
    """Spectrogram schema"""

    annotations = AuthenticatedDjangoConnectionField(AnnotationNode)
    annotation_tasks = AuthenticatedDjangoConnectionField(AnnotationTaskNode)

    task_status = TaskStatusEnum(
        campaign_id=Decimal(required=True),
        annotator_id=Decimal(required=True),
        phase_type=String(required=True),
    )

    duration = Int()

    class Meta:
        # pylint: disable=missing-class-docstring, too-few-public-methods
        model = Spectrogram
        fields = "__all__"
        filterset_class = SpectrogramFilter
        interfaces = (relay.Node,)

    @classmethod
    def get_queryset(cls, queryset: QuerySet[Spectrogram], info: GraphQLResolveInfo):
        fields = cls._get_query_fields(info)

        cls._init_queryset_extensions()
        for field in fields:
            if field.name.value == "taskStatus":
                args = cls._get_argument(info, "taskStatus")
                cls.annotations = {
                    **cls.annotations,
                    "task_status": Case(
                        When(
                            annotation_tasks__annotation_phase__annotation_campaign_id=args.get(
                                "campaign_id"
                            ),
                            annotation_tasks__annotator_id=args.get("annotator_id"),
                            annotation_tasks__annotation_phase__phase=args.get(
                                "phase_type"
                            ),
                            annotation_tasks__status=AnnotationTask.Status.FINISHED,
                            then=Value(AnnotationTask.Status.FINISHED),
                        ),
                        default=Value(AnnotationTask.Status.CREATED),
                    ),
                }
                cls.prefetch.append("annotation_tasks")
                cls.prefetch.append("annotation_tasks__annotation_phase")

        return cls._finalize_queryset(super().get_queryset(queryset, info))


class SpectrogramQuery(ObjectType):  # pylint: disable=too-few-public-methods
    """Spectrogram queries"""

    all_spectrograms = AuthenticatedDjangoConnectionField(SpectrogramNode)

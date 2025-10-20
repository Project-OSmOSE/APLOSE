import graphene
import graphene_django_optimizer
from django.db.models import Q, QuerySet, Exists, F, Subquery, OuterRef
from django_filters import BooleanFilter, CharFilter, OrderingFilter
from graphene import Enum, Int, ID
from graphene_django_pagination import PaginationConnection
from graphql import GraphQLResolveInfo

from backend.api.models import (
    AnnotationTask,
    AnnotationFileRange,
    Annotation,
    Spectrogram,
)
from backend.utils.schema import AuthenticatedDjangoConnectionField
from backend.utils.schema.filters import IDFilter, BaseFilterSet
from backend.utils.schema.types import BaseObjectType, BaseNode
from ..annotation.annotation_node import AnnotationNode
from ..annotation_comment.comment_node import AnnotationCommentNode


class AnnotationTaskStatus(Enum):
    """From AnnotationTask.Status"""

    Created = "C"
    Finished = "F"


class AnnotationTaskFilter(BaseFilterSet):
    """Annotation filters"""

    annotations__exists = BooleanFilter(method="fake_filter")
    annotations__confidence__label = CharFilter(method="fake_filter")
    annotations__label_name = CharFilter(method="fake_filter")
    annotations__acoustic_features__exists = BooleanFilter(method="fake_filter")
    annotations__detector = IDFilter(method="fake_filter")
    annotations__annotator = IDFilter(method="fake_filter")

    spectrogram_min__id = IDFilter(method="filter_spectrogram_min__id")
    spectrogram_max__id = IDFilter(method="filter_spectrogram_max__id")

    class Meta:
        # pylint: disable=missing-class-docstring, too-few-public-methods
        model = AnnotationTask
        fields = {
            "annotator": ("exact",),
            "status": ("exact",),
            "spectrogram__filename": ("icontains",),
            "spectrogram__start": ("lte",),
            "spectrogram__end": ("gte",),
        }

    order_by = OrderingFilter(fields=("start",))

    def filter_spectrogram_min__id(
        self, queryset: QuerySet[AnnotationTask], name, value
    ):
        return queryset.filter(
            spectrogram__start__gt=Spectrogram.objects.get(pk=value).start
        )

    def filter_spectrogram_max__id(
        self, queryset: QuerySet[AnnotationTask], name, value
    ):
        return queryset.filter(
            spectrogram__start__lt=Spectrogram.objects.get(pk=value).start
        )

    def fake_filter(self, queryset, name, value):
        """Fake filter method - Filter is directly used in the filter_queryset method"""
        return queryset

    def filter_queryset(self, queryset):

        if self.data.get("annotations__exists") is not None:
            compatible_annotations = Annotation.objects.all()

            if self.data.get("annotations__label_name"):
                compatible_annotations = compatible_annotations.filter(
                    label__name=self.data.get("annotations__label_name")
                )
            if self.data.get("annotations__confidence__label"):
                compatible_annotations = compatible_annotations.filter(
                    confidence__label=self.data.get("annotations__confidence__label")
                )
            if self.data.get("annotations__acoustic_features__exists"):
                compatible_annotations = compatible_annotations.filter(
                    acoustic_features__isnull=not self.data.get(
                        "annotations__acoustic_features__exists"
                    )
                )
            if self.data.get("annotations__detector"):
                compatible_annotations = compatible_annotations.filter(
                    detector_configuration__detector_id=self.data.get(
                        "annotations__detector"
                    )
                )
            if self.data.get("annotations__annotator"):
                compatible_annotations = compatible_annotations.filter(
                    annotator_id=self.data.get("annotations__annotator")
                )

            f = Exists(
                Subquery(
                    compatible_annotations.filter(
                        annotation_phase_id=OuterRef("annotation_phase_id"),
                        spectrogram_id=OuterRef("spectrogram_id"),
                    )
                )
            )
            if self.data.get("annotations__exists"):
                queryset = queryset.filter(f)
            else:
                queryset = queryset.filter(~f)

        return super().filter_queryset(queryset)


class AnnotationTaskNode(BaseObjectType):
    """AnnotationTask schema"""

    class Meta:
        # pylint: disable=missing-class-docstring, too-few-public-methods
        model = AnnotationTask
        fields = "__all__"
        filterset_class = AnnotationTaskFilter
        interfaces = (BaseNode,)

    status = AnnotationTaskStatus(required=True)
    is_assigned = graphene.Boolean(required=True)

    annotations = AuthenticatedDjangoConnectionField(AnnotationNode)

    @graphene_django_optimizer.resolver_hints()
    def resolve_annotations(self: AnnotationTask, info):
        """Linked annotations"""
        return self.annotations

    validated_annotations = AuthenticatedDjangoConnectionField(AnnotationNode)

    @graphene_django_optimizer.resolver_hints()
    def resolve_validated_annotations(self: AnnotationTask, info):
        """Count of annotations"""
        return self.annotations.filter(
            Q(annotator_id=self.annotator_id)
            | Q(
                validations__annotator_id=self.annotator_id,
                is_update_of__validations__is_valid=True,
            )
        )

    @classmethod
    def resolve_queryset(cls, queryset: QuerySet, info: GraphQLResolveInfo):
        return (
            super()
            .resolve_queryset(queryset, info)
            .annotate(
                is_assigned=Exists(
                    AnnotationFileRange.objects.filter(
                        annotator_id=F("annotator_id"),
                        annotation_phase_id=F("annotation_phase_id"),
                        from_datetime__lte=F("spectrogram__start"),
                        to_datetime__gte=F("spectrogram__end"),
                    )
                )
            )
        )

    comments = AuthenticatedDjangoConnectionField(AnnotationCommentNode)

    @graphene_django_optimizer.resolver_hints()
    def resolve_comments(self: AnnotationTask, info):
        """Linked comments"""
        return self.spectrogram.annotation_comments.filter(
            annotation_phase=self.annotation_phase
        )


class ResumeConnectionField(AuthenticatedDjangoConnectionField):
    @property
    def type(self):
        class NodeConnection(PaginationConnection):
            total_count = Int()
            resume_spectrogram_id = ID()
            previous_spectrogram_id = ID(spectrogram_id=ID())
            next_spectrogram_id = ID(spectrogram_id=ID())
            current_index = Int(spectrogram_id=ID())

            class Meta:
                node = self._type
                name = "{}NodeConnection".format(self._type._meta.name)

            def resolve_total_count(self, info, **kwargs):
                return self.iterable.count()

            def resolve_resume_task_id(self, info, **kwargs):
                resume = self.iterable.filter(status="C").first()
                return resume.spectrogram_id if resume else None

            def resolve_previous_spectrogram_id(
                self, info, spectrogram_id: int, **kwargs
            ):
                current_spectrogram = Spectrogram.objects.get(pk=spectrogram_id)
                spectrograms = Spectrogram.objects.filter(
                    id__in=[task.spectrogram_id for task in self.iterable]
                )

                previous: Spectrogram = spectrograms.filter(
                    Q(start__lt=current_spectrogram.start)
                    | Q(start=current_spectrogram.start, id__lt=current_spectrogram.id)
                ).last()
                return previous.id if previous else None

            def resolve_next_spectrogram_id(self, info, spectrogram_id: int, **kwargs):
                current_spectrogram = Spectrogram.objects.get(pk=spectrogram_id)
                spectrograms = Spectrogram.objects.filter(
                    id__in=[task.spectrogram_id for task in self.iterable]
                )

                next: Spectrogram = spectrograms.filter(
                    Q(start__gt=current_spectrogram.start)
                    | Q(start=current_spectrogram.start, id__gt=current_spectrogram.id)
                ).first()
                return next.id if next else None

            def resolve_current_index(self, info, spectrogram_id: int):
                current_spectrogram = Spectrogram.objects.get(pk=spectrogram_id)
                spectrograms = Spectrogram.objects.filter(
                    id__in=[task.spectrogram_id for task in self.iterable]
                )
                return spectrograms.filter(
                    Q(start__lt=current_spectrogram.start)
                    | Q(start=current_spectrogram.start, id__lt=current_spectrogram.id)
                ).count()

        return NodeConnection


class AnnotationTaskIndexesNode(graphene.ObjectType):

    current = graphene.Int()
    total = graphene.Int()

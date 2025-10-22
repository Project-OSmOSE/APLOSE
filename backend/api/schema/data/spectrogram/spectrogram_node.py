import graphene_django_optimizer
from django.conf import settings
from django.db.models import Exists, Subquery, OuterRef, QuerySet, Count, Q
from django_filters import OrderingFilter, BooleanFilter, CharFilter
from graphene import Int, String, ID
from graphene_django.filter import TypedFilter
from graphql import GraphQLResolveInfo
from osekit.core_api.spectro_dataset import SpectroDataset

from backend.api.models import (
    Spectrogram,
    AnnotationFileRange,
    AnnotationTask,
    Annotation,
    AnnotationPhase,
    SpectrogramAnalysis,
)
from backend.api.schema.enums import AnnotationPhaseType, AnnotationTaskStatus
from backend.utils.schema.filters import BaseFilterSet, IDFilter
from backend.utils.schema.types import BaseObjectType, BaseNode


class SpectrogramFilter(BaseFilterSet):
    """Spectrogram filters"""

    campaign_id = IDFilter(field_name="analysis__annotation_campaigns__id")
    phase_type = TypedFilter(input_type=AnnotationPhaseType, method="fake_filter")
    annotator_id = IDFilter(method="fake_filter")

    is_task_completed = BooleanFilter(method="fake_filter")
    has_annotations = BooleanFilter(method="fake_filter")
    annotated_by_annotator = IDFilter(method="fake_filter")
    annotated_by_detector = IDFilter(method="fake_filter")
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


class SpectrogramNode(BaseObjectType):
    """Spectrogram schema"""

    task_status = AnnotationTaskStatus(
        campaign_id=ID(required=True),
        annotator_id=ID(required=True),
        phase_type=AnnotationPhaseType(required=True),
    )

    path = String(analysis_id=ID(required=True), required=True)
    audio_path = String(analysis_id=ID(required=True), required=True)

    duration = Int(required=True)
    annotation_count = Int(required=True)
    validated_annotation_count = Int(
        campaign_id=ID(required=True),
        annotator_id=ID(required=True),
    )

    class Meta:
        # pylint: disable=missing-class-docstring, too-few-public-methods
        model = Spectrogram
        fields = "__all__"
        filterset_class = SpectrogramFilter
        interfaces = (BaseNode,)

    @graphene_django_optimizer.resolver_hints(
        prefetch_related=(
            "annotation_tasks",
            "annotation_tasks__annotation_phase",
        ),
    )
    def resolve_task_status(
        root, info, campaign_id: int, annotator_id: int, phase_type: AnnotationPhaseType
    ):
        task = root.annotation_tasks.get(
            annotation_phase__annotation_campaign_id=campaign_id,
            annotator_id=annotator_id,
            annotation_phase__phase=phase_type.value,
        )
        return task.status if task is not None else AnnotationTask.Status.CREATED

    @graphene_django_optimizer.resolver_hints()
    def resolve_path(root, info, analysis_id: int):
        analysis: SpectrogramAnalysis = root.analysis.get(id=analysis_id)

        if analysis.dataset.legacy:
            folder = f"{analysis.fft.nfft}_{analysis.fft.window_size}_{analysis.fft.overlap*100}"
            if analysis.legacy_configuration is not None:
                if analysis.legacy_configuration.linear_frequency_scale is not None:
                    folder = f"{folder}_{analysis.legacy_configuration.linear_frequency_scale.name}"
                if (
                    analysis.legacy_configuration.multi_linear_frequency_scale
                    is not None
                ):
                    folder = f"{folder}_{analysis.legacy_configuration.multi_linear_frequency_scale.name}"
            return (
                settings.STATIC_URL
                / analysis.dataset.path
                / settings.DATASET_SPECTRO_FOLDER
                / analysis.dataset.get_config_folder()
                / folder
                / f"{root.filename}.{root.format.name}"
            )
        else:
            spectro_dataset: SpectroDataset = analysis.get_osekit_spectro_dataset()
            spectro_dataset_path = str(spectro_dataset.folder).split("\\dataset\\")[1]
            return (
                settings.STATIC_URL
                / settings.DATASET_EXPORT_PATH
                / spectro_dataset_path
                / "spectrogram"
                / f"{root.filename}.{root.format.name}"
            )

    @graphene_django_optimizer.resolver_hints()
    def resolve_audio_path(root, info, analysis_id: int):
        analysis: SpectrogramAnalysis = root.analysis.get(id=analysis_id)

        if analysis.dataset.legacy:
            return (
                settings.STATIC_URL
                / analysis.dataset.path
                / settings.DATASET_FILES_FOLDER
                / analysis.dataset.get_config_folder()
                / f"{root.filename}.wav"
            )
        else:
            spectro_dataset: SpectroDataset = analysis.get_osekit_spectro_dataset()
            audio_path = str(
                spectro_dataset.data[root.filename].audio_data.files[0].path
            ).split("\\dataset\\")[1]
            return settings.STATIC_URL / settings.DATASET_EXPORT_PATH / audio_path

    @graphene_django_optimizer.resolver_hints(
        prefetch_related=(
            "annotation_tasks",
            "annotation_tasks__annotation_phase",
        ),
    )
    def resolve_validated_annotation_count(
        root: Spectrogram, info, campaign_id: int, annotator_id: int
    ):
        return root.annotations.filter(
            annotation_phase__annotation_campaign_id=campaign_id,
            annotator_id=annotator_id,
        ).count()

    @classmethod
    def resolve_queryset(cls, queryset: QuerySet, info: GraphQLResolveInfo):
        return (
            super()
            .resolve_queryset(queryset, info)
            .annotate(annotation_count=Count("annotations"))
        )

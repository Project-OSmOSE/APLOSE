"""Spectrogram schema"""
import graphene_django_optimizer
from django.conf import settings
from django.db.models import Exists, Subquery, OuterRef, Q
from django_filters import FilterSet, OrderingFilter, CharFilter, BooleanFilter
from graphene import relay, ObjectType, Int, Field, String, Boolean
from graphene_django.filter import TypedFilter
from graphql import GraphQLResolveInfo
from osekit.core_api.spectro_dataset import SpectroDataset
from rest_framework.request import Request

from backend.api.models import (
    Spectrogram,
    AnnotationTask,
    AnnotationFileRange,
    AnnotationPhase,
    Annotation,
    SpectrogramAnalysis,
)
from backend.api.schema.enums import AnnotationTaskStatus
from backend.api.view.annotation.annotation_file_range import (
    AnnotationFileRangeFilesFilter,
)
from backend.utils.schema import (
    ApiObjectType,
    AuthenticatedDjangoConnectionField,
    GraphQLResolve,
    GraphQLPermissions,
    PKFilter,
    PK,
)
from ..annotation.annotation import AnnotationNode
from ..annotation.annotation_phase import AnnotationPhaseType


class SpectrogramFilter(FilterSet):
    """Spectrogram filters"""

    campaign_id = PKFilter(field_name="analysis__annotation_campaigns__id")
    phase_type = TypedFilter(input_type=AnnotationPhaseType, method="fake_filter")
    annotator_id = PKFilter(method="fake_filter")

    is_task_completed = BooleanFilter(method="fake_filter")
    has_annotations = BooleanFilter(method="fake_filter")
    annotated_by_annotator = PKFilter(method="fake_filter")
    annotated_by_detector = PKFilter(method="fake_filter")
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
    # annotation_tasks = AuthenticatedDjangoConnectionField(AnnotationTaskNode)

    task_status = AnnotationTaskStatus(
        campaign_id=PK(required=True),
        annotator_id=PK(required=True),
        phase_type=AnnotationPhaseType(required=True),
    )

    path = String(analysis_id=PK(required=True), required=True)
    audio_path = String(analysis_id=PK(required=True), required=True)

    duration = Int(required=True)

    class Meta:
        # pylint: disable=missing-class-docstring, too-few-public-methods
        model = Spectrogram
        fields = "__all__"
        filterset_class = SpectrogramFilter
        interfaces = (relay.Node,)

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


class PrevNextNode(ObjectType):
    previous_id = PK()
    next_id = PK()


class SpectrogramQuery(ObjectType):  # pylint: disable=too-few-public-methods
    """Spectrogram queries"""

    all_spectrograms = AuthenticatedDjangoConnectionField(SpectrogramNode)

    spectrogram_by_id = Field(SpectrogramNode, id=PK(required=True))

    spectrogram_prev_next = Field(
        PrevNextNode,
        campaign_id=PK(required=True),
        annotator_id=PK(required=True),
        spectrogram_id=PK(required=True),
        phase_type=AnnotationPhaseType(required=True),
        filename__icontain=String(name="filename__icontain"),
        is_submitted=Boolean(name="is_submitted"),
        with_user_annotations=Boolean(name="with_user_annotations"),
        label__name=String(name="label__name"),
        confidence_indicator__label=String(name="confidence_indicator__label"),
        detector_configuration__detector__name=String(
            name="detector_configuration__detector__name"
        ),
        acoustic_features__isnull=Boolean(name="acoustic_features__isnull"),
        end__gte=String(name="end__gte"),
        start__lte=String(name="start__lte"),
    )

    @GraphQLResolve(permission=GraphQLPermissions.AUTHENTICATED)
    def resolve_spectrogram_by_id(
        self, info, id: int
    ):  # pylint: disable=redefined-builtin
        """Get AnnotationCampaign by id"""
        return SpectrogramNode.get_node(info, id)

    @GraphQLResolve(permission=GraphQLPermissions.AUTHENTICATED)
    def resolve_spectrogram_prev_next(
        self,
        info: GraphQLResolveInfo,
        campaign_id: int,
        annotator_id: int,
        spectrogram_id: int,
        phase_type: AnnotationPhaseType,
        **kwargs,
    ):  # pylint: disable=redefined-builtin
        """Get AnnotationCampaign by id"""
        current_file: Spectrogram = Spectrogram.objects.get(id=spectrogram_id)
        phase: AnnotationPhase = AnnotationPhase.objects.get(
            annotation_campaign_id=campaign_id, phase=phase_type.value
        )

        file_ranges = AnnotationFileRange.objects.filter(
            annotation_phase_id=phase.id,
            annotator_id=annotator_id,
        )
        request: Request = info.context
        request._request.GET = kwargs
        filtered_files = AnnotationFileRangeFilesFilter().filter_queryset(
            request, file_ranges, self
        )
        previous_file: Spectrogram = filtered_files.filter(
            Q(start__lt=current_file.start)
            | Q(start=current_file.start, id__lt=current_file.id)
        ).last()
        next_file: Spectrogram = filtered_files.filter(
            Q(start__gt=current_file.start)
            | Q(start=current_file.start, id__gt=current_file.id)
        ).first()
        return {
            "previous_id": previous_file.id if previous_file is not None else None,
            "next_id": next_file.id if next_file is not None else None,
        }

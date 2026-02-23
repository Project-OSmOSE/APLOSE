from os import path
from pathlib import PureWindowsPath
from typing import Optional
import json

import graphene
import graphene_django_optimizer
from django.conf import settings
from django.utils import timezone
from graphql import GraphQLResolveInfo

# OSEkit imports - only needed for legacy datasets
try:
    from osekit.core_api.spectro_data import SpectroData
    from osekit.core_api.spectro_dataset import SpectroDataset
    OSEKIT_AVAILABLE = True
except ImportError:
    SpectroData = None
    SpectroDataset = None
    OSEKIT_AVAILABLE = False

from backend.api.models import (
    Spectrogram,
    AnnotationCampaign,
    AnnotationFileRange,
    AnnotationTask,
    SpectrogramAnalysis,
    AnnotationPhase,
)
from backend.api.schema.enums import AnnotationPhaseType
from backend.api.schema.filter_sets import AnnotationSpectrogramFilterSet
from backend.utils.schema import NotFoundError, AuthenticatedDjangoConnectionField
from backend.utils.schema.types import BaseObjectType, BaseNode, ModelContextFilter
from .annotation_comment import AnnotationCommentNode
from .annotation_task import AnnotationTaskNode


def get_task(
    spectrogram: Spectrogram,
    info: GraphQLResolveInfo,
    campaign_id: int,
    phase: AnnotationPhaseType,
) -> Optional[AnnotationTask]:
    try:
        return AnnotationTask.objects.get(
            spectrogram_id=spectrogram.id,
            annotator_id=info.context.user.id,
            annotation_phase__annotation_campaign_id=campaign_id,
            annotation_phase__phase=phase.value,
        )
    except AnnotationTask.DoesNotExist:
        return AnnotationTask(
            spectrogram_id=spectrogram.id,
            annotator_id=info.context.user.id,
            annotation_phase__annotation_campaign_id=campaign_id,
            annotation_phase__phase=phase.value,
        )


class AnnotationSpectrogramNode(BaseObjectType):

    duration = graphene.Float(required=True)
    annotation_comments = AuthenticatedDjangoConnectionField(AnnotationCommentNode)

    class Meta:
        model = Spectrogram
        fields = "__all__"
        filterset_class = AnnotationSpectrogramFilterSet
        interfaces = (BaseNode,)

    @classmethod
    def __init_subclass_with_meta__(
        cls,
        context_filter: Optional[ModelContextFilter.__class__] = None,
        model=None,
        _meta=None,
        **kwargs,
    ):
        super().__init_subclass_with_meta__(context_filter, model, _meta, **kwargs)

    is_assigned = graphene.Boolean(
        required=True,
        campaign_id=graphene.ID(required=True),
        phase=AnnotationPhaseType(required=True),
    )

    @graphene_django_optimizer.resolver_hints()
    def resolve_is_assigned(
        self: Spectrogram,
        info,
        campaign_id: int,
        phase: AnnotationPhaseType,
    ) -> bool:
        is_assigned = False
        has_access = False

        if info.context.user.is_staff or info.context.user.is_superuser:
            has_access = True
        if AnnotationCampaign.objects.get(pk=campaign_id).owner == info.context.user:
            has_access = True

        if AnnotationFileRange.objects.filter(
            annotator_id=info.context.user.id,
            annotation_phase__annotation_campaign_id=campaign_id,
            annotation_phase__phase=phase.value,
            from_datetime__lte=self.start,
            to_datetime__gte=self.end,
        ).exists():
            is_assigned = True
            has_access = True

        if not has_access:
            raise NotFoundError

        return is_assigned

    audio_path = graphene.String(analysis_id=graphene.ID(required=True))

    @graphene_django_optimizer.resolver_hints()
    def resolve_audio_path(self: Spectrogram, info, analysis_id: int):
        try:
            analysis: SpectrogramAnalysis = self.analysis.get(id=analysis_id)
        except SpectrogramAnalysis.DoesNotExist:
            # Analysis not linked to this spectrogram
            return None

        audio_path: str
        if analysis.dataset.legacy:
            folders = analysis.path.split("/")
            folders.pop()
            audio_path = path.join(
                analysis.dataset.path.split(
                    settings.DATASET_EXPORT_PATH.stem + "/"
                ).pop(),
                PureWindowsPath(settings.DATASET_FILES_FOLDER),
                PureWindowsPath(folders.pop()),
                PureWindowsPath(f"{self.filename}.wav"),
            )
        else:
            if not OSEKIT_AVAILABLE:
                # Simple NetCDF structure - look for corresponding WAV file
                # analysis.path points to the dataset folder, self.filename is the base name
                dataset_folder = settings.DATASET_IMPORT_FOLDER / analysis.path
                wav_path = dataset_folder / f"{self.filename}.wav"
                if wav_path.exists():
                    audio_path = str(wav_path.relative_to(settings.DATASET_IMPORT_FOLDER))
                    return path.join(
                        PureWindowsPath(settings.STATIC_URL),
                        PureWindowsPath(settings.DATASET_EXPORT_PATH),
                        PureWindowsPath(audio_path),
                    )
                return None
            else:
                spectro_data: SpectroData = self.get_spectro_data_for(analysis)
                audio_files = list(spectro_data.audio_data.files)
                if len(audio_files) != 1:
                    return None

                audio_file = audio_files[0]
                if audio_file.begin != (
                    self.start if audio_file.begin.tz else timezone.make_naive(self.start)
                ):
                    return None
                if audio_file.end < (
                    self.end if audio_file.end.tz else timezone.make_naive(self.end)
                ):
                    return None

                audio_path = str(audio_file.path)
                audio_path = (
                    audio_path.split(str(settings.DATASET_EXPORT_PATH)).pop().lstrip("\\")
                )
        return path.join(
            PureWindowsPath(settings.STATIC_URL),
            PureWindowsPath(settings.DATASET_EXPORT_PATH),
            PureWindowsPath(audio_path),
        )

    path = graphene.String(analysis_id=graphene.ID(required=True), required=True)
    is_netcdf = graphene.Boolean(required=True)
    netcdf_data = graphene.String(analysis_id=graphene.ID(required=True))

    @graphene_django_optimizer.resolver_hints()
    def resolve_is_netcdf(self: Spectrogram, info) -> bool:
        """Return whether this spectrogram is a NetCDF file"""
        return self.is_netcdf()

    @graphene_django_optimizer.resolver_hints()
    def resolve_netcdf_data(self: Spectrogram, info, analysis_id: int):
        """Return NetCDF data as JSON string"""
        try:
            analysis: SpectrogramAnalysis = self.analysis.get(id=analysis_id)
        except SpectrogramAnalysis.DoesNotExist:
            # Analysis not linked to this spectrogram
            return None

        data = self.get_netcdf_data(analysis)
        if data:
            return json.dumps(data)
        return None

    @graphene_django_optimizer.resolver_hints()
    def resolve_path(self: Spectrogram, info, analysis_id: int):
        try:
            analysis: SpectrogramAnalysis = self.analysis.get(id=analysis_id)
        except SpectrogramAnalysis.DoesNotExist:
            # Analysis not linked to this spectrogram - return a safe default
            return f"/static/dataset/{self.filename}.{self.format.name}"

        spectrogram_path: str
        if analysis.dataset.legacy:
            spectrogram_path = path.join(
                PureWindowsPath(
                    analysis.dataset.path.split(
                        settings.DATASET_EXPORT_PATH.stem + "/"
                    ).pop()
                ),
                PureWindowsPath(analysis.path),
                PureWindowsPath("image"),
                PureWindowsPath(f"{self.filename}.{self.format.name}"),
            )
        else:
            if not OSEKIT_AVAILABLE:
                if self.format.name == 'png':
                    # Data PNG format: path to the data PNG file
                    # Filename is base name, actual file is base_fft{nfft}_data.png
                    png_filename = f"{self.filename}_fft{analysis.nfft}_data.png"
                    spectrogram_path = path.join(analysis.path, png_filename)
                else:
                    # Simple NetCDF structure - NetCDF file is directly in dataset folder
                    netcdf_path = analysis.get_netcdf_path()
                    relative_path = netcdf_path.relative_to(settings.DATASET_IMPORT_FOLDER)
                    spectrogram_path = str(relative_path).replace('\\', '/')
            else:
                spectro_dataset: SpectroDataset = analysis.get_osekit_spectro_dataset()
                spectro_dataset_path = str(spectro_dataset.folder).split(
                    str(settings.DATASET_EXPORT_PATH)
                )[1]
                spectrogram_path = path.join(
                    PureWindowsPath(spectro_dataset_path),
                    PureWindowsPath("spectrogram"),  # TODO: avoid static path parts!!!
                    PureWindowsPath(f"{self.filename}.{self.format.name}"),
                ).lstrip("\\")
        return path.join(
            PureWindowsPath(settings.STATIC_URL),
            PureWindowsPath(settings.DATASET_EXPORT_PATH),
            PureWindowsPath(spectrogram_path),
        )

    task = graphene.Field(
        AnnotationTaskNode,
        campaign_id=graphene.ID(required=True),
        phase=AnnotationPhaseType(required=True),
    )

    def resolve_task(
        self: Spectrogram,
        info: GraphQLResolveInfo,
        campaign_id: int,
        phase: AnnotationPhaseType,
    ):
        try:
            return AnnotationTask.objects.get(
                spectrogram_id=self.id,
                annotator_id=info.context.user.id,
                annotation_phase__annotation_campaign_id=campaign_id,
                annotation_phase__phase=phase.value,
            )
        except AnnotationTask.DoesNotExist:
            return AnnotationTask(
                id=-1,
                status="C",
                spectrogram_id=self.id,
                annotator_id=info.context.user.id,
                annotation_phase=AnnotationPhase.objects.get(
                    annotation_campaign_id=campaign_id,
                    phase=phase.value,
                ),
            )

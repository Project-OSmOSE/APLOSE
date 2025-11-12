from os import path
from typing import Optional

import graphene
import graphene_django_optimizer
from django.conf import settings
from graphql import GraphQLResolveInfo
from osekit.core_api.spectro_dataset import SpectroDataset

from backend.api.models import (
    Spectrogram,
    AnnotationCampaign,
    AnnotationFileRange,
    AnnotationTask,
    SpectrogramAnalysis,
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
        return None


class AnnotationSpectrogramNode(BaseObjectType):

    duration = graphene.Int(required=True)
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

    audio_path = graphene.String(analysis_id=graphene.ID(required=True), required=True)

    @graphene_django_optimizer.resolver_hints()
    def resolve_audio_path(self: Spectrogram, info, analysis_id: int):
        print(self.__dict__, self.analysis.all())
        analysis: SpectrogramAnalysis = self.analysis.get(id=analysis_id)

        if analysis.dataset.legacy:
            return path.join(
                settings.STATIC_URL,
                analysis.dataset.path,
                settings.DATASET_FILES_FOLDER,
                analysis.dataset.get_config_folder(),
                f"{self.filename}.wav",
            )
        spectro_dataset: SpectroDataset = analysis.get_osekit_spectro_dataset()
        audio_path = str(
            spectro_dataset.data[self.filename].audio_data.files[0].path
        ).split("\\dataset\\")[1]
        return path.join(settings.STATIC_URL, settings.DATASET_EXPORT_PATH, audio_path)

    path = graphene.String(analysis_id=graphene.ID(required=True), required=True)

    @graphene_django_optimizer.resolver_hints()
    def resolve_path(self, info, analysis_id: int):
        analysis: SpectrogramAnalysis = self.analysis.get(id=analysis_id)

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
            return path.join(
                settings.STATIC_URL,
                analysis.dataset.path,
                settings.DATASET_SPECTRO_FOLDER,
                analysis.dataset.get_config_folder(),
                folder,
                f"{self.filename}.{self.format.name}",
            )
        spectro_dataset: SpectroDataset = analysis.get_osekit_spectro_dataset()
        spectro_dataset_path = str(spectro_dataset.folder).split("\\dataset\\")[1]
        return path.join(
            settings.STATIC_URL,
            settings.DATASET_EXPORT_PATH,
            spectro_dataset_path,
            "spectrogram",  # TODO: avoid static path parts!!!
            f"{self.filename}.{self.format.name}",
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
            return None

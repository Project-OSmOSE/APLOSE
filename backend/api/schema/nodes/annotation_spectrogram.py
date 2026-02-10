from os import path
from pathlib import PureWindowsPath
from typing import Optional

import graphene
import graphene_django_optimizer
from django.conf import settings
from django_extension.schema.errors import NotFoundError
from django_extension.schema.fields import AuthenticatedPaginationConnectionField
from django_extension.schema.types import ExtendedNode
from graphql import GraphQLResolveInfo

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


class AnnotationSpectrogramNode(ExtendedNode):

    duration = graphene.Int(required=True)
    annotation_comments = AuthenticatedPaginationConnectionField(AnnotationCommentNode)

    class Meta:
        model = Spectrogram
        fields = "__all__"
        filterset_class = AnnotationSpectrogramFilterSet

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
        analysis: SpectrogramAnalysis = self.analysis.get(id=analysis_id)
        return path.join(
            PureWindowsPath(settings.STATIC_URL),
            PureWindowsPath(settings.DATASET_EXPORT_PATH),
            PureWindowsPath(self.get_audio_path(analysis)),
        )

    path = graphene.String(analysis_id=graphene.ID(required=True), required=True)

    @graphene_django_optimizer.resolver_hints()
    def resolve_path(self: Spectrogram, info, analysis_id: int):
        analysis: SpectrogramAnalysis = self.analysis.get(id=analysis_id)
        return path.join(
            PureWindowsPath(settings.STATIC_URL),
            PureWindowsPath(settings.DATASET_EXPORT_PATH),
            PureWindowsPath(self.get_base_spectro_path(analysis)),
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

from typing import Optional

import graphene
import graphene_django_optimizer
from django.db.models import Q, QuerySet
from graphql import GraphQLResolveInfo

from backend.api.models import (
    Spectrogram,
    AnnotationCampaign,
    AnnotationFileRange,
    AnnotationTask,
    Annotation,
)
from backend.api.schema.enums import AnnotationPhaseType
from backend.utils.schema import NotFoundError, AuthenticatedDjangoConnectionField
from backend.utils.schema.types import BaseObjectType, BaseNode, ModelContextFilter
from .filterset import AnnotationSpectrogramFilterSet
from ..annotation.annotation_node import AnnotationNode
from ..annotation_comment.comment_node import AnnotationCommentNode
from ..annotation_task.task_node import AnnotationTaskStatus
from ...data.spectrogram import SpectrogramNode


class AnnotationSpectrogramNode(SpectrogramNode, BaseObjectType):

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
        **kwargs
    ):
        super().__init_subclass_with_meta__(context_filter, model, _meta, **kwargs)

    def _get_task(
        self, info: GraphQLResolveInfo, campaign_id: int, phase: AnnotationPhaseType
    ) -> Optional[AnnotationTask]:
        try:
            return AnnotationTask.objects.get(
                spectrogram_id=self.id,
                annotator_id=info.context.user.id,
                annotation_phase__annotation_campaign_id=campaign_id,
                annotation_phase__phase=phase.value,
            )
        except AnnotationTask.DoesNotExist:
            return None

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

    status = AnnotationTaskStatus(
        campaign_id=graphene.ID(required=True),
        phase=AnnotationPhaseType(required=True),
    )

    @graphene_django_optimizer.resolver_hints()
    def resolve_status(
        self: Spectrogram,
        info,
        campaign_id: int,
        phase: AnnotationPhaseType,
    ) -> Optional[AnnotationTaskStatus]:
        task = self._get_task(info, campaign_id, phase)
        return task.status if task else None

    annotations = AuthenticatedDjangoConnectionField(
        AnnotationNode,
        campaign_id=graphene.ID(required=True),
        phase=AnnotationPhaseType(required=True),
    )

    @graphene_django_optimizer.resolver_hints()
    def resolve_annotations(
        self: Spectrogram,
        info,
        campaign_id: int,
        phase: AnnotationPhaseType,
    ) -> Optional[QuerySet[Annotation]]:
        task = self._get_task(info, campaign_id, phase)
        return task.annotations if task else None

    validated_annotations = AuthenticatedDjangoConnectionField(
        AnnotationNode,
        campaign_id=graphene.ID(required=True),
        phase=AnnotationPhaseType(required=True),
    )

    @graphene_django_optimizer.resolver_hints()
    def resolve_validated_annotations(
        self: Spectrogram,
        info,
        campaign_id: int,
        phase: AnnotationPhaseType,
    ) -> Optional[QuerySet[Annotation]]:
        task = self._get_task(info, campaign_id, phase)
        return (
            task.annotations.filter(
                Q(annotator_id=info.context.user.id)
                | Q(
                    validations__annotator_id=info.context.user.id,
                    is_update_of__validations__is_valid=True,
                )
            )
            if task
            else None
        )

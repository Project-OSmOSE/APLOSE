import graphene
from django.db.models import Q

from backend.api.models import (
    AnnotationTask,
    Annotation,
    AnnotationComment,
    AnnotationPhase,
)
from backend.api.schema.enums import AnnotationTaskStatus
from backend.api.schema.filter_sets import AnnotationTaskFilterSet
from backend.utils.schema import AuthenticatedDjangoConnectionField
from backend.utils.schema.types import BaseObjectType, BaseNode
from .annotation import AnnotationNode
from .annotation_comment import AnnotationCommentNode


class AnnotationTaskNode(BaseObjectType):
    """AnnotationTask schema"""

    status = AnnotationTaskStatus(required=True)

    class Meta:
        model = AnnotationTask
        fields = "__all__"
        filterset_class = AnnotationTaskFilterSet
        interfaces = (BaseNode,)

    user_annotations = AuthenticatedDjangoConnectionField(AnnotationNode)
    user_comments = AuthenticatedDjangoConnectionField(AnnotationCommentNode)
    annotations_to_check = AuthenticatedDjangoConnectionField(AnnotationNode)

    def resolve_user_annotations(self: AnnotationTask, info, **kwargs):
        return Annotation.objects.filter(
            annotator_id=self.annotator_id,
            annotation_phase_id=self.annotation_phase_id,
            spectrogram_id=self.spectrogram_id,
        )

    def resolve_user_comments(self: AnnotationTask, info, **kwargs):
        return AnnotationComment.objects.filter(
            author_id=self.annotator_id,
            annotation_phase_id=self.annotation_phase_id,
            spectrogram_id=self.spectrogram_id,
        )

    def resolve_annotations_to_check(self: AnnotationTask, info, **kwargs):
        if self.annotation_phase.phase == AnnotationPhase.Type.ANNOTATION:
            return Annotation.objects.none()
        return Annotation.objects.filter(
            annotation_phase__annotation_campaign=self.annotation_phase.annotation_campaign,
            annotation_phase__phase=AnnotationPhase.Type.ANNOTATION,
            spectrogram_id=self.spectrogram_id,
        ).filter(~Q(annotator_id=self.annotator_id))

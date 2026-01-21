from django.db.models import Q
from django_extension.schema.fields import AuthenticatedPaginationConnectionField
from django_extension.schema.types import ExtendedNode

from backend.api.models import (
    AnnotationTask,
    Annotation,
    AnnotationComment,
    AnnotationPhase,
)
from backend.api.schema.enums import AnnotationTaskStatus
from backend.api.schema.filter_sets import AnnotationTaskFilterSet
from .annotation import AnnotationNode
from .annotation_comment import AnnotationCommentNode


class AnnotationTaskNode(ExtendedNode):
    """AnnotationTask schema"""

    status = AnnotationTaskStatus(required=True)

    class Meta:
        model = AnnotationTask
        fields = "__all__"
        filterset_class = AnnotationTaskFilterSet

    user_annotations = AuthenticatedPaginationConnectionField(AnnotationNode)
    user_comments = AuthenticatedPaginationConnectionField(AnnotationCommentNode)
    annotations_to_check = AuthenticatedPaginationConnectionField(AnnotationNode)

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
            annotation__isnull=True,
        )

    def resolve_annotations_to_check(self: AnnotationTask, info, **kwargs):
        if self.annotation_phase.phase == AnnotationPhase.Type.ANNOTATION:
            return Annotation.objects.none()
        return Annotation.objects.filter(
            annotation_phase__annotation_campaign=self.annotation_phase.annotation_campaign,
            annotation_phase__phase=AnnotationPhase.Type.ANNOTATION,
            spectrogram_id=self.spectrogram_id,
        ).filter(~Q(annotator_id=self.annotator_id))

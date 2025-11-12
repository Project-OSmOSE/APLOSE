import graphene

from backend.api.context_filters import (
    AnnotationPhaseContextFilter,
    AnnotationCommentContextFilter,
)
from backend.api.models import Spectrogram
from backend.api.schema.enums import AnnotationPhaseType
from backend.api.serializers import AnnotationCommentSerializer
from backend.utils.schema.mutations import ListSerializerMutation


class UpdateAnnotationCommentsMutation(ListSerializerMutation):
    class Input:
        campaign_id = graphene.ID(required=True)
        phase_type = AnnotationPhaseType(required=True)
        spectrogram_id = graphene.ID(required=True)
        annotation_id = graphene.ID()

    class Meta:
        serializer_class = AnnotationCommentSerializer
        only_fields = ("id", "comment")

    @classmethod
    def get_serializer_queryset(cls, root, info, **input):
        return AnnotationCommentContextFilter.get_edit_queryset(
            info.context,
            annotation_phase__annotation_campaign_id=input["campaign_id"],
            annotation_phase__phase=input["phase_type"].value,
            spectrogram_id=input["spectrogram_id"],
            author_id=info.context.user.id,
            annotation_id=input["annotation_id"]
            if input.get("annotation_id")
            else None,
            annotation__isnull=True
            if not input["annotation_id"]
            else None,  # Get only task comments
        )

    @classmethod
    def get_serializer_context(cls, root, info, **input):
        # pylint: disable=duplicate-code
        phase = AnnotationPhaseContextFilter.get_node_or_fail(
            info.context,
            annotation_campaign_id=input["campaign_id"],
            phase=input["phase_type"].value,
        )
        return {
            "user": info.context.user,
            "phase": phase,
            "spectrogram": Spectrogram.objects.get(pk=input["spectrogram_id"]),
            "annotation_id": input["annotation_id"],
        }

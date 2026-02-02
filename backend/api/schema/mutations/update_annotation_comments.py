import graphene
from django_extension.schema.mutations import ListSerializerMutation

from backend.api.models import Spectrogram, AnnotationPhase, AnnotationComment
from backend.api.schema.enums import AnnotationPhaseType
from backend.api.serializers import AnnotationCommentSerializer


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
        return AnnotationComment.objects.filter_editable_by(
            user=info.context.user,
            annotation_phase__annotation_campaign_id=input["campaign_id"],
            annotation_phase__phase=input["phase_type"].value,
            spectrogram_id=input["spectrogram_id"],
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
        phase = AnnotationPhase.objects.get_viewable_or_fail(
            info.context.user,
            annotation_campaign_id=input["campaign_id"],
            phase=input["phase_type"].value,
        )
        return {
            "user": info.context.user,
            "phase": phase,
            "spectrogram": Spectrogram.objects.get(pk=input["spectrogram_id"]),
            "annotation_id": input["annotation_id"],
        }

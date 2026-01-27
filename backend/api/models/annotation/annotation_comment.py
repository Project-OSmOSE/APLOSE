"""Annotation comment model"""

from django.conf import settings
from django.db import models
from django.db.models import Q, Exists, OuterRef

from backend.aplose.models import User
from backend.utils.managers import CustomQuerySet
from .annotation import Annotation
from ..data import Spectrogram


class AnnotationCommentQuerySet(CustomQuerySet):
    def filter_viewable_by(self, user: User, **kwargs):
        # pylint: disable=duplicate-code
        qs = super().filter_viewable_by(user, **kwargs)

        # Admin can view all comments
        if user.is_staff or user.is_superuser:
            return qs

        return qs.filter(
            # Campaign owner can view its comments
            Q(annotation_phase__annotation_campaign__owner_id=user.id)
            # Phase creator can view its comments
            | Q(annotation_phase__created_by_id=user.id)
            # Other can only view created comments from assigned annotations
            | Exists(
                Annotation.objects.filter_viewable_by(
                    user=user,
                    annotation_phase_id=OuterRef("annotation_phase_id"),
                    spectrogram_id=OuterRef("spectrogram_id"),
                )
            )
        )

    def filter_editable_by(self, user: User, **kwargs):
        # Comments can only be edited by its creator.
        return super().filter_viewable_by(user, **kwargs, author_id=user.id)


class AnnotationComment(models.Model):
    """
    This table contains comment of annotation result and task.
    """

    objects = models.Manager.from_queryset(AnnotationCommentQuerySet)()

    comment = models.CharField(max_length=255)
    annotation = models.ForeignKey(
        Annotation,
        on_delete=models.CASCADE,
        related_name="annotation_comments",
        null=True,
        blank=True,
        default=None,
    )
    annotation_phase = models.ForeignKey(
        "AnnotationPhase", on_delete=models.CASCADE, related_name="annotation_comments"
    )
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="annotation_comments",
    )
    spectrogram = models.ForeignKey(
        Spectrogram, on_delete=models.CASCADE, related_name="annotation_comments"
    )

    created_at = models.DateTimeField(auto_now_add=True)

"""Phase model manager"""
from django.core.exceptions import (
    ObjectDoesNotExist,
)
from django.db import models
from django.db.models import Q, Exists, OuterRef

from backend.api.models.annotation.annotation_file_range import AnnotationFileRange
from backend.aplose.models import User
from backend.utils.schema import ForbiddenError, NotFoundError


class AnnotationPhaseManager(models.Manager):
    def filter_viewable_by(self, user: User):
        # Admin can view all phases
        if user.is_staff or user.is_superuser:
            return self.all()

        return self.filter(
            # Campaign owner can view its phases
            Q(annotation_campaign__owner_id=user.id)
            |
            # Other can only view assigned open phase
            (
                Q(
                    annotation_campaign__archive__isnull=True,
                    ended_at__isnull=True,
                    ended_by__isnull=True,
                )  # Is open
                & Exists(
                    AnnotationFileRange.objects.filter(
                        annotation_phase_id=OuterRef("pk"),
                        annotator_id=user.id,
                    )  # Is assigned
                )
            )
        )

    def filter_editable_by(self, user: User):
        # Only open phases can be edited
        open_phases = self.filter(
            annotation_campaign__archive__isnull=True,
            ended_at__isnull=True,
            ended_by__isnull=True,
        )

        # Admin can edit all phases
        if user.is_staff or user.is_superuser:
            return open_phases

        # Campaign owner can edit its phases
        return open_phases.filter(annotation_campaign__owner_id=user.id)

    def get_viewable_or_fail(self, user: User, **kwargs):
        try:
            return self.filter_viewable_by(user).get(**kwargs)
        except ObjectDoesNotExist:
            raise NotFoundError()

    def get_editable_or_fail(self, user: User, **kwargs):
        self.get_viewable_or_fail(**kwargs)

        try:
            return self.filter_editable_by(user).get(**kwargs)
        except ObjectDoesNotExist:
            raise ForbiddenError()

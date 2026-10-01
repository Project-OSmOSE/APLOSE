from django.conf import settings
from django.core.exceptions import PermissionDenied
from django.db import models, transaction
from django.utils import timezone

from .__abstract_permission import AbstractPermission


class AbstractArchivable(AbstractPermission, models.Model):
    class Meta:
        abstract = True

    archived = models.BooleanField(default=False)
    archived_at = models.DateTimeField(null=True, blank=True)
    # pylint: disable=duplicate-code
    archived_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="archived",
    )

    @transaction.atomic
    def archive(self, user: "User"):
        if not self.has_change_permission(user):
            raise PermissionDenied()

        self.archived = True
        self.archived_at = timezone.now()
        self.archived_by = user
        self.save()

    @transaction.atomic
    def unarchive(self, user: "User"):
        if not self.has_change_permission(user):
            raise PermissionDenied()

        self.archived = False
        self.archived_at = None
        self.archived_by = None
        self.save()

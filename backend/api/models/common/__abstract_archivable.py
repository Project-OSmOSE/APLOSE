from typing import Optional

from django.conf import settings
from django.contrib.auth.models import Permission
from django.core.exceptions import PermissionDenied
from django.db import models, transaction
from django.utils import timezone


class AbstractArchivable(models.Model):
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
    def archive(self, user: "User", force: Optional[bool]):
        edit_permissions = Permission.objects.get(
            codename__startswith="change",
            content_type__app_label=self._meta.app_label,
            content_type__model=self._meta.model_name,
        )

        if not user.has_perm(edit_permissions) and not force:
            raise PermissionDenied()

        self.archived = True
        self.archived_at = timezone.now()
        self.archived_by = user
        self.save()

    @transaction.atomic
    def unarchive(self, user: "User"):
        edit_permissions = Permission.objects.get(
            codename__startswith="change",
            content_type__app_label=self._meta.app_label,
            content_type__model=self._meta.model_name,
        )

        if not user.has_perm(edit_permissions):
            raise PermissionDenied()

        self.archived = False
        self.archived_at = None
        self.archived_by = None
        self.save()

"""Abstract dataset model"""
from django.conf import settings
from django.contrib.auth.models import Permission
from django.contrib.auth.models import User
from django.core.exceptions import PermissionDenied
from django.db import models
from django.utils import timezone


class AbstractDataset(models.Model):
    """Abstract dataset"""

    class Meta:
        abstract = True

    def __str__(self):
        return self.name

    created_at = models.DateTimeField(auto_now_add=True)
    name = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    path = models.CharField(max_length=255)

    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    archived = models.BooleanField(default=False)
    archived_at = models.DateTimeField(null=True, blank=True)
    archived_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="archived_datasets"
    )

    # @deprecated("Do not use this field with the recent version of OSEkit")
    legacy = models.BooleanField(default=False)

    def archive(self, user: "User"):
        edit_permissions = Permission.objects.get(
            codename__startswith="change",
            content_type__app_label=self._meta.app_label,
            content_type__model=self._meta.model_name,
        )
        print(edit_permissions, self._meta.__dict__)

        if not user.has_perm(edit_permissions):
            raise PermissionDenied()

        self.archived = True
        self.archived_at = timezone.now()
        self.archived_by = user
        self.save()

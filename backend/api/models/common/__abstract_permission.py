from django.contrib.auth.models import Permission
from django.db import models


class AbstractPermission(models.Model):
    class Meta:
        abstract = True

    def has_change_permission(self, user: "User") -> bool:
        edit_permissions = Permission.objects.filter(
            codename__startswith="change",
            content_type__app_label=self._meta.app_label,
            content_type__model=self._meta.model_name,
        ).first()
        return user.has_perm(edit_permissions)

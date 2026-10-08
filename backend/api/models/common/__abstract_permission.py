from django.contrib.auth.models import Permission
from django.db import models


class AbstractPermission(models.Model):
    class Meta:
        abstract = True

    @classmethod
    def has_global_change_permission(cls, user: "User") -> bool:
        edit_permissions = Permission.objects.filter(
            codename__startswith="change",
            content_type__app_label=cls._meta.app_label,
            content_type__model=cls._meta.model_name,
        ).first()
        return user.has_perm(edit_permissions)

    def has_change_permission(self, user: "User") -> bool:
        return self.has_global_change_permission(user=user)

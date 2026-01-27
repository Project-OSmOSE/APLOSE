from django.core.exceptions import ObjectDoesNotExist
from django.db import models

from backend.aplose.models import User
from backend.utils.schema.errors import NotFoundError, ForbiddenError


class CustomQuerySet(models.QuerySet):
    def filter_viewable_by(self, user: User, **kwargs):
        return self.filter(**kwargs)

    def filter_editable_by(self, user: User, **kwargs):
        return self.filter(**kwargs)

    def get_viewable_or_fail(self, user: User, **kwargs):
        try:
            return self.filter_viewable_by(user=user, **kwargs).get(**kwargs)
        except ObjectDoesNotExist as exc:
            raise NotFoundError() from exc

    def get_editable_or_fail(self, user: User, **kwargs):
        self.get_viewable_or_fail(user=user, **kwargs)

        try:
            return self.filter_editable_by(user=user, **kwargs).get(**kwargs)
        except ObjectDoesNotExist as exc:
            raise ForbiddenError() from exc

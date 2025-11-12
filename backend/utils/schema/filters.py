from django.core.exceptions import ValidationError
from django.db import models
from django.forms import IntegerField, CharField
from django_filters import FilterSet
from django_filters.constants import EMPTY_VALUES
from django_filters.filterset import FILTER_FOR_DBFIELD_DEFAULTS
from graphene_django.filter import GlobalIDFilter
from graphene_django.forms import GlobalIDFormField


class IDFormField(GlobalIDFormField):
    def clean(self, value):
        if not value and not self.required:
            return None

        try:
            if isinstance(value, int):
                IntegerField().clean(value)
            else:
                CharField().clean(value)
        except ValidationError as exc:
            raise ValidationError(self.error_messages["invalid"]) from exc

        return value


class IDFilter(GlobalIDFilter):
    """
    Filter for Object ID.
    """

    field_class = IDFormField

    def filter(self, qs, value):
        """Convert the filter value to a primary key before filtering"""
        if value in EMPTY_VALUES:
            return qs
        if self.distinct:
            qs = qs.distinct()
        lookup = f"{self.field_name}__{self.lookup_expr}"
        qs = self.get_method(qs)(**{lookup: value})
        return qs


class BaseFilterSet(FilterSet):
    FILTER_DEFAULTS = {
        **FILTER_FOR_DBFIELD_DEFAULTS,
        models.UUIDField: {"filter_class": IDFilter},
    }

from django.core.exceptions import ValidationError
from django.forms import IntegerField, Field, MultipleChoiceField
from django.utils.translation import gettext_lazy as _
from django_filters import NumberFilter, MultipleChoiceFilter
from graphene import List
from graphene_django.forms.converter import convert_form_field

from .types import PK


class PKField(Field):
    default_error_messages = {"invalid": _("Invalid PK specified.")}

    def clean(self, value):
        if not value and not self.required:
            return None

        try:
            IntegerField().clean(value)
        except ValidationError:
            raise ValidationError(self.error_messages["invalid"])

        return value


class PKMultipleChoiceField(MultipleChoiceField):
    default_error_messages = {
        "invalid_choice": _("One of the specified PKs was invalid (%(value)s)."),
        "invalid_list": _("Enter a list of values."),
    }

    def valid_value(self, value):
        # Clean will raise a validation error if there is a problem
        PKField().clean(value)
        return True


@convert_form_field.register(PKField)
def convert_form_field_to_id(field):
    return PK(required=field.required)


@convert_form_field.register(PKMultipleChoiceField)
def convert_form_field_to_id_list(field):
    return List(PK, required=field.required)


class PKFilter(NumberFilter):
    """Filter for Django primary key"""

    field_class = PKField

    def __init__(
        self,
        field_name=None,
        lookup_expr="exact",
        *,
        label=None,
        method=None,
        distinct=True,
        exclude=False,
        **kwargs
    ):
        super().__init__(
            field_name,
            lookup_expr,
            label=label,
            method=method,
            distinct=distinct,
            exclude=exclude,
            **kwargs
        )


class PKMultipleChoiceFilter(MultipleChoiceFilter):
    """Filter for multiple Django primary key"""

    field_class = PKMultipleChoiceField

    def __init__(self, *args, **kwargs):
        kwargs.setdefault("lookup_expr", "in")
        super().__init__(*args, **kwargs)

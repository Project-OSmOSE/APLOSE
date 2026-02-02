"""User GraphQL definitions"""
from typing import Optional

from django import forms
from django.contrib.auth import update_session_auth_hash
from django.contrib.auth.password_validation import (
    validate_password,
)
from django.core.exceptions import ValidationError
from django_extension.schema.permissions import GraphQLResolve, GraphQLPermissions
from graphene_django.forms.mutation import (
    DjangoFormMutation,
)

from backend.aplose.models import User


class UpdateUserPasswordForm(forms.Form):

    user: Optional[User]

    old_password = forms.CharField()
    new_password = forms.CharField()

    def clean_old_password(self):
        old_password = self.cleaned_data["old_password"]
        if not self.user:
            raise ValidationError("No user provided")
        if not self.user.check_password(old_password):
            raise ValidationError("Incorrect old password.")
        return old_password

    def clean_new_password(self):
        new_password = self.cleaned_data["new_password"]
        validate_password(new_password)
        return new_password

    def save(self):
        if not self.user:
            raise ValidationError("No user provided")
        new_password = self.cleaned_data["new_password"]
        self.user.set_password(new_password)
        self.user.save()


class UpdateUserPasswordMutation(DjangoFormMutation):
    """Update password mutation"""

    class Meta:
        form_class = UpdateUserPasswordForm

    @classmethod
    def get_form(cls, root, info, **input):
        form: UpdateUserPasswordForm = super().get_form(root, info, **input)
        form.user = info.context.user
        return form

    @classmethod
    def perform_mutate(cls, form, info):
        data = super().perform_mutate(form, info)
        update_session_auth_hash(info.context, info.context.user)
        if hasattr(info.context.user, "auth_token"):
            info.context.user.auth_token.delete()
            return data
        return None

    @classmethod
    def mutate_and_get_payload(cls, root, info, **input):
        GraphQLResolve(permission=GraphQLPermissions.AUTHENTICATED).check_permission(
            info.context.user
        )
        return super().mutate_and_get_payload(root, info, **input)

    @classmethod
    def mutate(cls, root, info, input):
        return cls.mutate_and_get_payload(root, info, **input)

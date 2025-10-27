"""User GraphQL definitions"""
import graphene
from django import forms
from graphene_django.forms.mutation import (
    DjangoModelFormMutation,
)

from backend.aplose.models import User
from backend.aplose.schema.nodes import UserNode
from backend.utils.schema import (
    GraphQLResolve,
    GraphQLPermissions,
)


class UserForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ("email",)


class UpdateUserMutation(DjangoModelFormMutation):
    """Update user mutation"""

    user = graphene.Field(UserNode)

    class Meta:
        form_class = UserForm

    @classmethod
    def mutate_and_get_payload(cls, root, info, **input):
        GraphQLResolve(permission=GraphQLPermissions.AUTHENTICATED).check_permission(
            info.context.user
        )
        return super().mutate_and_get_payload(
            root, info, **input, id=info.context.user.id
        )

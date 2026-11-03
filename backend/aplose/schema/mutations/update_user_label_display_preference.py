"""User GraphQL definitions"""
import graphene
from django_extension.schema.permissions import GraphQLResolve, GraphQLPermissions

from backend.aplose.models import AploseUser
from ..enums import LabelDisplayPreferenceType


class UpdateUserLabelDisplayPreferenceMutation(graphene.Mutation):
    """Update user mutation"""

    class Arguments:
        preference = LabelDisplayPreferenceType(required=True)

    ok= graphene.Boolean(required=True)

    @classmethod
    @GraphQLResolve(permission=GraphQLPermissions.AUTHENTICATED)
    def mutate(cls, root, info, preference: LabelDisplayPreferenceType):
        try:
            aplose_user: AploseUser = AploseUser.objects.get(user_id=info.context.user.id)
            aplose_user.label_display_preference = preference.value
            aplose_user.save()
        except AploseUser.DoesNotExist:
            AploseUser.objects.create(
                user=info.context.user,
                label_display_preference=preference.value,
            )

        return UpdateUserLabelDisplayPreferenceMutation(ok=True)

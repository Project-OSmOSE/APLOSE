"""User GraphQL definitions"""
import graphene
from django_extension.schema.permissions import GraphQLResolve, GraphQLPermissions
from metadatax.ontology.models import LabelDisplay
from metadatax.ontology.schema import LabelDisplayEnum

from backend.aplose.models import AploseUser


class UpdateUserLabelDisplayMutation(graphene.Mutation):
    """Update user mutation"""

    class Arguments:
        preference = graphene.NonNull(LabelDisplayEnum)

    ok = graphene.Boolean(required=True)

    @classmethod
    @GraphQLResolve(permission=GraphQLPermissions.AUTHENTICATED)
    def mutate(cls, root, info, preference: LabelDisplay):
        try:
            aplose_user: AploseUser = AploseUser.objects.get(
                user_id=info.context.user.id
            )
            aplose_user.label_display = preference.value
            aplose_user.save()
        except AploseUser.DoesNotExist:
            AploseUser.objects.create(
                user=info.context.user,
                label_display=preference.value,
            )

        return UpdateUserLabelDisplayMutation(ok=True)

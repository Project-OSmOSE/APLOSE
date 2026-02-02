from django_extension.schema.permissions import GraphQLResolve, GraphQLPermissions
from graphene import Mutation, ID, Boolean

from backend.api.models import AnnotationPhase


class EndAnnotationPhaseMutation(Mutation):
    """Archive annotation phase mutation"""

    class Arguments:
        id = ID(required=True)

    ok = Boolean(required=True)

    @GraphQLResolve(permission=GraphQLPermissions.AUTHENTICATED)
    def mutate(self, info, id: int):
        """Archive annotation campaign at current date by request user"""
        phase = AnnotationPhase.objects.get_editable_or_fail(
            user=info.context.user, pk=id
        )

        phase.end(info.context.user)
        return EndAnnotationPhaseMutation(ok=True)

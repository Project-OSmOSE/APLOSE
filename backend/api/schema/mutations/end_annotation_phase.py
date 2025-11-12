from graphene import Mutation, ID, Boolean

from backend.api.context_filters import AnnotationPhaseContextFilter
from backend.api.models import AnnotationPhase
from backend.utils.schema import GraphQLResolve, GraphQLPermissions


class EndAnnotationPhaseMutation(Mutation):
    """Archive annotation phase mutation"""

    class Arguments:
        id = ID(required=True)

    ok = Boolean(required=True)

    @GraphQLResolve(permission=GraphQLPermissions.AUTHENTICATED)
    def mutate(self, info, id: int):
        """Archive annotation campaign at current date by request user"""
        phase: AnnotationPhase = AnnotationPhaseContextFilter.get_edit_node_or_fail(
            info.context, pk=id
        )
        phase.end(info.context.user)
        return EndAnnotationPhaseMutation(ok=True)

from graphene import Mutation, ID, Boolean

from backend.api.models import AnnotationPhase
from backend.utils.schema import GraphQLResolve, GraphQLPermissions
from .phase_context_filter import AnnotationPhaseContextFilter


class EndAnnotationPhaseMutation(Mutation):  # pylint: disable=too-few-public-methods
    """Archive annotation phase mutation"""

    class Arguments:
        # pylint: disable=too-few-public-methods, missing-class-docstring
        id = ID(required=True)

    ok = Boolean(required=True)

    @GraphQLResolve(permission=GraphQLPermissions.AUTHENTICATED)
    def mutate(self, info, pk: int):  # pylint: disable=redefined-builtin
        """Archive annotation campaign at current date by request user"""
        phase: AnnotationPhase = AnnotationPhaseContextFilter.get_edit_node_or_fail(
            info.context, pk
        )
        phase.end(info.context.user)
        return EndAnnotationPhaseMutation(ok=True)

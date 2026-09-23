import graphene
from django_extension.schema.permissions import GraphQLResolve, GraphQLPermissions

from backend.api.models import AnnotationPhase
from backend.api.schema.nodes import AnnotationPhaseNode


@GraphQLResolve(permission=GraphQLPermissions.AUTHENTICATED)
def resolve_phase(self, info, id: int):
    """Get AnnotationPhase by campaignID and phase type"""
    return AnnotationPhase.objects.get_viewable_or_fail(
        info.context.user,
        pk=id,
    )


AnnotationPhaseByID = graphene.Field(
    AnnotationPhaseNode,
    id=graphene.ID(required=True),
    resolver=resolve_phase,
)

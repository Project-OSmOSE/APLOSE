import graphene
from django_extension.schema.permissions import GraphQLResolve, GraphQLPermissions

from backend.aplose.schema.nodes import UserNode


@GraphQLResolve(permission=GraphQLPermissions.AUTHENTICATED)
def resolve_current_user(root, info, **kwargs):
    return UserNode.get_node(info, info.context.user.id)


CurrentUserField = graphene.Field(
    UserNode,
    resolver=resolve_current_user,
)

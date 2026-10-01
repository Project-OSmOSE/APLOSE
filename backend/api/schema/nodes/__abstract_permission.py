import graphene
import graphene_django_optimizer
from django_extension.schema.types import ExtendedNode
from graphql import GraphQLResolveInfo

from backend.api.models.common.__abstract_permission import AbstractPermission


class AbstractPermissionNode(ExtendedNode):
    class Meta:
        abstract = True

    has_change_permission = graphene.Boolean(required=True)

    @graphene_django_optimizer.resolver_hints()
    def resolve_has_change_permission(
        self: AbstractPermission, info: GraphQLResolveInfo
    ):
        # pylint: disable=not-callable
        return self.has_change_permission(info.context.user)

import graphene
from django.core.exceptions import PermissionDenied
from django_extension.schema.permissions import GraphQLResolve, GraphQLPermissions
from graphene_django.types import ErrorType
from graphql import GraphQLResolveInfo

from backend.api.models import Dataset


class DatasetArchiveMutation(graphene.Mutation):
    """Archive dataset"""

    class Arguments:
        id = graphene.ID(required=True)

    ok = graphene.Boolean(required=True)
    error = graphene.Field(ErrorType)

    @GraphQLResolve(permission=GraphQLPermissions.AUTHENTICATED)
    def mutate(self, info: GraphQLResolveInfo, id: int):
        item = Dataset.objects.get(id=id)
        try:
            item.archive(user=info.context.user)
        except PermissionDenied:
            # noinspection PyArgumentList
            return DatasetArchiveMutation(
                ok=False, error=ErrorType(field="id", messages=["Permission denied"])
            )

        # noinspection PyArgumentList
        return DatasetArchiveMutation(ok=True)

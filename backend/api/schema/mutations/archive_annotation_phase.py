import graphene
from django.core.exceptions import PermissionDenied
from django_extension.schema.permissions import GraphQLResolve, GraphQLPermissions
from graphene_django.types import ErrorType
from graphql import GraphQLResolveInfo

from backend.api.models import AnnotationPhase

# pylint: disable=duplicate-code


class AnnotationCampaignPhaseMutation(graphene.Mutation):
    """Archive campaign"""

    class Arguments:
        id = graphene.ID(required=True)

    ok = graphene.Boolean(required=True)
    error = graphene.Field(ErrorType)

    @GraphQLResolve(permission=GraphQLPermissions.AUTHENTICATED)
    def mutate(self, info: GraphQLResolveInfo, id: int):
        try:
            item = AnnotationPhase.objects.get(id=id)
            item.archive(user=info.context.user)
        except AnnotationPhase.DoesNotExist:
            # noinspection PyArgumentList
            return AnnotationCampaignPhaseMutation(
                ok=False, error=ErrorType(field="id", messages=["Does not exists"])
            )
        except PermissionDenied:
            # noinspection PyArgumentList
            return AnnotationCampaignPhaseMutation(
                ok=False, error=ErrorType(field="id", messages=["Permission denied"])
            )

        # noinspection PyArgumentList
        return AnnotationCampaignPhaseMutation(ok=True)

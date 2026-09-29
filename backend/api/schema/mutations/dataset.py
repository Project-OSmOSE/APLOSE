import graphene
from django import forms
from django.core.exceptions import PermissionDenied
from django.core.validators import MaxValueValidator, MinValueValidator
from django_extension.schema.permissions import GraphQLResolve, GraphQLPermissions
from graphene_django.forms.mutation import DjangoModelFormMutation
from graphene_django.types import ErrorType
from graphql import GraphQLResolveInfo

from backend.api.models import (
    AnnotationFileRange,
    AnnotationPhase,
    AnnotationTask,
    Dataset,
)


class DatasetArchiveMutation(graphene.Mutation):
    """Archive dataset"""

    class Arguments:
        id = graphene.ID(required=True)

    ok = graphene.Boolean(required=True)
    error = graphene.Field(ErrorType)

    @GraphQLResolve(permission=GraphQLPermissions.AUTHENTICATED)
    def mutate(self, info: GraphQLResolveInfo, id: int):
        dataset = Dataset.objects.get(id=id)
        try:
            dataset.archive(user=info.context.user)
        except PermissionDenied as e:
            # noinspection PyArgumentList
            return DatasetArchiveMutation(
                ok=False, error=ErrorType(field=None, messages=["Permission denied"])
            )

        # noinspection PyArgumentList
        return DatasetArchiveMutation(ok=True)

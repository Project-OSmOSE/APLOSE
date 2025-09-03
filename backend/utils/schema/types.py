"""GraphQL types"""
import graphene_django_optimizer
from django.db.models import QuerySet
from graphene import ID
from graphene_django import DjangoObjectType
from graphql import GraphQLResolveInfo


class ApiObjectType(DjangoObjectType):
    """Dataset schema"""

    id = ID(required=True)

    class Meta:
        # pylint: disable=missing-class-docstring, too-few-public-methods
        abstract = True

    @classmethod
    def get_queryset(cls, queryset: QuerySet, info: GraphQLResolveInfo):
        """Resolve Queryset"""
        return graphene_django_optimizer.query(queryset, info)

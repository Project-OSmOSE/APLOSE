"""GraphQL types"""
import graphene_django_optimizer
from django.db.models import QuerySet
from graphene import Int
from graphene_django import DjangoObjectType
from graphql import GraphQLResolveInfo


class PK(Int):
    """Django Primary key"""


class ApiObjectType(DjangoObjectType):
    """Dataset schema"""

    pk = PK(required=True)

    class Meta:
        # pylint: disable=missing-class-docstring, too-few-public-methods
        abstract = True

    @classmethod
    def get_queryset(cls, queryset: QuerySet, info: GraphQLResolveInfo):
        """Resolve Queryset"""
        return graphene_django_optimizer.query(queryset, info)

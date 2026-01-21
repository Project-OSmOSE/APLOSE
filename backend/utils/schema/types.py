"""GraphQL types"""

import graphene
import graphene_django_optimizer
from django.db.models import QuerySet
from graphene import Int
from graphene_django import DjangoObjectType
from graphene_django.forms.mutation import DjangoModelFormMutation
from graphene_django.rest_framework.mutation import SerializerMutation
from graphql import GraphQLResolveInfo
from rest_framework.request import Request

from .errors import NotFoundError
from .permissions import GraphQLResolve, GraphQLPermissions


class PK(Int):
    """Django Primary key"""


class ApiObjectType(DjangoObjectType):
    """Dataset schema"""

    pk = PK(required=True)

    class Meta:
        abstract = True

    @classmethod
    def get_queryset(cls, queryset: QuerySet, info: GraphQLResolveInfo):
        """Resolve Queryset"""
        return graphene_django_optimizer.query(queryset, info)


class ModelContextFilter:
    """Base context filter"""

    @classmethod
    def get_queryset(cls, context: Request):
        return QuerySet().none()

    @classmethod
    def get_edit_node_or_fail(cls, context: Request, pk: int):
        """Get node with edit rights or fail depending on the context"""
        raise NotFoundError()


class BaseObjectType(DjangoObjectType):
    """Base object type"""

    class Meta:
        abstract = True

    @classmethod
    def resolve_queryset(cls, queryset: QuerySet, info: GraphQLResolveInfo):
        """Resolve Queryset"""
        if hasattr(queryset, "filter_viewable_by"):
            return queryset.filter_viewable_by(
                user=info.context.user,
            )
        return queryset

    @classmethod
    def get_queryset(cls, queryset: QuerySet, info: GraphQLResolveInfo):
        """Get Queryset"""
        return graphene_django_optimizer.query(
            cls.resolve_queryset(queryset, info), info
        )


class BaseNode(graphene.Node):
    """
    For fetching object id instead of Node id
    """

    class Meta:
        name = "BaseNode"

    @classmethod
    def to_global_id(cls, type_, id):
        return id


class AuthenticatedModelFormMutation(DjangoModelFormMutation):
    class Meta:
        abstract = True

    @classmethod
    def mutate_and_get_payload(cls, root, info, **input):
        GraphQLResolve(permission=GraphQLPermissions.AUTHENTICATED).check_permission(
            info.context.user
        )
        return super().mutate_and_get_payload(root, info, **input)

    @classmethod
    def get_form_kwargs(cls, root, info, **input):
        pk = input.get("id", None)

        kwargs = super().get_form_kwargs(root, info, **input)
        if (
            pk
            and cls._meta.model
            and hasattr(cls._meta.model.objects, "get_editable_or_fail")
        ):
            kwargs["instance"] = cls._meta.model.objects.get_editable_or_fail(
                user=info.context.user,
                pk=pk,
            )

        return kwargs


class AuthenticatedSerializerMutation(SerializerMutation):
    class Meta:
        abstract = True

    @classmethod
    def mutate_and_get_payload(cls, root, info, **input):
        GraphQLResolve(permission=GraphQLPermissions.AUTHENTICATED).check_permission(
            info.context.user
        )
        return super().mutate_and_get_payload(root, info, **input)

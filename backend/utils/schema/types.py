"""GraphQL types"""
from typing import Optional

import graphene
import graphene_django_optimizer
from django.db.models import QuerySet
from graphene import Int
from graphene_django import DjangoObjectType
from graphene_django.forms.mutation import DjangoModelFormMutation
from graphene_django.rest_framework.mutation import SerializerMutation
from graphene_django.types import DjangoObjectTypeOptions
from graphql import GraphQLResolveInfo
from requests import Request

from . import NotFoundError
from .permissions import GraphQLResolve, GraphQLPermissions


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


class ModelContextFilter:
    """Base context filter"""

    def __init__(self):
        super().__init__()

    @classmethod
    def get_queryset(cls, context: Request):
        return QuerySet().none()

    @classmethod
    def get_edit_node_or_fail(cls, context: Request, pk: int):
        """Get node with edit rights or fail depending on the context"""
        raise NotFoundError()


class BaseObjectTypeMeta(DjangoObjectTypeOptions):
    context_filter: Optional[ModelContextFilter.__class__] = None


class BaseObjectType(DjangoObjectType):
    """Base object type"""

    class Meta:
        abstract = True

    @classmethod
    def __init_subclass_with_meta__(
        cls,
        context_filter: Optional[ModelContextFilter.__class__] = None,
        _meta=None,
        **kwargs,
    ):
        if not _meta:
            _meta = BaseObjectTypeMeta(cls)
        if context_filter is not None:
            _meta.context_filter = context_filter
        super().__init_subclass_with_meta__(_meta=_meta, **kwargs)

    @classmethod
    def resolve_queryset(cls, queryset: QuerySet, info: GraphQLResolveInfo):
        """Resolve Queryset"""
        if cls._meta.context_filter is None:
            return queryset
        else:
            return cls._meta.context_filter.get_queryset(
                info.context, queryset=queryset
            )

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
    def __init_subclass_with_meta__(
        cls,
        context_filter: Optional[ModelContextFilter.__class__] = None,
        **kwargs,
    ):
        cls._context_filter = context_filter
        return super().__init_subclass_with_meta__(**kwargs)

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
        if pk and cls._context_filter:
            kwargs["instance"] = cls._context_filter.get_edit_node_or_fail(
                info.context, pk=pk
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

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

    def __init__(self, model=None):
        if model is None:
            raise Exception("Cannot set a ModelContextFilter without model")
        self.model = model
        super().__init__()

    def get_queryset(self, context: Request):
        return self.model.objects.all()


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
        model=None,
        _meta=None,
        **kwargs,
    ):
        if not _meta:
            _meta = BaseObjectTypeMeta(cls)
        super().__init_subclass_with_meta__(model=model, _meta=_meta, **kwargs)
        if context_filter is not None:
            _meta.context_filter = context_filter(model)

    @classmethod
    def resolve_queryset(cls, queryset: QuerySet, info: GraphQLResolveInfo):
        """Resolve Queryset"""
        if cls._meta.context_filter is None:
            return queryset
        else:
            return cls._meta.context_filter(info.context)

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


class AuthenticatedSerializerMutation(SerializerMutation):
    class Meta:
        abstract = True

    @classmethod
    def mutate_and_get_payload(cls, root, info, **input):
        GraphQLResolve(permission=GraphQLPermissions.AUTHENTICATED).check_permission(
            info.context.user
        )
        return super().mutate_and_get_payload(root, info, **input)

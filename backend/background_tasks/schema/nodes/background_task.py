import graphene
from django_extension.schema.types import ExtendedNode
from graphql import GraphQLResolveInfo

from backend.background_tasks.models import BackgroundTask
from ..enums import *


class BackgroundTaskNode(ExtendedNode):

    status = graphene.NonNull(TaskStatusEnum)
    type = graphene.NonNull(TaskTypeEnum)

    completion_percentage = graphene.Int(required=True)

    created_at = graphene.DateTime(required=True)
    started_at = graphene.DateTime()
    completed_at = graphene.DateTime()
    duration = graphene.Int()

    error = graphene.String()
    error_trace = graphene.String()

    class Meta:
        abstract = True

    def resolve_type(self: BackgroundTask, info: GraphQLResolveInfo):
        return self.type

    def resolve_duration(self: BackgroundTask, info: GraphQLResolveInfo):
        return self.duration


__all__ = [
    "BackgroundTaskNode",
]

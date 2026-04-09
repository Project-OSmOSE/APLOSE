from backend.aplose.schema import UserNode
from backend.background_tasks.types import AbstractBackgroundTask
from ..enums import *


class AbstractBackgroundTaskNode(graphene.ObjectType):

    uuid = graphene.NonNull(graphene.String)
    identifier = graphene.NonNull(graphene.String)
    requested_by = graphene.NonNull(UserNode)
    created_at = graphene.NonNull(graphene.DateTime)
    type = graphene.NonNull(TaskTypeEnum)
    other_info = graphene.JSONString()

    started_at = graphene.DateTime()
    started_at_completion = graphene.Float()
    completion_percentage = graphene.Float()

    status = TaskStatusEnum()
    error = graphene.String()
    error_trace = graphene.String()

    duration = graphene.Int()

    class Meta:
        abstract = True

    def resolve_identifier(self: AbstractBackgroundTask, info):
        return self.identifier

    def resolve_status(self: AbstractBackgroundTask, info):
        return self.to_dict()["status"]

    def resolve_error(self: AbstractBackgroundTask, info):
        return str(self.to_dict()["error"])

    def resolve_error_trace(self: AbstractBackgroundTask, info):
        return self.to_dict()["error_trace"]

    def resolve_duration(self: AbstractBackgroundTask, info):
        return self.duration


__all__ = [
    "AbstractBackgroundTaskNode",
]

import json
from datetime import datetime
from uuid import uuid1

import redis
from celery.result import AsyncResult
from celery.states import PENDING, ALL_STATES, STARTED

from backend.aplose.models import User
from .enums import TaskType


class AbstractBackgroundTask:
    """
    Track background operations with progress updates.
    """

    class Meta:
        abstract = True

    _redis = redis.Redis()

    # Identification
    uuid: str
    requested_by: User
    created_at: datetime
    type: TaskType
    other_info: dict | None

    # Progress
    celery: AsyncResult | None
    status: str
    started_at: datetime | None
    started_at_completion: float
    completion_percentage: float

    def __init__(
        self,
        requested_by: User,
        task_type: TaskType,
        uuid: str = str(uuid1()),
        created_at: datetime = datetime.now(),
        other_info: dict | None = None,
        celery: AsyncResult | None = None,
        status: str = PENDING,
        started_at=None,
        completion_percentage=0,
        started_at_completion: float | None = None,
    ):
        self.uuid = uuid
        self.requested_by = requested_by
        self.created_at = created_at
        self.other_info = other_info
        self.type = task_type

        self.celery = celery
        self.status = status
        self.started_at = started_at
        self.started_at_completion = started_at_completion or completion_percentage
        self.completion_percentage = completion_percentage
        self.save()

    def to_dict(self, base=False):
        return {
            "uuid": self.uuid,
            "identifier": self.identifier,
            "requested_by_id": self.requested_by.id,
            "created_at": self.created_at.isoformat(),
            "type": self.type.label,
            "other_info": json.dumps(self.other_info) if self.other_info else None,
            "celery_id": self.celery.id if self.celery else None,
            "started_at": self.started_at.isoformat() if self.started_at else None,
            "started_at_completion": self.started_at_completion,
            "completion_percentage": self.completion_percentage,
            "status": self.status,
            "duration": self.duration if not base else None,
            # FROM CELERY
            "error": self.celery.info if self.celery and not base else None,
            "error_trace": self.celery.traceback if self.celery and not base else None,
        }

    @classmethod
    def get_identifier(cls, uuid: str, type: TaskType) -> str:
        """
        ID for redis
        :return: str
        """
        return f"{cls.__name__}:{type.label}:{uuid}"

    @property
    def identifier(self) -> str:
        """
        ID for redis
        :return: str
        """
        return self.get_identifier(self.uuid, self.type)

    @property
    def duration(self) -> int:
        """
        Duration from start
        :return: int
        """
        if self.started_at is None:
            return 0
        return (datetime.now() - self.started_at).seconds

    def save(self):
        """
        Save in Redis
        """
        self._redis.set(self.identifier, json.dumps(self.to_dict(base=True)))

    def delete(self):
        """
        Delete in Redis
        """
        self._redis.delete(self.identifier)

    def start(self):
        """Set task as started"""
        self.started_at_completion = self.completion_percentage
        self.started_at = datetime.now()
        self.status = STARTED
        self.save()

    @classmethod
    def get(cls, identifier: str) -> "AbstractBackgroundTask":
        """
        Get BackgroundTask from Redis
        :param identifier: identifier of the task
        :return: BackgroundTask
        :raises: User.DoesNotExist
        """
        d = json.loads(cls._redis.get(identifier))
        return AbstractBackgroundTask(
            requested_by=User.objects.get(pk=d["requested_by_id"]),
            uuid=d["uuid"],
            created_at=datetime.fromisoformat(d["created_at"]),
            other_info=json.loads(d["other_info"]) if "other_info" in d else None,
            celery=AsyncResult(d["celery_id"]) if "celery_id" in d else None,
            started_at=datetime.fromisoformat(d["started_at"])
            if d["started_at"]
            else None,
            started_at_completion=d["started_at_completion"],
            completion_percentage=d["completion_percentage"],
            status=d["status"],
            task_type=d["task_type"],
        )


__all__ = ["AbstractBackgroundTask"]

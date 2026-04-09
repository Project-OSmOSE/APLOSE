from datetime import datetime
from types import TracebackType

from asgiref.sync import async_to_sync
from celery.result import AsyncResult
from celery.states import FAILURE, SUCCESS, STARTED, PENDING
from channels.layers import get_channel_layer

from backend.background_tasks.types import (
    AbstractBackgroundTask,
    ImportAnalysisBackgroundTask,
)


class Tracker:
    """
    Context manager for tracking background tasks progress with automatic WebSocket updates.

    Usage:
        with Tracker(task) as tracker:
            tracker.process()
    """

    task: AbstractBackgroundTask | ImportAnalysisBackgroundTask
    channel_layer = get_channel_layer()

    def __init__(
        self,
        task: AbstractBackgroundTask | ImportAnalysisBackgroundTask,
        celery_id: str,
    ):
        self.task = task
        self.task.celery = AsyncResult(celery_id)
        self.task.status = PENDING
        self.task.save()
        self.send_update()

    def __enter__(self):
        self.task.start()
        self.send_update()
        return self

    def __exit__(self, exc_type, exc_val: Exception, exc_tb: TracebackType):
        if exc_val:
            self.task.status = FAILURE
        else:
            self.task.status = SUCCESS
        self.task.save()
        self.send_update()

        if self.task.status == SUCCESS:
            self.task.delete()

    def send_update(self):
        async_to_sync(self.channel_layer.group_send)(
            self.task.uuid,
            {
                "type": "info",
                "identifier": self.task.identifier,
                "data": self.task.to_dict(),
            },
        )

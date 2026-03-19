import traceback

from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

from backend.background_tasks.models import BackgroundTask, TaskStatus


class Tracker:
    """
    Context manager for tracking background tasks progress with automatic WebSocket updates.

    Usage:
        with Tracker(task) as tracker:
            tracker.process()
    """

    task: BackgroundTask
    celery_id: str
    channel_layer = get_channel_layer()

    def __init__(self, task: BackgroundTask, celery_id: str):
        self.task = task
        self.celery_id = celery_id

    def __enter__(self):
        self.task.start(celery_id=self.celery_id)
        self._send_update()
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        if exc_type is not None:
            # Import failed with exception
            self.task.fail(
                error=str(exc_val),
                traceback=str(exc_tb),
            )
        else:
            # Import completed successfully
            self.task.complete()

        self._send_update()
        return False  # Don't suppress exceptions

    def update(self, percentage: float):
        """
        Update background task progress.
        :param percentage: new completion percentage of the task
        """
        self.task.completion_percentage = percentage
        self.task.save()
        self._send_update()

    def fail(self, exception: Exception):
        """
        Update background task state.
        :param exception: raised exception
        """
        self.task.fail(
            error=str(exception), traceback="\n".join(traceback.format_stack())
        )
        self._send_update()

    def _send_update(self):
        async_to_sync(self.channel_layer.group_send)(
            self.task.get_ws_group_name(), self.task.get_ws_update_data()
        )

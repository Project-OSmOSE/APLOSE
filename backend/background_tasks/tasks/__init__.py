from celery import shared_task

from backend.background_tasks.models import BackgroundTask, TaskType
from ._tracker import Tracker
from .process_analysis_import import process_analysis_import


@shared_task(bind=True)
def process_background_task(self, task_id: int | str):
    """
    Process import with real-time progress updates via WebSocket.

    Args:
        task_id: ID of the BackgroundTask model instance to process
    """
    try:
        task = BackgroundTask.objects.get(id=task_id)
    except BackgroundTask.DoesNotExist:
        return {"error": "BackgroundTask not found"}

    print("--> will process task", task)

    # Use context manager for automatic status updates
    with Tracker(task=task, celery_id=self.request.id) as tracker:
        if task.type == TaskType.ANALYSIS_IMPORT:
            process_analysis_import(task=task, tracker=tracker)

    return {
        "task_id": task_id,
        "status": "completed",
    }


__all__ = ["process_background_task"]

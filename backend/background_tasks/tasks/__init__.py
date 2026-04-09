from celery import shared_task
from celery.app.task import Context

from backend.aplose.models import User
from backend.background_tasks.types import (
    TaskType,
    get_task,
)
from ._tracker import Tracker
from .process_analysis_import import process_analysis_import


@shared_task(bind=True)
def process_background_task(self, task_identifier: str):
    """
    Process import with real-time progress updates via WebSocket.

    Args:
        task_identifier: identifier of the BackgroundTask model instance to process
    """
    task = None
    try:
        task_type, task = get_task(task_identifier)
    except User.DoesNotExist:
        return {"error": "ImportAnalysisBackgroundTask not found"}
    if task is None:
        return {"error": "Task not found"}

    # Use context manager for automatic status updates
    with Tracker(task=task, celery_id=self.request.id) as tracker:
        if task_type == TaskType.ANALYSIS_IMPORT.label:
            process_analysis_import(task=task, tracker=tracker)

    return {
        "task_identifier": task_identifier,
    }


__all__ = ["process_background_task"]

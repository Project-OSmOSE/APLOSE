from typing import cast

from celery import shared_task
from django.db.models import Model

from backend.background_tasks.models import (
    BackgroundTask,
    ImportAnalysisBackgroundTask,
    TaskType,
    get_instance_for_identifier,
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
        task_type, pk = task_identifier.split("-")
        if task_type == TaskType.ANALYSIS_IMPORT:
            task = ImportAnalysisBackgroundTask.objects.get(pk=pk)
    except ImportAnalysisBackgroundTask.DoesNotExist:
        return {"error": "ImportAnalysisBackgroundTask not found"}
    if task is None:
        return {"error": "Task not found"}

    # Use context manager for automatic status updates
    with Tracker(task=task, celery_id=self.request.id) as tracker:
        if task.type == TaskType.ANALYSIS_IMPORT:
            process_analysis_import(
                task=cast(ImportAnalysisBackgroundTask, task), tracker=tracker
            )

    return {
        "task_identifier": task_identifier,
        "status": task.status,
    }


__all__ = ["process_background_task"]

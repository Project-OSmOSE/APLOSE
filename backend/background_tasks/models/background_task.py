from django.db import models
from django.utils import timezone

from ._enums import TaskType, TaskStatus


class BackgroundTask(models.Model):
    """
    Model to track analysis operations with progress updates.
    """

    # Identification
    type = models.CharField(choices=TaskType.choices, max_length=1)
    celery_id = models.CharField(max_length=64, null=True, blank=True)

    # Status
    status = models.CharField(
        choices=TaskStatus.choices,
        max_length=10,
        default=TaskStatus.PENDING,
    )
    additional_info = models.JSONField(default=dict())

    # Progress
    completion_percentage = models.PositiveIntegerField(default=0)

    # Timing
    created_at = models.DateTimeField(auto_now_add=True)
    started_at = models.DateTimeField(blank=True, null=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    @property
    def duration(self):
        """Calculate duration in seconds."""
        if self.started_at:
            end_time = self.completed_at or timezone.now()
            return (end_time - self.started_at).total_seconds()
        return None

    def start(self, celery_id: str):
        """
        Update status and timestamps
        """
        print("start", self.pk)
        self.status = TaskStatus.PROCESSING
        self.celery_id = celery_id
        if not self.started_at:
            self.started_at = timezone.now()
        self.save()

    def pause(self):
        """
        Update status
        """
        print("pause", self.pk)
        self.status = TaskStatus.PAUSE
        self.save()

    def resume(self):
        """
        Update status
        """
        print("resume", self.pk)
        self.status = TaskStatus.PENDING
        self.save()

    def fail(self, error: str, traceback: str):
        """
        Update status, timestamp and additional_info
        """
        print("fail", self.pk, error, traceback)
        self.status = TaskStatus.FAILED
        self.completed_at = timezone.now()
        self.additional_info["error"] = error
        self.additional_info["error_traceback"] = traceback
        self.save()

    def complete(self):
        """
        Update status and percentage
        """
        print("complete", self.pk)
        self.status = TaskStatus.PROCESSING
        self.completion_percentage = 100
        self.save()

    def cancel(self):
        """
        Update status
        """
        print("cancel", self.pk)
        self.status = TaskStatus.CANCELLED
        self.save()

    def get_ws_group_name(self):
        return f"background_task_{self.pk}"

    def get_ws_update_data(self):
        return {
            "type": "background_task_update",
            "data": {
                # Identification
                "type": self.type,
                # Status
                "status": self.status,
                # Progress
                "completion_percentage": self.completion_percentage,
                "additional_info": self.additional_info,
                # Timing
                "created_at": self.created_at.isoformat() if self.created_at else None,
                "started_at": self.started_at.isoformat() if self.started_at else None,
                "completed_at": self.completed_at.isoformat()
                if self.completed_at
                else None,
            },
        }

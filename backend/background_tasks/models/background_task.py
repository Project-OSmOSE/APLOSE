from django.conf import settings
from django.db import models
from django.utils import timezone

from ._enums import TaskStatus, TaskType


class BackgroundTask(models.Model):
    """
    Model to track analysis operations with progress updates.
    """

    class Meta:
        abstract = True

    @property
    def type(self) -> str:
        return ""

    @property
    def task_identifier(self) -> str:
        return f"{self.type}-{self.pk}"

    # Identification
    celery_id = models.CharField(max_length=64, null=True, blank=True)
    requested_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    # Status
    status = models.CharField(
        choices=TaskStatus.choices,
        max_length=10,
        default=TaskStatus.PENDING,
    )

    # Progress
    completion_percentage = models.FloatField(default=0)

    # Timing
    created_at = models.DateTimeField(auto_now_add=True)
    started_at = models.DateTimeField(blank=True, null=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    # Error
    error = models.TextField(null=True, blank=True)
    error_trace = models.TextField(null=True, blank=True)

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
        self.status = TaskStatus.PROCESSING
        self.celery_id = celery_id
        if not self.started_at:
            self.started_at = timezone.now()
        self.save()

    # def pause(self):
    #     """
    #     Update status
    #     """
    #     print("pause", self.pk)
    #     self.status = TaskStatus.PAUSE
    #     self.save()
    #
    # def resume(self):
    #     """
    #     Update status
    #     """
    #     print("resume", self.pk)
    #     self.status = TaskStatus.PENDING
    #     self.save()

    def fail(self, error: str, traceback: str):
        """
        Update status, timestamp and error info
        """
        self.status = TaskStatus.FAILED
        self.completed_at = timezone.now()
        self.error = error
        self.error_trace = traceback
        self.save()

    def complete(self):
        """
        Update status and percentage
        """
        self.status = TaskStatus.COMPLETED
        self.completion_percentage = 100
        self.completed_at = timezone.now()
        self.save()

    def cancel(self):
        """
        Update status
        """
        self.status = TaskStatus.CANCELLED
        self.save()

    def get_ws_group_name(self):
        return f"background_task_{self.pk}"

    def _get_ws_update_data_data_identification(self):
        return {
            # Identification
            "id": self.pk,
            "type": TaskType(self.type).label,
            "requested_by_id": self.requested_by_id,
        }

    def _get_ws_update_data_data_state_processing(self):
        return {
            "completion_percentage": self.completion_percentage,
            "started_at": self.started_at.isoformat() if self.started_at else None,
        }

    def _get_ws_update_data_data_state(self):
        base_info = {
            "status": TaskStatus(self.status).label,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
        if self.status == TaskStatus.PENDING or self.status == TaskStatus.CANCELLED:
            return base_info
        elif self.status == TaskStatus.PROCESSING:
            return {**base_info, **self._get_ws_update_data_data_state_processing()}
        elif self.status == TaskStatus.FAILED:
            return {
                **base_info,
                "error": self.error,
                "error_trace": self.error_trace,
            }
        # TaskStatus.COMPLETED
        return {
            **base_info,
            "started_at": self.started_at.isoformat() if self.started_at else None,
            "completed_at": self.completed_at.isoformat()
            if self.completed_at
            else None,
        }

    def get_ws_update_data(self):
        return {
            "type": "background_task_update",
            "data": {
                **self._get_ws_update_data_data_identification(),
                **self._get_ws_update_data_data_state(),
            },
        }

    def copy(self) -> "BackgroundTask":
        return BackgroundTask.objects.create(requested_by=self.requested_by)

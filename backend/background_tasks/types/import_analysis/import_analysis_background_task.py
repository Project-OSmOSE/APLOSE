import json
from datetime import datetime
from uuid import uuid1

from celery.result import AsyncResult
from celery.states import PENDING

from backend.aplose.models import User
from .import_analysis_info import ImportAnalysisInfo
from .._background_task import AbstractBackgroundTask
from ..enums import TaskType


class ImportAnalysisBackgroundTask(AbstractBackgroundTask):
    """
    Track import analysis background operations with progress updates.
    """

    type = TaskType.ANALYSIS_IMPORT
    other_info: ImportAnalysisInfo

    def __init__(
        self,
        requested_by: User,
        dataset_id: int,
        analysis_path: str,
        analysis_id: int | None = None,
        total_spectrograms: int | None = None,
        completed_spectrograms: int = 0,
        chunk_size: int = 100,
        uuid: str = str(uuid1()),
        created_at: datetime = datetime.now(),
        celery: AsyncResult | None = None,
        started_at=None,
        completion_percentage=0,
        status: str = PENDING,
        started_at_completion: float | None = None,
    ):
        self.uuid = uuid
        self.requested_by = requested_by
        self.created_at = created_at
        self.other_info = {
            "total_spectrograms": total_spectrograms,
            "dataset_id": dataset_id,
            "analysis_id": analysis_id,
            "chunk_size": chunk_size,
            "completed_spectrograms": completed_spectrograms,
            "analysis_path": analysis_path,
        }

        self.celery = celery
        self.status = status
        self.started_at = started_at
        self.started_at_completion = started_at_completion or completion_percentage
        self.completion_percentage = completion_percentage
        self.save()

    @classmethod
    def path_key(cls, path: str) -> str:
        return f"{cls.__name__}:{TaskType.ANALYSIS_IMPORT.label}:path:{path}"

    def save(self):
        """
        Save in Redis
        """
        super().save()
        path = self.other_info["analysis_path"]
        self._redis.set(
            self.path_key(path),
            self.identifier,
        )

    def delete(self):
        """
        Delete in Redis
        """
        super().delete()
        self._redis.delete(self.path_key(self.other_info["analysis_path"]))

    @classmethod
    def get(cls, identifier: str) -> "ImportAnalysisBackgroundTask":
        d = json.loads(cls._redis.get(identifier))
        info = json.loads(d["other_info"])
        return ImportAnalysisBackgroundTask(
            requested_by=User.objects.get(pk=d["requested_by_id"]),
            uuid=d["uuid"],
            created_at=datetime.fromisoformat(d["created_at"]),
            celery=AsyncResult(d["celery_id"]) if d["celery_id"] else None,
            started_at=datetime.fromisoformat(d["started_at"])
            if d["started_at"]
            else None,
            completion_percentage=d["completion_percentage"],
            analysis_id=info["analysis_id"],
            analysis_path=info["analysis_path"],
            dataset_id=info["dataset_id"],
            chunk_size=info["chunk_size"],
            total_spectrograms=info["total_spectrograms"],
            started_at_completion=float(d["started_at_completion"]),
            completed_spectrograms=info["completed_spectrograms"],
            status=d["status"],
        )

    @classmethod
    def get_from_path(cls, path: str) -> "ImportAnalysisBackgroundTask | None":
        """
        Get BackgroundTask from Redis
        :param path: analysis path
        :return: BackgroundTask
        :raises: User.DoesNotExist
        """
        identifier = cls._redis.get(cls.path_key(path))
        if identifier is None:
            return None
        return cls.get(identifier)

    @classmethod
    def list(cls) -> list["ImportAnalysisBackgroundTask"]:
        """List all ImportAnalysisBackgroundTask"""
        tasks = []
        import_task_identifier_start = (
            f"{ImportAnalysisBackgroundTask.__name__}:{TaskType.ANALYSIS_IMPORT.label}"
        )
        for key in cls._redis.scan_iter():
            if isinstance(key, bytes):
                key = key.decode()
            if import_task_identifier_start in key and "path" not in key:
                tasks.append(ImportAnalysisBackgroundTask.get(identifier=key))
        return tasks


__all__ = ["ImportAnalysisBackgroundTask"]

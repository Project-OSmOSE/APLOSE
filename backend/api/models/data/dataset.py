"""Datasets models"""
import csv
from os.path import join

from django.conf import settings
from django.db import models
from django.db.models import CheckConstraint, Q
from metadatax.acquisition.models import ChannelConfiguration
from typing_extensions import deprecated

from backend.aplose.models import User
from backend.api.models.common.__abstract_archivable import AbstractArchivable
from .__abstract_dataset import AbstractDataset


class DatasetManager(models.Manager):
    """Dataset manager"""

    def get_or_create(self, name: str, path: str, owner: User, legacy: bool = False):
        """Get or create dataset, use owner only for creation"""
        if Dataset.objects.filter(name=name, path=path).exists():
            return (
                Dataset.objects.get(
                    name=name,
                    path=path,
                ),
                False,
            )

        return (
            Dataset.objects.create(
                name=name,
                path=path,
                owner=owner,
                legacy=legacy,
            ),
            True,
        )


class Dataset(AbstractDataset, AbstractArchivable, models.Model):
    """Dataset"""

    objects = DatasetManager()

    class Meta:
        unique_together = (
            "name",
            "path",
        )
        ordering = ("-created_at",)
        constraints = [
            CheckConstraint(
                name="dataset_archive_info",
                condition=Q(
                    archived=True, archived_at__isnull=False, archived_by__isnull=False
                )
                | Q(archived=False, archived_at__isnull=True, archived_by__isnull=True),
            )
        ]

    def __str__(self):
        return self.name

    related_channel_configurations = models.ManyToManyField(
        ChannelConfiguration, related_name="datasets", blank=True
    )
    # pylint: disable=duplicate-code
    archived_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="archived_datasets",
    )

    def has_change_permission(self, user: "User") -> bool:
        return super().has_change_permission(user) or user.id == self.owner_id

    @deprecated("Related to old OSEkit")
    def get_config_folder(self) -> str:
        """Get config folder for legacy datasets"""
        datasets_csv_path = join(
            settings.VOLUMES_ROOT, settings.DATASET_EXPORT_PATH, settings.DATASET_FILE
        )
        with open(datasets_csv_path, encoding="utf-8") as csvfile:
            data = csv.DictReader(csvfile)
            d: dict
            datasets = [
                d for d in data if d["dataset"] == self.name and d["path"] == self.path
            ]
            if len(datasets) == 0:
                return ""
            dataset = datasets[0]
        return f"{dataset['spectro_duration']}_{dataset['dataset_sr']}"

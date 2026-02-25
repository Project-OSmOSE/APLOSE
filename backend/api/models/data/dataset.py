"""Datasets models"""
import csv
from os.path import join

from django.conf import settings
from django.db import models
from metadatax.acquisition.models import ChannelConfiguration
from typing_extensions import deprecated

from backend.aplose.models import User
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


class Dataset(AbstractDataset, models.Model):
    """Dataset"""

    objects = DatasetManager()

    class Meta:
        unique_together = (
            "name",
            "path",
        )
        ordering = ("-created_at",)

    def __str__(self):
        return self.name

    related_channel_configurations = models.ManyToManyField(
        ChannelConfiguration, related_name="datasets"
    )

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

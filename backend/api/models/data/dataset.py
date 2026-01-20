"""Datasets models"""
from pathlib import Path

from django.conf import settings
from django.db import models
from django.db.models import Manager
from metadatax.acquisition.models import ChannelConfiguration

from backend.aplose.models import User
from backend.utils.spectrogram.dataset import SimpleDataset
from .__abstract_dataset import AbstractDataset


class DatasetManager(Manager):
    """Dataset manager"""

    def get_or_create(self, name: str, path: str, owner: User, **kwargs):
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
                **kwargs
            ),
            True,
        )


class Dataset(AbstractDataset, models.Model):
    """
    Dataset model for APLOSE

    A dataset is a folder containing:
    - WAV files (audio recordings)
    - NetCDF files (spectrograms, one per WAV file)
    - Optional: metadata.json with dataset-level information
    """

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

    def get_simple_dataset(self) -> SimpleDataset:
        """Get SimpleDataset object for this dataset"""
        dataset_path = settings.DATASET_IMPORT_FOLDER / self.path
        return SimpleDataset(dataset_path)

    def get_folder_path(self) -> Path:
        """Get full path to dataset folder"""
        return settings.DATASET_IMPORT_FOLDER / self.path

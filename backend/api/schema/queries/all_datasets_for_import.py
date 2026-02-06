import csv
from os import listdir
from os.path import join, isfile, exists
from pathlib import Path
from typing import Optional
import traceback

import graphene
from django.conf import settings
from django_extension.schema.permissions import GraphQLResolve, GraphQLPermissions
from osekit.public_api.dataset import (
    Dataset as OSEkitDataset,
)
from typing_extensions import deprecated

from backend.api.schema.nodes import ImportDatasetNode
from .all_analysis_for_import import (
    resolve_all_spectrogram_analysis_available_for_import,
    legacy_resolve_all_spectrogram_analysis_available_for_import,
)


def resolve_all_datasets_available_for_import() -> [ImportDatasetNode]:
    """List dataset available for import"""
    folders = [
        f
        for f in listdir(settings.DATASET_IMPORT_FOLDER)
        if not isfile(join(settings.DATASET_IMPORT_FOLDER, f))
    ]
    available_datasets: [ImportDatasetNode] = []
    for folder in folders:
        json_path = join(settings.DATASET_IMPORT_FOLDER, folder, "dataset.json")
        if not exists(json_path):
            continue
        try:
            dataset = OSEkitDataset.from_json(Path(json_path))
            d = ImportDatasetNode()
            d.name = folder
            d.path = folder
            d.analysis = resolve_all_spectrogram_analysis_available_for_import(
                dataset,
                folder=folder,
            )
            if len(d.analysis) > 0:
                available_datasets.append(d)
        except Exception as e:
            d = ImportDatasetNode()
            d.name = folder
            d.path = folder
            d.failed = True
            d.stack = traceback.format_exc()
            available_datasets.append(d)
    return available_datasets


@deprecated(
    "Use resolve_all_datasets_available_for_import with the recent version of OSEkit"
)
def legacy_resolve_all_datasets_available_for_import() -> [ImportDatasetNode]:
    """Get all datasets for import - using legacy OSEkit"""
    datasets_csv_path = settings.DATASET_IMPORT_FOLDER / settings.DATASET_FILE
    available_datasets: [ImportDatasetNode] = []
    if not exists(datasets_csv_path):
        return []
    with open(datasets_csv_path, encoding="utf-8") as csvfile:
        dataset: dict
        for dataset in csv.DictReader(csvfile):

            # Get dataset
            available_dataset: Optional[ImportDatasetNode] = None
            for d in available_datasets:
                if d.path == dataset["path"]:
                    available_dataset = d
            if not available_dataset:
                # noinspection PyTypeChecker
                available_dataset = ImportDatasetNode()
                available_dataset.name = dataset["dataset"]
                available_dataset.path = dataset["path"]
                available_dataset.analysis = []
                available_dataset.legacy = True

            # Get its analysis
            analysis = legacy_resolve_all_spectrogram_analysis_available_for_import(
                dataset_name=available_dataset.name,
                dataset_path=available_dataset.path,
                config_folder=(
                    f"{dataset['spectro_duration']}_{dataset['dataset_sr']}"
                ),
            )
            for a in analysis:
                available_dataset.analysis.append(a)
            if len(available_dataset.analysis) > 0:
                available_datasets.append(available_dataset)
    return available_datasets


@GraphQLResolve(permission=GraphQLPermissions.STAFF_OR_SUPERUSER)
def resolve_datasets_for_import(root, _):
    """Get all datasets for import"""
    datasets = resolve_all_datasets_available_for_import()
    legacy_datasets = legacy_resolve_all_datasets_available_for_import()
    return [*datasets, *legacy_datasets]


AllDatasetForImportField = graphene.Field(
    graphene.List(
        ImportDatasetNode,
    ),
    resolver=resolve_datasets_for_import,
)

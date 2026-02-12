import csv
import traceback
from os import listdir
from os.path import join, isfile, exists
from pathlib import Path, PureWindowsPath
from typing import Optional

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


def get_dataset_path_str(path: PureWindowsPath) -> PureWindowsPath:
    return PureWindowsPath(
        join(
            settings.DATASET_EXPORT_PATH,
            "/".join(path.parts).split("/".join(settings.DATASET_EXPORT_PATH.parts))[1][
                1:
            ],
        )
    )


def get_import_dataset_node(path: PureWindowsPath) -> Optional[ImportDatasetNode]:
    json_path = join(path, "dataset.json")
    node = ImportDatasetNode()
    node.name = path.stem
    node.path = "/".join(get_dataset_path_str(path).parts)
    try:
        dataset = OSEkitDataset.from_json(Path(json_path))
        node.analysis = resolve_all_spectrogram_analysis_available_for_import(
            dataset,
            folder=path.stem,
        )
        if len(node.analysis) > 0:
            return node
    except Exception:
        node.failed = True
        node.stack = traceback.format_exc()
        return node


def browse_folder(
    root: PureWindowsPath, legacy_path: list[PureWindowsPath]
) -> list[ImportDatasetNode]:
    nodes: list[ImportDatasetNode] = []
    for folder in listdir(root):
        path = PureWindowsPath(join(root, folder))
        path_name = get_dataset_path_str(path)
        if isfile(path):
            continue
        if path_name in legacy_path:
            # Do not explore legacy datasets
            continue
        json_path = join(path, "dataset.json")
        if exists(json_path):
            # This folder is a dataset
            d = get_import_dataset_node(path)
            if d is not None:
                nodes.append(d)
        else:
            # This is not a dataset
            nodes.extend(browse_folder(path, legacy_path))
    return nodes


def resolve_all_datasets_available_for_import() -> list[ImportDatasetNode]:
    """List dataset available for import"""
    # pylint: disable=broad-exception-caught
    return browse_folder(
        root=PureWindowsPath(settings.DATASET_IMPORT_FOLDER),
        legacy_path=[
            PureWindowsPath(
                join(
                    settings.DATASET_EXPORT_PATH,
                    PureWindowsPath(d["path"]),
                )
            )
            for d in get_legacy_datasets()
        ],
    )


def get_legacy_datasets() -> list[dict]:
    datasets_csv_path = settings.DATASET_IMPORT_FOLDER / settings.DATASET_FILE
    datasets: list[dict] = []
    if not exists(datasets_csv_path):
        return datasets
    with open(datasets_csv_path, encoding="utf-8") as csvfile:
        dataset: dict
        for dataset in csv.DictReader(csvfile):
            datasets.append(dataset)
    return datasets


@deprecated(
    "Use resolve_all_datasets_available_for_import with the recent version of OSEkit"
)
def legacy_resolve_all_datasets_available_for_import() -> list[ImportDatasetNode]:
    """Get all datasets for import - using legacy OSEkit"""
    # pylint: disable=broad-exception-caught
    all_datasets = get_legacy_datasets()
    available_datasets: list[ImportDatasetNode] = []
    dataset: dict
    for dataset in all_datasets:

        # Get dataset
        available_dataset: Optional[ImportDatasetNode] = None
        path = join(
            settings.DATASET_EXPORT_PATH,
            PureWindowsPath(dataset["path"]),
        )
        for d in available_datasets:
            if PureWindowsPath(d.path) == PureWindowsPath(path):
                available_dataset = d
        if not available_dataset:
            # noinspection PyTypeChecker
            available_dataset = ImportDatasetNode()
            available_dataset.name = dataset["dataset"]
            available_dataset.path = path
            available_dataset.analysis = []
            available_dataset.legacy = True

        # Get its analysis
        try:
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
        except Exception:
            available_dataset.failed = True
            available_dataset.stack = traceback.format_exc()
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

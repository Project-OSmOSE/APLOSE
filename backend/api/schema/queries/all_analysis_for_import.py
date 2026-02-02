from os import listdir
from os.path import join, isfile, exists
from pathlib import PureWindowsPath

import graphene
from django.conf import settings
from django_extension.schema.permissions import GraphQLResolve, GraphQLPermissions
from osekit.public_api.dataset import (
    Dataset as OSEkitDataset,
    SpectroDataset as OSEkitSpectroDataset,
)
from typing_extensions import deprecated

from backend.api.models import SpectrogramAnalysis, Dataset
from backend.api.schema.nodes import ImportAnalysisNode


def resolve_all_spectrogram_analysis_available_for_import(
    dataset: OSEkitDataset,
    folder: str,
) -> [ImportAnalysisNode]:
    """List spectrogram analysis available for import"""
    known_spectrogram_analysis = SpectrogramAnalysis.objects.filter(
        dataset__name=folder,
        dataset__path=folder,
    ).values_list("name", flat=True)

    available_analyses: [ImportAnalysisNode] = []
    for [name, d] in dataset.datasets.items():
        if d["class"] != OSEkitSpectroDataset.__name__:
            continue
        if name in known_spectrogram_analysis:
            continue
        analysis = ImportAnalysisNode()
        analysis.name = name
        analysis.path = str(d["dataset"].folder).split(folder)[1].strip("\\").strip("/")
        available_analyses.append(analysis)
    return available_analyses


@deprecated(
    "Use resolve_all_spectrogram_analysis_available_for_import with the recent version of OSEkit"
)
def legacy_resolve_all_spectrogram_analysis_available_for_import(
    dataset_name: str,
    dataset_path: str,
    config_folder: str,
) -> [ImportAnalysisNode]:
    """[Legacy] List spectrogram analysis available for import"""
    known_analysis_names = SpectrogramAnalysis.objects.filter(
        dataset__name=dataset_name,
        dataset__path=dataset_path,
    ).values_list("name", flat=True)

    available_analyses: [ImportAnalysisNode] = []
    spectro_root = join(
        settings.DATASET_IMPORT_FOLDER,
        PureWindowsPath(dataset_path),
        "processed",
        "spectrogram",
        config_folder,
    )

    spectro_folders = [
        f for f in listdir(spectro_root) if not isfile(join(spectro_root, f))
    ]
    for folder in spectro_folders:
        csv_path = join(spectro_root, folder, "metadata.csv")
        if not exists(csv_path):
            continue
        if folder in known_analysis_names:
            continue
        analysis = ImportAnalysisNode()
        analysis.name = folder
        analysis.path = join(
            "processed",
            "spectrogram",
            config_folder,
            folder,
        )
        available_analyses.append(analysis)
    return available_analyses


@GraphQLResolve(permission=GraphQLPermissions.STAFF_OR_SUPERUSER)
def resolve_analysis_for_import(root, _, dataset_id: int):
    """Get all datasets for import"""
    dataset = Dataset.objects.get(pk=dataset_id)

    if dataset.legacy:
        return legacy_resolve_all_spectrogram_analysis_available_for_import(
            dataset_name=dataset.name,
            dataset_path=dataset.path,
            config_folder=dataset.get_config_folder(),
        )

    return resolve_all_spectrogram_analysis_available_for_import(
        dataset=dataset.get_osekit_dataset(), folder=dataset.path
    )


AllAnalysisForImportField = graphene.Field(
    graphene.List(
        ImportAnalysisNode,
    ),
    dataset_id=graphene.ID(required=True),
    resolver=resolve_analysis_for_import,
)

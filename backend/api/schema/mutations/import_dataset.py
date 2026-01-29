import csv
from os import listdir
from os.path import join, exists, isfile
from pathlib import Path, PureWindowsPath

from django.conf import settings
from django.db import transaction
from django_extension.schema.permissions import GraphQLResolve, GraphQLPermissions
from graphene import (
    String,
    Boolean,
    Mutation,
)
from graphql import GraphQLError
from osekit.core_api.spectro_dataset import SpectroDataset
from osekit.public_api.dataset import (
    Dataset as OSEkitDataset,
)

from backend.api.models import Dataset
from .import_analysis import ImportAnalysisMutation


class ImportDatasetMutation(Mutation):
    """Import dataset mutation"""

    class Arguments:
        name = String(required=True)
        path = String(required=True)
        legacy = Boolean()

    ok = Boolean(required=True)

    @GraphQLResolve(permission=GraphQLPermissions.STAFF_OR_SUPERUSER)
    @transaction.atomic
    def mutate(self, info, name, path, legacy):
        """Do the mutation: create the dataset and all of its analysis"""
        dataset, _ = Dataset.objects.get_or_create(
            name=name,
            path=path,
            owner=info.context.user,
            legacy=legacy or False,
        )
        if legacy:
            datasets_csv_path: PureWindowsPath = (
                settings.DATASET_IMPORT_FOLDER / settings.DATASET_FILE
            )
            if not exists(datasets_csv_path):
                raise GraphQLError(message="Missing datasets.csv file")
            with open(datasets_csv_path, encoding="utf-8") as csvfile:
                _d: dict
                csv_dataset: dict = None
                for _d in csv.DictReader(csvfile):
                    if dataset.name == _d.get("dataset") and dataset.path == _d.get(
                        "path"
                    ):
                        csv_dataset = _d
                if not csv_dataset:
                    raise GraphQLError(message="Dataset not found")
                config_folder = (
                    f"{csv_dataset['spectro_duration']}_{csv_dataset['dataset_sr']}"
                )
                spectro_root = join(
                    settings.DATASET_IMPORT_FOLDER,
                    path,
                    "processed",
                    "spectrogram",
                    config_folder,
                )
                spectro_folders = [
                    f
                    for f in listdir(spectro_root)
                    if not isfile(join(spectro_root, f))
                ]
                for folder in spectro_folders:
                    csv_path = join(spectro_root, folder, "metadata.csv")
                    if not exists(csv_path):
                        continue
                    analysis_mutation = ImportAnalysisMutation()
                    analysis_mutation.mutate(
                        info,
                        dataset_name=dataset.name,
                        dataset_path=dataset.path,
                        legacy=dataset.legacy,
                        name=folder,
                        path=join(
                            "processed",
                            "spectrogram",
                            config_folder,
                            folder,
                        ),
                    )

        else:
            json_path = join(settings.DATASET_IMPORT_FOLDER, path, "dataset.json")
            d = OSEkitDataset.from_json(Path(json_path))
            for [analysis, d] in d.datasets.items():
                if d["class"] != SpectroDataset.__name__:
                    continue
                analysis_mutation = ImportAnalysisMutation()
                analysis_mutation.mutate(
                    info,
                    dataset_name=dataset.name,
                    dataset_path=dataset.path,
                    legacy=dataset.legacy,
                    name=analysis,
                    path=str(d["dataset"].folder).split(path)[1].strip("\\").strip("/"),
                )

        return ImportDatasetMutation(ok=True)

"""Dataset schema"""
import csv
from os import listdir
from os.path import join, exists, isfile
from pathlib import Path

from django.conf import settings
from django.db import transaction
from graphene import (
    String,
    Boolean,
    ObjectType,
    Mutation,
)
from osekit.core_api.spectro_dataset import SpectroDataset
from osekit.public_api.dataset import (
    Dataset as OSEkitDataset,
)

from backend.api.models import Dataset
from backend.api.schema.data.spectrogram_analysis__mutation import (
    ImportSpectrogramAnalysisMutation,
)
from backend.utils.schema import GraphQLResolve, GraphQLPermissions


class ImportDatasetMutation(Mutation):
    class Arguments:
        name = String(required=True)
        path = String(required=True)
        legacy = Boolean()

    ok = Boolean()

    @GraphQLResolve(permission=GraphQLPermissions.STAFF_OR_SUPERUSER)
    @transaction.atomic
    def mutate(root, info, name, path, legacy):
        if not Dataset.objects.filter(name=name, path=path).exists():
            dataset: Dataset = Dataset.objects.create(
                name=name,
                path=path,
                owner=info.context.user,
                legacy=legacy,
            )
        else:
            dataset: Dataset = Dataset.objects.get(
                name=name,
                path=path,
                legacy=legacy,
            )
        if legacy:
            datasets_csv_path = settings.DATASET_IMPORT_FOLDER / settings.DATASET_FILE
            if not exists(datasets_csv_path):
                return ImportDatasetMutation(ok=False)
            with open(datasets_csv_path, encoding="utf-8") as csvfile:
                _d: dict
                csv_dataset: dict = next(
                    _d
                    for _d in csv.DictReader(csvfile)
                    if dataset.name == _d["dataset"] and dataset.path == _d["path"]
                )
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
                    analysis_mutation = ImportSpectrogramAnalysisMutation()
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
            json_path = join(path, "dataset.json")
            d = OSEkitDataset.from_json(Path(json_path))
            for [name, d] in d.datasets.items():
                if d["class"] != SpectroDataset.__name__:
                    continue
                analysis_mutation = ImportSpectrogramAnalysisMutation()
                analysis_mutation.mutate(
                    info,
                    name=name,
                    path=str(d["dataset"].folder).split(path)[1].strip("\\").strip("/"),
                )

        return ImportDatasetMutation(ok=True)


class DatasetMutation(ObjectType):
    """Dataset mutations"""

    import_dataset = ImportDatasetMutation.Field()

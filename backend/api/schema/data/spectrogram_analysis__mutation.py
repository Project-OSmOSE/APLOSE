"""SpectrogramAnalysis schema"""
import csv
import json
from datetime import datetime, timedelta
from os.path import join
from pathlib import Path
from typing import Optional

from django.conf import settings
from django.db import transaction
from graphene import (
    ObjectType,
    String,
    Mutation,
    Boolean,
)
from metadatax.data.models import FileFormat
from osekit.config import TIMESTAMP_FORMAT_EXPORTED_FILES_LOCALIZED
from osekit.core_api.spectro_dataset import SpectroDataset

from backend.api.models import (
    Dataset,
    SpectrogramAnalysis,
    Colormap,
    FFT,
    Spectrogram,
    LinearScale,
    MultiLinearScale,
    LegacySpectrogramConfiguration,
)
from backend.utils.schema import GraphQLResolve, GraphQLPermissions


class ImportSpectrogramAnalysisMutation(Mutation):
    class Arguments:
        dataset_name = String(required=True)
        dataset_path = String(required=True)
        legacy = Boolean()
        name = String(required=True)
        path = String(required=True)

    ok = Boolean()

    @GraphQLResolve(permission=GraphQLPermissions.STAFF_OR_SUPERUSER)
    @transaction.atomic
    def mutate(root, info, dataset_name, dataset_path, legacy, name, path):
        if Dataset.objects.filter(name=dataset_name, path=dataset_path).exists():
            dataset: Dataset = Dataset.objects.get(
                name=dataset_name,
                path=dataset_path,
                legacy=legacy,
            )
        else:
            dataset: Dataset = Dataset.objects.create(
                name=dataset_name,
                path=dataset_path,
                owner=info.context.user,
                legacy=legacy,
            )
        if SpectrogramAnalysis.objects.filter(dataset=dataset, name=name).exists():
            return ImportSpectrogramAnalysisMutation(ok=False)

        spectrograms_data = []
        if dataset.legacy:
            # Get metadata
            audio_csv_path = join(
                settings.DATASET_IMPORT_FOLDER,
                dataset.path,
                "data",
                "audio",
                Path(path).parts[-2],  # audio config folder
                "metadata.csv",
            )
            with open(audio_csv_path, encoding="utf-8") as csvfile:
                audio: dict = next(csv.DictReader(csvfile))
            spectrogram_csv_path = join(
                settings.DATASET_IMPORT_FOLDER, dataset.path, path, "metadata.csv"
            )
            with open(spectrogram_csv_path, encoding="utf-8") as csvfile:
                spectro: dict = next(csv.DictReader(csvfile))

            overlap = float(spectro["overlap"])
            fft, _ = FFT.objects.get_or_create(
                nfft=int(spectro["nfft"]),
                window_size=int(spectro["window_size"]),
                overlap=overlap if overlap < 1 else overlap / 100,
                sampling_frequency=audio["dataset_sr"],
                legacy=True,
            )
            colormap, _ = Colormap.objects.get_or_create(name=spectro["colormap"])
            custom_frequency_scale: (
                Optional[LinearScale],
                Optional[MultiLinearScale],
            ) = (None, None)
            if "custom_frequency_scale" in spectro:
                custom_frequency_scale = get_frequency_scales(
                    spectro["custom_frequency_scale"],
                    int(audio["dataset_sr"]),
                )
            analysis: SpectrogramAnalysis = SpectrogramAnalysis.objects.create(
                dataset=dataset,
                name=name,
                path=path,
                start_date=datetime.fromisoformat(audio["start_date"]),
                end_date=datetime.fromisoformat(audio["end_date"]),
                data_duration=int(audio["audio_file_dataset_duration"]),
                fft=fft,
                legacy_configuration=LegacySpectrogramConfiguration.objects.create(
                    folder=Path(path).parts[-1],
                    zoom_level=spectro["zoom_level"],
                    hp_filter_min_frequency=spectro["hp_filter_min_freq"],
                    data_normalization=spectro["data_normalization"],
                    spectrogram_normalization=spectro["spectro_normalization"],
                    zscore_duration=spectro["zscore_duration"]
                    if spectro["data_normalization"] == "zscore"
                    else None,
                    window_type=spectro["window_type"],
                    peak_voltage=spectro["peak_voltage"]
                    if spectro["data_normalization"] == "instrument"
                    and "peak_voltage" in spectro
                    else None,
                    sensitivity_dB=spectro["sensitivity_dB"]
                    if spectro["data_normalization"] == "instrument"
                    and "sensitivity_dB" in spectro
                    else None,
                    frequency_resolution=spectro["frequency_resolution"]
                    if "frequency_resolution" in spectro
                    else None,
                    temporal_resolution=spectro["temporal_resolution"]
                    if "temporal_resolution" in spectro
                    else None,
                    linear_frequency_scale=custom_frequency_scale[0],
                    multi_linear_frequency_scale=custom_frequency_scale[1],
                ),
                colormap=colormap,
                dynamic_min=int(spectro["dynamic_min"]),
                dynamic_max=int(spectro["dynamic_max"]),
                owner=info.context.user,
                legacy=True,
            )

            # Get spectrograms

            audio_csv_path = join(
                settings.DATASET_IMPORT_FOLDER,
                dataset.path,
                "data",
                "audio",
                Path(path).parts[-2],  # audio config folder
                "timestamp.csv",
            )
            with open(audio_csv_path, encoding="utf-8") as csvfile:
                files: [dict] = [f for f in csv.DictReader(csvfile)]

            file: dict
            for file in files:
                filename = Path(file["filename"]).stem
                start = datetime.fromisoformat(file["timestamp"])
                spectrograms_data.append(
                    {
                        "filename": filename,
                        "start": start,
                        "end": start
                        + timedelta(seconds=int(audio["audio_file_dataset_duration"])),
                    }
                )

        else:
            sd = SpectroDataset.from_json(
                Path(
                    join(
                        str(settings.DATASET_IMPORT_FOLDER),
                        dataset_path,
                        path,
                        f"{name}.json",
                    )
                )
            )
            colormap, _ = Colormap.objects.get_or_create(name=sd.colormap)
            dynamic_min = [d.v_lim[0] for d in sd.data]
            dynamic_max = [d.v_lim[1] for d in sd.data]
            fft, _ = FFT.objects.get_or_create(
                nfft=sd.fft.mfft,
                window=json.dumps(list(sd.fft.win)),
                window_size=sd.fft.win.size,
                overlap=1 - (sd.fft.hop / sd.fft.win.size),
                sampling_frequency=sd.fft.fs,
                scaling=sd.fft.scaling,
            )
            analysis: SpectrogramAnalysis = SpectrogramAnalysis.objects.create(
                dataset=dataset,
                name=sd.name,
                path=str(sd.folder).split(dataset.path)[1].strip("\\").strip("/"),
                owner=info.context.user,
                start_date=sd.begin,
                end_date=sd.end,
                data_duration=sd.data_duration.seconds,
                fft=fft,
                colormap=colormap,
                dynamic_min=max(set(dynamic_min), key=dynamic_min.count),
                dynamic_max=max(set(dynamic_max), key=dynamic_max.count),
            )

            for data in sd.data:
                spectrograms_data.append(
                    {
                        "filename": data.begin.strftime(
                            TIMESTAMP_FORMAT_EXPORTED_FILES_LOCALIZED
                        ),
                        "start": data.begin,
                        "end": data.end,
                    }
                )

        existing_spectrograms = []
        new_spectrograms = []
        img_format, _ = FileFormat.objects.get_or_create(name="png")
        dataset_spectrograms = Spectrogram.objects.filter(analysis__dataset=dataset)
        for data in spectrograms_data:
            if dataset_spectrograms.filter(
                filename=data["filename"],
                format=img_format,
                start=data["start"],
                end=data["end"],
            ).exists():
                existing_spectrograms.append(
                    dataset_spectrograms.filter(
                        filename=data["filename"],
                        format=img_format,
                        start=data["start"],
                        end=data["end"],
                    ).first()
                )
            else:
                new_spectrograms.append(
                    Spectrogram(
                        filename=data["filename"],
                        format=img_format,
                        start=data["start"],
                        end=data["end"],
                    )
                )

        new_spectrograms: [Spectrogram] = Spectrogram.objects.filter(
            analysis__dataset=dataset
        ).bulk_create(new_spectrograms, ignore_conflicts=True)

        spectrogram_analysis_rel = []
        for spectrogram in existing_spectrograms:
            spectrogram_analysis_rel.append(
                Spectrogram.analysis.through(
                    spectrogram=spectrogram, spectrogramanalysis=analysis
                )
            )
        for spectrogram in new_spectrograms:
            spectrogram.save()
            spectrogram_analysis_rel.append(
                Spectrogram.analysis.through(
                    spectrogram=spectrogram, spectrogramanalysis=analysis
                )
            )
        Spectrogram.analysis.through.objects.bulk_create(spectrogram_analysis_rel)
        return ImportSpectrogramAnalysisMutation(ok=True)


def get_frequency_scales(
    name: str, sample_rate: int
) -> (Optional[LinearScale], Optional[MultiLinearScale]):
    """return scale type, min freq, max freq and parameters for multiscale"""
    if name.lower() == "porp_delph":
        scale, _ = MultiLinearScale.objects.get_or_create(
            name="porp_delph",
        )
        scale.inner_scales.get_or_create(ratio=0.5, min_value=0, max_value=30_000)
        scale.inner_scales.get_or_create(ratio=0.7, min_value=30_000, max_value=80_000)
        scale.inner_scales.get_or_create(
            ratio=1, min_value=80_000, max_value=sample_rate / 2
        )
        scale.save()
        return None, scale
    if name.lower() == "dual_lf_hf":
        scale, _ = MultiLinearScale.objects.get_or_create(
            name="dual_lf_hf",
        )
        scale.inner_scales.get_or_create(ratio=0.5, min_value=0, max_value=22_000)
        scale.inner_scales.get_or_create(
            ratio=1, min_value=100_000, max_value=sample_rate / 2
        )
        scale.save()
        return None, scale
    if name.lower() == "audible":
        scale, _ = LinearScale.objects.get_or_create(
            name="audible", min_value=0, max_value=22_000
        )
        return scale, None
    return None, None


class SpectrogramAnalysisMutation(ObjectType):
    """SpectrogramAnalysis mutations"""

    import_spectrogram_analysis = ImportSpectrogramAnalysisMutation.Field()

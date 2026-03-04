import csv
from ast import literal_eval
from pathlib import PureWindowsPath, Path

from django.db.models import F, QuerySet
from django.db.models.functions import Concat
from metadatax.data.models import FileFormat

from backend.api.models import (
    Dataset,
    SpectrogramAnalysis,
    Colormap,
    FFT,
    LinearScale,
    MultiLinearScale,
    LegacySpectrogramConfiguration,
    Spectrogram,
)
from backend.aplose.models import User
from backend.storage.exceptions import CannotGetChildrenException
from backend.storage.types import (
    StorageAnalysis,
    ImportStatus,
    StorageDataset,
    StorageFolder,
    StorageItem,
)
from backend.storage.utils import make_path_relative, clean_path, join, open_file
from backend.utils.osekit_replace import SpectroDataset, TFile
from ._abstract import AbstractResolver
from ._osekit import OSEkitResolver
from ...api.models.data.scales import get_frequency_scales


class ModelResolver(AbstractResolver):

    __osekit: OSEkitResolver

    __dataset: Dataset | None
    __analysis: SpectrogramAnalysis | None

    def __init__(self, osekit: OSEkitResolver):
        self.__osekit = osekit
        super().__init__(osekit.path)

        self.__dataset = self.__get_dataset_model()
        self.__analysis = self.__get_analysis_model()

    def __get_dataset_model(self, path: str | None = None) -> Dataset | None:
        return Dataset.objects.filter(path=path or self.path).first()

    def __get_all_analysis_model(
        self, path: str | None = None
    ) -> QuerySet[SpectrogramAnalysis] | None:
        return SpectrogramAnalysis.objects.annotate(
            complete_path=Concat(F("path"), F("dataset__path"))
        ).filter(dataset=self.__get_dataset_model(path) if path else self.__dataset)

    def __get_analysis_model(
        self, path: str | None = None
    ) -> type[SpectrogramAnalysis] | None:
        return (
            self.__get_all_analysis_model(path)
            .filter(complete_path=path or self.path)
            .first()
        )

    def get_dataset(self, path: str | None = None) -> StorageDataset | StorageFolder:
        if path is None:
            dataset = self.__dataset
        else:
            dataset = self.__get_dataset_model(path)

        print("ModelResolver.get_dataset", path, dataset)
        if dataset is None:
            return self.__osekit.get_dataset(path)

        status = ImportStatus.Imported
        for spectro_dataset in self.__osekit.get_all_spectro_dataset(path):
            if (
                not self.__get_all_analysis_model(path)
                .filter(complete_path=make_path_relative(spectro_dataset.folder))
                .exists()
            ):
                status = ImportStatus.Partial
                break

        return StorageDataset(
            name=dataset.name,
            path=dataset.path,
            import_status=status,
            model=dataset,
        )

    def get_analysis(
        self,
        path: str | None = None,
        analysis: SpectrogramAnalysis | None = None,
        spectro_dataset: SpectroDataset | None = None,
    ) -> StorageAnalysis | None:
        __analysis = self.__analysis
        if path:
            __analysis = self.__get_analysis_model(path=path)
        elif analysis:
            __analysis = analysis
        analysis = __analysis

        if analysis is None:
            return self.__osekit.get_analysis(spectro_dataset)

        return StorageAnalysis(
            name=analysis.name,
            path=analysis.path,
            import_status=ImportStatus.Imported,
            model=analysis,
        )

    def get_child_items(self, path: str | None = None) -> list[StorageItem]:
        if path:
            analysis = self.__get_analysis_model(path=path)
            dataset = self.__get_dataset_model(path=path)
        else:
            analysis = self.__analysis
            dataset = self.__dataset

        if analysis:
            raise CannotGetChildrenException(self.path)

        qs = self.__get_all_analysis_model(path)
        if dataset:
            all_analysis: list[StorageAnalysis] = []
            for sd in self.__osekit.get_all_spectro_dataset():
                osekit_storage_analysis = self.__osekit.get_analysis(spectro_dataset=sd)
                known = qs.filter(path=osekit_storage_analysis.path).first()
                all_analysis.append(
                    self.get_analysis(analysis=known, spectro_dataset=sd)
                )
            return all_analysis

        return self.__osekit.get_child_items()

    def get_or_create_dataset(self, owner: User) -> Dataset:
        """Get or create dataset model."""
        if not self.__dataset:
            dataset = self.__osekit._get_osekit_dataset(self.path, deep=True)[0]
            self.__dataset = Dataset.objects.create(
                name=PureWindowsPath(dataset.folder).name,
                path=make_path_relative(dataset.folder),
                owner=owner,
                legacy=self.__osekit._is_legacy,
            )
        return self.__dataset

    def create_analysis(
        self, owner: User, spectro_dataset: SpectroDataset | None = None
    ) -> SpectrogramAnalysis:
        """Create analysis model."""
        spectro_dataset = spectro_dataset or self.__osekit.spectro_dataset

        colormap, _ = Colormap.objects.get_or_create(
            name=spectro_dataset.colormap or "viridis"
        )

        osekit_fft = spectro_dataset.fft
        fft, _ = FFT.objects.get_or_create(
            nfft=osekit_fft.mfft,
            window_size=osekit_fft.win.size,
            overlap=1 - (osekit_fft.hop / osekit_fft.win.size),
            sampling_frequency=osekit_fft.fs,
            scaling=osekit_fft.scaling,
            legacy=False,
        )
        relative_path = make_path_relative(
            spectro_dataset.folder, to=self.__dataset.path
        )

        self.__analysis = SpectrogramAnalysis.objects.create(
            dataset=self.__dataset,
            name=spectro_dataset.name,
            path=relative_path,
            owner=owner,
            start=spectro_dataset.begin,
            end=spectro_dataset.end,
            data_duration=spectro_dataset.data_duration.seconds,
            fft=fft,
            colormap=colormap,
            dynamic_min=spectro_dataset.v_lim[0],
            dynamic_max=spectro_dataset.v_lim[1],
            legacy=self.__osekit._is_legacy,
        )
        if self.__osekit._is_legacy:
            with open_file(
                join(self.__dataset.path, self.__analysis.path, "metadata.csv")
            ) as csvfile:
                spectro = next(csv.DictReader(csvfile))
            with open_file(
                join(
                    self.__dataset.path,
                    f"data/audio/{Path(self.__analysis.path).parts[-2]}/metadata.csv",
                )
            ) as csvfile:
                audio = next(csv.DictReader(csvfile))
            custom_frequency_scale: tuple[
                LinearScale | None,
                MultiLinearScale | None,
            ] = (None, None)
            if "custom_frequency_scale" in spectro:
                custom_frequency_scale = get_frequency_scales(
                    spectro["custom_frequency_scale"],
                    int(audio["dataset_sr"]),
                )
            LegacySpectrogramConfiguration.objects.create(
                spectrogram_analysis_id=self.__analysis.id,
                folder=Path(self.__analysis.path).parts[-1],
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
                audio_files_subtypes=literal_eval(audio["sample_bits"]),
                channel_count=audio["channel_count"],
            )

        self.__create_analysis_files(spectro_dataset)
        return self.__analysis

    def __create_analysis_files(self, spectro_dataset: SpectroDataset | None = None):
        files = self.__osekit._get_analysis_spectro_files(spectro_dataset)

        img_format, _ = FileFormat.objects.get_or_create(name="png")

        def spectrogram_info_for_file(file: TFile) -> dict:
            return {
                "filename": PureWindowsPath(file.path).name,
                "format": img_format,
                "start": file.begin,
                "end": file.end,
            }

        Spectrogram.objects.bulk_create(
            [Spectrogram(**spectrogram_info_for_file(file)) for file in files],
            ignore_conflicts=True,
        )

        Spectrogram.analysis.through.objects.bulk_create(
            [
                Spectrogram.analysis.through(
                    spectrogram=Spectrogram.objects.get(
                        **spectrogram_info_for_file(file)
                    ),
                    spectrogramanalysis=self.__analysis,
                )
                for file in files
            ]
        )
        self.__analysis.update_dates()

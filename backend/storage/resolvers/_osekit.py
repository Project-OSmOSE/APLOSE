from pathlib import PureWindowsPath, Path

from metadatax.data.models import FileFormat
from osekit.core_api.spectro_dataset import SpectroDataset
from osekit.public_api.dataset import Dataset as OSEkitDataset

from backend.api.models import SpectrogramAnalysis, Dataset, Colormap, FFT, Spectrogram
from backend.storage.types import (
    FailedItem,
)
from backend.storage.utils import (
    exists,
    join,
    make_path_relative,
    make_absolute_server,
    make_static_url,
    clean_path,
)

# from backend.utils.osekit_replace import SpectroDataset, OSEkitDataset
from ._legacy_osekit import LegacyOSEkitResolver


class OSEkitResolver(LegacyOSEkitResolver):

    # Utils

    def _get_osekit_dataset(self, path: str) -> OSEkitDataset | None:
        json_path = join(path, "dataset.json")
        if exists(json_path):
            return OSEkitDataset.from_json(Path(make_absolute_server(json_path)))
        return None

    # Implements

    def _get_dataset_for_path(
        self, path: str | None = None
    ) -> Dataset | FailedItem | None:
        # pylint: disable=broad-exception-caught
        try:
            dataset = self._get_osekit_dataset(path)
            if not dataset:
                return super()._get_dataset_for_path(path=path)
            return Dataset(
                name=PureWindowsPath(path).name,
                path=make_path_relative(path),
            )
        except Exception as e:
            return FailedItem(path=path, error=e)

    def _get_all_analysis_for_dataset(
        self, dataset: Dataset, detailed: bool = False
    ) -> list[SpectrogramAnalysis]:
        osekit_dataset = self._get_osekit_dataset(dataset.path)
        if not osekit_dataset:
            return super()._get_all_analysis_for_dataset(dataset=dataset)

        analysis: list[SpectrogramAnalysis] = []
        for _name, info in osekit_dataset.datasets.items():
            if info["class"] != SpectroDataset.__name__:
                continue
            analysis.append(
                self._get_analysis(
                    dataset=dataset,
                    relative_path=make_path_relative(
                        PureWindowsPath(info["dataset"]).parent.as_posix(),
                        to=dataset.path,
                    ),
                    detailed=detailed,
                )
            )
        return analysis

    def _get_analysis(
        self, dataset: Dataset, relative_path: str, detailed: bool = False
    ) -> SpectrogramAnalysis | FailedItem | None:
        if dataset.legacy:
            return super()._get_analysis(
                dataset=dataset, relative_path=relative_path, detailed=detailed
            )
        osekit_dataset = self._get_osekit_dataset(dataset.path)
        spectro_dataset: SpectroDataset | None = None
        if not osekit_dataset:
            return None
        for _name, info in osekit_dataset.datasets.items():
            if info["class"] != SpectroDataset.__name__:
                continue
            path = make_path_relative(
                PureWindowsPath(info["dataset"]).parent.as_posix(),
                to=dataset.path,
            )
            if path == relative_path:
                if not detailed:
                    return SpectrogramAnalysis(
                        name=PureWindowsPath(relative_path).name,
                        path=relative_path,
                    )
                spectro_dataset = osekit_dataset.get_dataset(info["analysis"])

        if spectro_dataset is None:
            return None

        if not detailed:
            return SpectrogramAnalysis(name=spectro_dataset.name, path=relative_path)
        return SpectrogramAnalysis(
            name=spectro_dataset.name,
            path=relative_path,
            start=spectro_dataset.begin,
            end=spectro_dataset.end,
            dataset=dataset,
            data_duration=spectro_dataset.data_duration.seconds,
            fft=FFT(
                nfft=spectro_dataset.fft.mfft,
                window_size=spectro_dataset.fft.win.size,
                overlap=1 - (spectro_dataset.fft.hop / spectro_dataset.fft.win.size),
                sampling_frequency=spectro_dataset.fft.fs,
                scaling=spectro_dataset.fft.scaling,
            ),
            colormap=Colormap(name=spectro_dataset.colormap or "viridis"),
            dynamic_min=spectro_dataset.v_lim[0],
            dynamic_max=spectro_dataset.v_lim[1],
        )

    def __get_spectro_dataset(
        self, analysis: SpectrogramAnalysis
    ) -> SpectroDataset | None:
        json_path = join(analysis.dataset.path, "dataset.json")
        if not exists(json_path):
            return None
        osekit_dataset = OSEkitDataset.from_json(Path(make_absolute_server(json_path)))
        return osekit_dataset.get_dataset(analysis.name)

    def get_all_spectrograms_for_analysis(
        self, analysis: SpectrogramAnalysis
    ) -> list[Spectrogram]:
        sd = self.__get_spectro_dataset(analysis=analysis)
        if not sd:
            return super().get_all_spectrograms_for_analysis(analysis=analysis)
        img_format, _ = FileFormat.objects.get_or_create(name="png")
        return [
            Spectrogram(
                format=img_format,
                filename=data.name,
                start=data.begin,
                end=data.end,
            )
            for data in sd.data
        ]

    def get_spectrogram_paths(
        self, spectrogram: Spectrogram, analysis: SpectrogramAnalysis
    ) -> tuple[str | None, str | None]:
        sd = self.__get_spectro_dataset(analysis=analysis)
        if not sd:
            return super().get_spectrogram_paths(
                spectrogram=spectrogram, analysis=analysis
            )

        for spectro_data in sd.data:
            if spectro_data.name == spectrogram.filename:
                file = spectro_data.audio_data.files.pop(0)
                return (
                    make_static_url(Path(file.path).resolve()) if file else None,
                    make_static_url(
                        join(
                            clean_path(sd.folder),
                            "spectrogram",
                            f"{spectrogram.filename}.png",
                        )
                    ),
                )

        return None, None

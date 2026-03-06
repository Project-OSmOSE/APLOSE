import json
from pathlib import PureWindowsPath, Path

from metadatax.data.models import FileFormat
from osekit.config import TIMESTAMP_FORMAT_EXPORTED_FILES_LOCALIZED
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
    open_file,
)
from ._legacy_osekit import LegacyOSEkitResolver
from ..exceptions import AnalysisNotFoundException


class OSEkitResolver(LegacyOSEkitResolver):
    def _get_dataset_for_path(
        self, path: str | None = None
    ) -> Dataset | FailedItem | None:
        # pylint: disable=broad-exception-caught
        json_path = join(path, "dataset.json")
        if exists(json_path):
            try:
                with open_file(json_path) as f:
                    d = json.loads(f.read())
                    return Dataset(
                        name=PureWindowsPath(d["folder"]).name,
                        path=make_path_relative(path),
                    )
            except Exception as e:
                return FailedItem(path=path, error=e)
        return super()._get_dataset_for_path(path=path)

    def _get_all_analysis_for_dataset(
        self, dataset: Dataset
    ) -> list[SpectrogramAnalysis]:
        json_path = join(dataset.path, "dataset.json")
        if not exists(json_path):
            return super()._get_all_analysis_for_dataset(dataset=dataset)

        analysis: list[SpectrogramAnalysis] = []
        with open_file(json_path) as f:
            d = json.loads(f.read())
            for name, info in d["datasets"].items():
                if info["class"] != SpectroDataset.__name__:
                    continue
                analysis.append(
                    SpectrogramAnalysis(
                        name=name,
                        path=make_path_relative(
                            PureWindowsPath(info["json"]).parent.as_posix(),
                            to=d["folder"],
                        ),
                    )
                )
        return analysis

    def _get_all_detailed_analysis_for_dataset(
        self, dataset: Dataset
    ) -> list[SpectrogramAnalysis]:
        json_path = join(dataset.path, "dataset.json")
        if not exists(json_path):
            return super()._get_all_detailed_analysis_for_dataset(dataset=dataset)
        osekit_dataset = OSEkitDataset.from_json(Path(make_absolute_server(json_path)))
        analysis: list[SpectrogramAnalysis] = []
        for d in osekit_dataset.datasets.values():
            if d["class"] != SpectroDataset.__name__:
                continue
            sd: SpectroDataset = d["dataset"]
            relative_path = make_path_relative(
                sd.folder, to=make_path_relative(osekit_dataset.folder)
            )
            analysis.append(
                SpectrogramAnalysis(
                    name=sd.name,
                    path=relative_path,
                    start=sd.begin,
                    end=sd.end,
                    dataset=dataset,
                    data_duration=sd.data_duration.seconds,
                    fft=FFT(
                        nfft=sd.fft.mfft,
                        window_size=sd.fft.win.size,
                        overlap=1 - (sd.fft.hop / sd.fft.win.size),
                        sampling_frequency=sd.fft.fs,
                        scaling=sd.fft.scaling,
                    ),
                    colormap=Colormap(name=sd.colormap or "viridis"),
                    dynamic_min=sd.v_lim[0],
                    dynamic_max=sd.v_lim[1],
                )
            )
        return analysis

    def __get_spectro_dataset(
        self, analysis: SpectrogramAnalysis
    ) -> SpectroDataset | None:
        json_path = join(analysis.dataset.path, "dataset.json")
        if not exists(json_path):
            return None
        osekit_dataset = OSEkitDataset.from_json(Path(make_absolute_server(json_path)))

        sd: SpectroDataset | None = [
            d["dataset"]
            for d in osekit_dataset.datasets.values()
            if d["class"] == SpectroDataset.__name__
            and make_path_relative(d["dataset"].folder, to=analysis.dataset.path)
            == analysis.path
        ].pop()
        if not sd:
            raise AnalysisNotFoundException(analysis.path)
        return sd

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
                filename=data.begin.strftime(TIMESTAMP_FORMAT_EXPORTED_FILES_LOCALIZED),
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

        audio_path = None
        for spectro_data in sd.data:
            for file in spectro_data.audio_data.files:
                if PureWindowsPath(file.path).name == spectrogram.filename:
                    audio_path = make_static_url(file.path)

        spectro_path = None
        for spectro_data in sd.data:
            path = join(
                clean_path(sd.folder),
                f"{spectro_data.begin.strftime(TIMESTAMP_FORMAT_EXPORTED_FILES_LOCALIZED)}.png",
            )
            if PureWindowsPath(path).name == spectrogram.filename:
                spectro_path = make_static_url(path)
        return audio_path, spectro_path

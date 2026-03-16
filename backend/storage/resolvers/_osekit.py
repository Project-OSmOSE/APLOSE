import json
import traceback
from pathlib import PureWindowsPath, Path

from metadatax.data.models import FileFormat
from osekit.config import TIMESTAMP_FORMAT_EXPORTED_FILES_LOCALIZED

from backend.api.models import SpectrogramAnalysis, Dataset, Colormap, FFT, Spectrogram
from backend.storage.exceptions import AnalysisNotFoundException
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

# from osekit.core_api.spectro_dataset import SpectroDataset
# from osekit.public_api.dataset import Dataset as OSEkitDataset
from backend.utils.osekit_replace import SpectroDataset, OSEkitDataset
from ._legacy_osekit import LegacyOSEkitResolver


class OSEkitResolver(LegacyOSEkitResolver):
    def _get_dataset_for_path(
        self, path: str | None = None
    ) -> Dataset | FailedItem | None:
        # pylint: disable=broad-exception-caught
        json_path = join(path, "dataset.json")
        if exists(json_path):
            try:
                with open_file(json_path) as f:
                    json.loads(f.read())
                    return Dataset(
                        name=PureWindowsPath(path).name,
                        path=make_path_relative(path),
                    )
            except Exception as e:
                return FailedItem(path=path, error=e)
        return super()._get_dataset_for_path(path=path)

    def _get_all_analysis_for_dataset(
        self, dataset: Dataset, detailed: bool = False
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
                    self._get_analysis(
                        dataset=dataset,
                        relative_path=make_path_relative(
                            PureWindowsPath(info["json"]).parent.as_posix(),
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
        spectro_dataset: SpectroDataset | None = None
        json_path = join(dataset.path, "dataset.json")
        if exists(json_path):
            with open_file(json_path) as f:
                d = json.loads(f.read())
                for name, info in d["datasets"].items():
                    if info["class"] != SpectroDataset.__name__:
                        continue
                    path = make_path_relative(
                        PureWindowsPath(info["json"]).parent.as_posix(),
                        to=dataset.path,
                    )
                    if path == relative_path:
                        if not detailed:
                            return SpectrogramAnalysis(
                                name=PureWindowsPath(relative_path).name,
                                path=relative_path,
                            )
                        spectro_dataset = SpectroDataset.from_json(
                            Path(
                                make_absolute_server(
                                    join(
                                        dataset.path,
                                        make_path_relative(
                                            info["json"], to=dataset.path
                                        ),
                                    )
                                )
                            )
                        )
        if spectro_dataset is None:
            return None

        if not detailed:
            return SpectrogramAnalysis(
                name=PureWindowsPath(relative_path).name, path=relative_path
            )
        return SpectrogramAnalysis(
            name=PureWindowsPath(relative_path).name,
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

        sd: list[SpectroDataset] = [
            d["dataset"]
            for d in osekit_dataset.datasets.values()
            if d["class"] == SpectroDataset.__name__
            and make_path_relative(
                d["dataset"].folder, to=clean_path(osekit_dataset.folder)
            )
            == analysis.path
        ]
        if len(sd) == 0:
            raise AnalysisNotFoundException(analysis.path)
        return sd[0]

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

        for spectro_data in sd.data:
            filename = spectro_data.begin.strftime(
                TIMESTAMP_FORMAT_EXPORTED_FILES_LOCALIZED
            )
            if filename == spectrogram.filename:
                file = spectro_data.audio_data.files.pop(0)
                return (
                    make_static_url(Path(file.path).resolve()) if file else None,
                    make_static_url(
                        join(
                            clean_path(sd.folder),
                            "spectrogram",
                            f"{spectro_data.begin.strftime(TIMESTAMP_FORMAT_EXPORTED_FILES_LOCALIZED)}.png",
                        )
                    ),
                )

        return None, None

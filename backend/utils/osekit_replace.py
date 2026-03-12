import json
from os.path import join
from pathlib import PureWindowsPath, Path
from typing import TypedDict

import numpy as np
from osekit.config import TIMESTAMP_FORMATS_EXPORTED_FILES
from osekit.utils.timestamp_utils import strptime_from_text
from pandas import Timestamp, Timedelta
from scipy.signal import ShortTimeFFT

from backend.storage.utils import make_path_relative, clean_path, make_absolute_server


class TFile:
    begin: Timestamp
    end: Timestamp
    path: str

    def __init__(self, begin: Timestamp, end: Timestamp, path: str):
        self.begin = begin
        self.end = end
        self.path = path


class AudioData:
    files: list[TFile]

    def __init__(self, files: list[TFile]):
        self.files = files


class SpectroData:
    name: str
    v_lim: tuple[float, float]
    begin: Timestamp
    end: Timestamp
    duration: Timedelta
    audio_data: AudioData

    def __init__(
        self,
        name: str,
        begin: Timestamp,
        end: Timestamp,
        v_lim: tuple[float, float],
        audio_data: AudioData,
    ):
        self.name = name
        self.begin = begin
        self.end = end
        self.v_lim = v_lim
        self.duration = self.end - self.begin
        self.audio_data = audio_data


class SpectroDataset:
    # pylint: disable=too-many-instance-attributes
    folder: Path
    name: str
    fft: ShortTimeFFT | None
    colormap: str | None

    data: list[SpectroData]
    data_duration: Timedelta
    begin: Timestamp
    end: Timestamp

    __name__ = "type"

    def __init__(
        self,
        folder: Path,
        name: str,
        fft: ShortTimeFFT | None,
        colormap: str | None,
        data: list[SpectroData],
    ):
        self.name = name
        self.folder = folder
        self.fft = fft
        self.colormap = colormap
        self.data = data
        self.begin = min(d.begin for d in data)
        self.end = max(d.end for d in data)
        data_durations = [Timedelta(d.duration).round(freq="1s") for d in data]
        self.data_duration = max(set(data_durations), key=data_durations.count)

    @staticmethod
    def from_json(json_path: Path) -> "SpectroDataset":
        with json_path.open("r") as f:
            dataset_data = json.loads(f.read())
            sft = (
                list(dataset_data["sft"].values())[0]
                if "sft" in dataset_data and dataset_data["sft"]
                else None
            )
            folder = Path(
                PureWindowsPath(json_path).as_posix()[
                    : -len(f"/{json_path.stem}{json_path.suffix}")
                ]
            )
            return SpectroDataset(
                folder=folder,
                name=dataset_data["name"],
                fft=ShortTimeFFT(
                    win=np.array(sft["win"]),
                    hop=sft["hop"],
                    fs=sft["fs"],
                    mfft=sft["mfft"],
                )
                if sft
                else None,
                colormap=list(dataset_data["data"].values())[0]["colormap"],
                data=[
                    SpectroData(
                        name=name,
                        begin=Timestamp(spectro_data["begin"]),
                        end=Timestamp(spectro_data["end"]),
                        v_lim=spectro_data["v_lim"],
                        audio_data=AudioData(
                            files=[
                                TFile(
                                    path=join(
                                        folder,
                                        PureWindowsPath(file["path"])
                                        .as_posix()
                                        .split(PureWindowsPath(folder).stem)
                                        .pop()
                                        .strip("/"),
                                    ),
                                    begin=Timestamp(
                                        strptime_from_text(
                                            file["begin"],
                                            datetime_template=TIMESTAMP_FORMATS_EXPORTED_FILES,
                                        )
                                    ),
                                    end=Timestamp(
                                        strptime_from_text(
                                            file["end"],
                                            datetime_template=TIMESTAMP_FORMATS_EXPORTED_FILES,
                                        )
                                    ),
                                )
                                for name, file in spectro_data["audio_data"][
                                    "files"
                                ].items()
                            ],
                        ),
                    )
                    for name, spectro_data in dataset_data["data"].items()
                ],
            )

    @property
    def v_lim(self) -> tuple[float, float] | None:
        """Return the most frequent v_lim of the spectro dataset."""
        v_lims = [d.v_lim for d in self.data]
        return max(v_lims, key=v_lims.count)


class OSEkitDataset:
    datasets: dict[
        str,
        type[
            TypedDict(
                "",
                {
                    "class": str,
                    "analysis": str,
                    "dataset": SpectroDataset,
                },
            )
        ],
    ]
    folder: Path

    def __init__(self, folder: Path, datasets: dict):
        self.datasets = datasets
        self.folder = folder

    @staticmethod
    def from_json(json_path: Path) -> "OSEkitDataset":
        with json_path.open("r") as f:
            base_path = clean_path(json_path)[: -len("dataset.json")]
            d = json.loads(f.read())
            datasets = {}
            for name, dataset in d["datasets"].items():
                if dataset["class"] != SpectroDataset.__name__:
                    continue
                datasets[name] = {
                    "class": dataset["class"],
                    "analysis": dataset["analysis"],
                    "dataset": SpectroDataset.from_json(
                        Path(
                            join(
                                base_path,
                                make_path_relative(
                                    dataset["json"], to=PureWindowsPath(base_path).stem
                                ),
                            )
                        )
                    ),
                }

            return OSEkitDataset(
                folder=Path(make_absolute_server(make_path_relative(base_path))),
                datasets=datasets,
            )

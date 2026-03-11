import json
from http import HTTPStatus
from io import BytesIO
from pathlib import PureWindowsPath, Path

import matplotlib.pyplot as plt
from django.http import HttpResponse, HttpResponseRedirect, QueryDict
from django.shortcuts import get_object_or_404
from osekit.core_api.audio_data import AudioData
from osekit.core_api.audio_file import AudioFile
from osekit.core_api.spectro_data import SpectroData
from osekit.core_api.spectro_file import SpectroFile
from osekit.utils.timestamp_utils import strptime_from_text
from pandas import Timestamp
from rest_framework.decorators import action
from rest_framework.request import Request
from rest_framework.viewsets import ViewSet
from scipy.signal import ShortTimeFFT
from scipy.signal.windows import hamming

from backend.api.models import Spectrogram, SpectrogramAnalysis
from backend.storage.resolvers import Resolver
from backend.storage.utils import (
    join,
    listdir,
    make_static_url,
    open_file,
    make_absolute_server,
)


class ZoomViewSet(ViewSet):
    """Zoom view set"""

    @action(
        detail=False,
        url_path="analysis/(?P<analysis_id>[^/.]+)/spectrogram/(?P<spectrogram_id>[^/.]+)",
        url_name="zoom",
    )
    def zoom(
        self,
        request: Request,
        analysis_id=None,
        spectrogram_id=None,
    ):
        """Redirect to saved image or return processed blob image"""
        mode = request.query_params.get("mode", "png")
        zoom = int(request.query_params.get("zoom", 0))
        tile = int(request.query_params.get("tile", 0))

        spectrogram: Spectrogram = get_object_or_404(Spectrogram, pk=spectrogram_id)
        analysis: SpectrogramAnalysis = get_object_or_404(
            SpectrogramAnalysis, pk=analysis_id
        )
        resolver = Resolver(join(analysis.dataset.path, analysis.path))

        if mode == "png":
            return self._get_from_png(analysis, spectrogram, resolver, zoom, tile)
        elif mode == "wav":
            return self._get_from_wav(request.query_params, analysis, spectrogram)
        elif mode == "npz":
            return self._get_from_npz(request.query_params, analysis, spectrogram)
        return HttpResponse(
            f"Mode not implemented ({mode})", status=HTTPStatus.NOT_IMPLEMENTED
        )

    @staticmethod
    def _get_from_png(
        analysis: SpectrogramAnalysis,
        spectrogram: Spectrogram,
        resolver: Resolver,
        zoom=0,
        tile=0,
    ):
        _, spectro_path = resolver.get_spectrogram_paths(
            spectrogram=spectrogram, analysis=analysis
        )

        if analysis.legacy:
            suffix = PureWindowsPath(spectro_path).suffix
            return HttpResponseRedirect(
                f"{spectro_path[:-(len(suffix) + 1)]}_{ zoom + 1 }_{ tile }.{suffix}"
            )
        else:
            if zoom != 0 or tile != 0:
                return HttpResponse(
                    f"Cannot query other than 0 level for new OSEkit format ({zoom}-{tile} requested).",
                    status=HTTPStatus.BAD_REQUEST,
                )
            else:
                return HttpResponseRedirect(spectro_path)

    @staticmethod
    def _get_from_wav(
        query_params: QueryDict,
        analysis: SpectrogramAnalysis,
        spectrogram: Spectrogram,
    ):
        begin = Timestamp(str(spectrogram.start))
        end = Timestamp(str(spectrogram.end))

        audio_data: AudioData
        if analysis.legacy:
            config = PureWindowsPath(analysis.path).parts[-2]
            audio_path = make_absolute_server(
                join(
                    analysis.dataset.path,
                    "data/audio",
                    config,
                    f"{spectrogram.filename}.wav",
                )
            )
            audio_file = AudioFile(path=Path(audio_path), begin=begin)
            audio_data = AudioData.from_files([audio_file])
        else:
            json_path = join(analysis.dataset.path, "dataset.json")
            with open_file(json_path) as f:
                d = json.loads(f.read())
                strptime_format = d["strptime_format"]

            audio_folder = join(analysis.dataset.path, "data", "audio", "original")
            audio_files: list[AudioFile] = []
            audio_files_in_folder = [
                (
                    item,
                    strptime_from_text(
                        text=item, datetime_template=strptime_format
                    ).tz_localize(tz=begin.tz),
                )
                for item in listdir(audio_folder, return_absolute=False)
                if item.endswith(".wav")
            ]
            audio_files_in_folder = sorted(
                audio_files_in_folder, key=lambda info: info[1], reverse=True
            )

            count_under_start = 0
            for (filename, file_start) in audio_files_in_folder:
                if file_start >= end:
                    continue
                elif file_start >= begin:
                    audio_files.append(
                        AudioFile(
                            path=Path(
                                make_absolute_server(join(audio_folder, filename))
                            ),
                            begin=file_start,
                        )
                    )
                else:
                    if count_under_start == 0:
                        count_under_start += 1
                        audio_files.append(
                            AudioFile(
                                path=Path(
                                    make_absolute_server(join(audio_folder, filename))
                                ),
                                begin=file_start,
                            )
                        )
                    else:
                        break
            audio_data = AudioData.from_files(
                audio_files,
                begin=begin,
                end=end,
                sample_rate=analysis.fft.sampling_frequency,
            )

        spectro_data = SpectroData.from_audio_data(
            data=audio_data,
            fft=ZoomViewSet._get_fft(query_params, analysis),
            colormap="viridis",  # This is the default value
            # v_lim=(analysis.dynamic_min, analysis.dynamic_max), # TODO: check why it isn't working well with v_lim!!!
        )
        return ZoomViewSet._get_from_spectro_data(
            query_params=query_params,
            spectro_data=spectro_data,
        )

    @staticmethod
    def _get_from_npz(
        query_params: QueryDict,
        analysis: SpectrogramAnalysis,
        spectrogram: Spectrogram,
    ):
        if analysis.legacy:
            return HttpResponse(
                f"No npz files for legacy analysis", status=HTTPStatus.BAD_REQUEST
            )
        begin = Timestamp(str(spectrogram.start))
        end = Timestamp(str(spectrogram.end))

        npz_path = Path(
            make_absolute_server(
                join(
                    analysis.dataset.path,
                    analysis.path,
                    "matrix",
                    f"{spectrogram.filename}.npz",
                )
            )
        )
        spectro_data = SpectroData.from_files(
            [SpectroFile(path=npz_path, begin=begin)],
            begin=begin,
            end=end,
        )

        return ZoomViewSet._get_from_spectro_data(
            query_params=query_params,
            spectro_data=spectro_data,
        )

    @staticmethod
    def _get_fft(
        query_params: QueryDict,
        analysis: SpectrogramAnalysis,
    ) -> ShortTimeFFT:
        win_size = int(query_params.get("windowSize", analysis.fft.window_size))
        overlap = query_params.get("overlap", analysis.fft.overlap)
        mfft = int(query_params.get("nfft", analysis.fft.nfft))
        return ShortTimeFFT(
            mfft=mfft,
            win=hamming(win_size),
            hop=round(win_size * (1 - float(overlap))),
            fs=analysis.fft.sampling_frequency,
            scale_to="magnitude",
        )

    @staticmethod
    def _get_from_spectro_data(
        query_params: QueryDict,
        spectro_data: SpectroData,
    ):
        zoom = int(query_params.get("zoom", 0))
        tile = int(query_params.get("tile", 0))
        if zoom > 1:
            zoom_level = pow(2, zoom)
            spectro_data = spectro_data.split(zoom_level)[tile]

        colormap = query_params.get("colormap", None)
        if colormap is not None:
            spectro_data.colormap = colormap

        spectro_data.plot()

        # Get the (plotted) image into memory file
        imgdata = BytesIO()
        plt.savefig(
            imgdata,
            transparent=False,
            format="png",
            bbox_inches="tight",
            pad_inches=0,
            dpi=72,
        )
        imgdata.seek(0)  # rewind the data

        response = HttpResponse(content_type="image/png")
        # Write the value of our buffer to the response
        response.write(imgdata.getvalue())
        return response

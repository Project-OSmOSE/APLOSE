from http import HTTPStatus
from io import BytesIO
from os import path
from pathlib import PureWindowsPath

import matplotlib.pyplot as plt
from django.conf import settings
from django.http import HttpResponse, HttpResponseRedirect, QueryDict
from django.shortcuts import get_object_or_404
from django.templatetags.static import static
from osekit.core_api.audio_file import AudioFile
from osekit.core_api.audio_data import AudioData
from osekit.core_api.spectro_data import SpectroData
from pandas import Timestamp
from rest_framework.decorators import action
from rest_framework.request import Request
from rest_framework.viewsets import ViewSet
from scipy.signal import ShortTimeFFT
from scipy.signal.windows import hamming

from backend.api.models import Spectrogram, SpectrogramAnalysis


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
        mode = request.query_params.get("mode", "png")
        zoom = int(request.query_params.get("zoom", 0))
        tile = int(request.query_params.get("tile", 0))

        spectrogram: Spectrogram = get_object_or_404(Spectrogram, pk=spectrogram_id)
        analysis: SpectrogramAnalysis = get_object_or_404(
            SpectrogramAnalysis, pk=analysis_id
        )

        if mode == "png":
            return self.get_from_png(analysis, spectrogram, zoom, tile)
        elif mode == "wav":
            return self.get_from_wav(
                request.query_params, analysis, spectrogram, zoom, tile
            )
        return HttpResponse(
            f"Mode not implemented ({mode})", status=HTTPStatus.NOT_IMPLEMENTED
        )

    def get_from_png(
        self,
        analysis: SpectrogramAnalysis,
        spectrogram: Spectrogram,
        zoom=0,
        tile=0,
    ):
        base_path = spectrogram.get_base_spectro_path(analysis)
        if analysis.legacy:
            f = spectrogram.filename
            image_path = f"{base_path.split(f)[0]}{ f }_{ zoom + 1 }_{ tile }{ base_path.split(f)[1] }"
        else:
            if zoom != 0 or tile != 0:
                return HttpResponse(
                    f"Cannot query other than 0 level for new OSEkit format ({zoom}-{tile} requested).",
                    status=HTTPStatus.BAD_REQUEST,
                )
            else:
                image_path = base_path

        local_path = path.join(
            PureWindowsPath(settings.VOLUMES_ROOT),
            PureWindowsPath(settings.DATASET_EXPORT_PATH),
            PureWindowsPath(image_path),
        )
        if not path.exists(local_path):
            return HttpResponse(
                f"Image {local_path} not found.", status=HTTPStatus.NOT_FOUND
            )

        static_path = static(
            path.join(
                PureWindowsPath(settings.DATASET_EXPORT_PATH),
                PureWindowsPath(image_path),
            )
        )
        return HttpResponseRedirect(static_path)

    def get_from_wav(
        self,
        query_params: QueryDict,
        analysis: SpectrogramAnalysis,
        spectrogram: Spectrogram,
        zoom=0,
        tile=0,
    ):
        zoom_level = pow(2, zoom)
        win_size = int(query_params.get("windowSize", analysis.fft.window_size))
        overlap = query_params.get("overlap", analysis.fft.overlap)
        mfft = int(query_params.get("nfft", analysis.fft.nfft))
        fft = ShortTimeFFT(
            mfft=mfft,
            win=hamming(win_size),
            hop=round(win_size * (1 - float(overlap))),
            fs=analysis.fft.sampling_frequency,
            scale_to="magnitude",
        )

        if analysis.legacy:
            audio_file = AudioFile(
                path=spectrogram.get_audio_path(analysis),
                begin=Timestamp(str(spectrogram.start)),
            )
            audio_data = AudioData.from_files([audio_file])
            spectro_data = SpectroData.from_audio_data(
                data=audio_data,
                fft=fft,
                colormap="viridis",  # This is the default value
            )
        else:
            # Check matrix exists
            spectro_data: SpectroData = spectrogram.get_spectro_data_for(analysis)
            spectro_data.fft = fft

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

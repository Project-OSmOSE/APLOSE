from io import BytesIO

import matplotlib.pyplot as plt
from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from osekit.core_api.audio_data import AudioData
from osekit.core_api.spectro_data import SpectroData
from rest_framework.decorators import action
from rest_framework.viewsets import ViewSet
from scipy.signal import ShortTimeFFT
from scipy.signal.windows import hamming

from backend.api.models import Spectrogram, SpectrogramAnalysis


class ZoomViewSet(ViewSet):
    """Zoom view set"""

    @action(
        detail=False,
        url_path="analysis/(?P<analysis_id>[^/.]+)/spectrogram/(?P<spectrogram_id>[^/.]+)/zoom/(?P<zoom>[^/.]+)/tile/(?P<tile>[^/.]+)",
        url_name="zoom",
    )
    def zoom(self, request, analysis_id=None, spectrogram_id=None, zoom=0, tile=0):
        print("view", analysis_id, spectrogram_id, zoom, tile)
        zoom = int(zoom)
        tile = int(tile)

        file: Spectrogram = get_object_or_404(Spectrogram, pk=spectrogram_id)
        analysis: SpectrogramAnalysis = get_object_or_404(
            SpectrogramAnalysis, pk=analysis_id
        )
        audio_data: AudioData = file.get_audio_data_for(analysis)

        zoom_level = pow(2, zoom)
        audio_data = audio_data.split(zoom_level)[tile]

        overlap = analysis.fft.overlap or 0.95
        hop = round(analysis.fft.window_size * (1 - overlap))
        spectro_data = SpectroData.from_audio_data(
            data=audio_data,
            fft=ShortTimeFFT(
                win=hamming(analysis.fft.window_size),
                hop=max(1, hop // zoom_level),  # Improve temporal definition with zoom
                fs=analysis.fft.sampling_frequency,
                scale_to="magnitude",
            ),
            v_lim=(0.0, 150.0),  # Boundaries of the spectrogram
            # colormap="Greys",  # This is the default value
            colormap="viridis",  # This is the default value
        )

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

from io import BytesIO

import matplotlib.pyplot as plt
from django.http import HttpResponse
from osekit.core_api.audio_data import AudioData
from osekit.core_api.spectro_data import SpectroData
from rest_framework.decorators import action
from rest_framework.viewsets import ViewSet
from scipy.signal import ShortTimeFFT, spectrogram
from scipy.signal.windows import hamming

from backend.api.models import Spectrogram, SpectrogramAnalysis


class ZoomViewSet(ViewSet):
    """Zoom view set"""

    @action(
        detail=False,
        url_path="zoom/(?P<level>[^/.]+)/(?P<tile>[^/.]+)",
        url_name="zoom",
    )
    def zoom(self, request, level=0, tile=0):
        file: Spectrogram = Spectrogram.objects.filter(analysis__legacy=False).first()
        analysis: SpectrogramAnalysis = file.analysis.filter(legacy=False).first()
        audio_data: AudioData = file.get_spectro_data_for(analysis).audio_data

        zoom_level = pow(2, int(level))

        audio_data = audio_data.split(zoom_level)[int(tile)]

        win_size = analysis.fft.window_size or 1_024
        overlap = analysis.fft.overlap or 0.95
        hop = round(win_size * (1 - overlap))
        spectro_data = SpectroData.from_audio_data(
            data=audio_data,
            fft=ShortTimeFFT(
                win=hamming(win_size),
                hop=hop // zoom_level,  # Improve temporal definition with zoom
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
        plt.savefig(imgdata, format="png", bbox_inches="tight", pad_inches=0)
        imgdata.seek(0)  # rewind the data

        response = HttpResponse(content_type="image/png")
        # Write the value of our buffer to the response
        response.write(imgdata.getvalue())
        return response

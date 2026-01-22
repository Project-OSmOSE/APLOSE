import graphene
import graphene_django_optimizer
from decimal import Decimal

from backend.api.models import SpectrogramAnalysis, FFT
from backend.api.schema.connections import SpectrogramConnection
from backend.api.schema.filter_sets import SpectrogramAnalysisFilterSet
from backend.utils.schema.types import BaseObjectType, BaseNode
from .colormap import ColormapNode
from .fft import FFTNode
from .legacy_spectrogram_configuration import LegacySpectrogramConfigurationNode
from .spectrogram import SpectrogramNode


class SpectrogramAnalysisNode(BaseObjectType):
    """SpectrogramAnalysis schema"""

    fft = graphene.Field(FFTNode)  # Changed from NonNull to Field (nullable)
    colormap = graphene.NonNull(ColormapNode)
    legacy_configuration = LegacySpectrogramConfigurationNode()
    data_duration = graphene.Float()  # Alias for 'duration' field (backward compatibility)

    class Meta:
        model = SpectrogramAnalysis
        fields = "__all__"
        filterset_class = SpectrogramAnalysisFilterSet
        interfaces = (BaseNode,)

    spectrograms = SpectrogramConnection(SpectrogramNode)

    @graphene_django_optimizer.resolver_hints()
    def resolve_spectrograms(self: SpectrogramAnalysis, info, **kwargs):
        return self.spectrograms.distinct()

    def resolve_data_duration(self: SpectrogramAnalysis, info):
        """Backward compatibility: old field name was data_duration, new is duration"""
        return self.duration

    def resolve_fft(self: SpectrogramAnalysis, info):
        """
        Resolve FFT field for both old OSEkit datasets and new simple datasets.

        - If SpectrogramAnalysis has an fft foreign key, return it (old datasets)
        - Otherwise, create/get an FFT record from the simple dataset fields (new datasets)
        """
        # If old-style fft foreign key exists, use it
        try:
            if self.fft_id is not None and self.fft is not None:
                return self.fft
        except (AttributeError, ValueError):
            pass

        # For simple datasets, create or get FFT from the new fields
        try:
            # Calculate window_size and overlap from hop_length
            # window_size is typically same as nfft for standard STFT
            window_size = self.nfft

            # overlap is calculated as: overlap = (window_size - hop_length) / window_size
            # For example: nfft=2048, hop_length=512 -> overlap = (2048-512)/2048 = 0.75
            # Use Decimal for proper database storage
            overlap_value = (window_size - self.hop_length) / window_size
            overlap = Decimal(str(round(overlap_value, 2)))

            # Get or create FFT record
            fft, _ = FFT.objects.get_or_create(
                nfft=self.nfft,
                window_size=window_size,
                overlap=overlap,
                sampling_frequency=int(self.sample_rate),
                scaling=None,
                legacy=False
            )
            return fft
        except (AttributeError, ValueError, TypeError):
            pass

        return None

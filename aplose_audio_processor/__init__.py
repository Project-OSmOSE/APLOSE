"""
APLOSE Audio Processor

A Python package to generate APLOSE-compatible NetCDF spectrogram files from audio files.
Supports audio resampling, snippet generation, and multi-FFT spectrograms.
"""

from .generator import AploseAudioProcessor
from .audio_processor import AudioProcessor

__version__ = "1.0.0"
__all__ = ["AploseAudioProcessor", "AudioProcessor"]

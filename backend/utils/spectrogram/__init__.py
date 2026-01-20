"""
Spectrogram generation utilities for APLOSE

This module provides simple utilities to generate NetCDF spectrograms from WAV files.
"""

from .generator import SpectrogramGenerator
from .dataset import SimpleDataset

__all__ = ['SpectrogramGenerator', 'SimpleDataset']

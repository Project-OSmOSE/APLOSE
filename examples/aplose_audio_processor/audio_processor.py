"""
Audio processing utilities for resampling and creating audio snippets.
"""

import os
from pathlib import Path
from typing import Optional, Tuple
import numpy as np
import soundfile as sf
from datetime import timedelta


class AudioProcessor:
    """Handles audio resampling and snippet generation."""

    def __init__(
        self,
        target_sample_rate: Optional[int] = None,
        snippet_duration: Optional[float] = None,
        overlap: float = 0.0,
        filename_prefix: Optional[str] = None
    ):
        """
        Initialize AudioProcessor.

        Args:
            target_sample_rate: Target sample rate in Hz. If None, keeps original sample rate.
            snippet_duration: Duration of each snippet in seconds. If None, processes entire file.
            overlap: Overlap between consecutive snippets in seconds (default: 0.0).
            filename_prefix: Optional prefix to add to all output filenames.
        """
        self.target_sample_rate = target_sample_rate
        self.snippet_duration = snippet_duration
        self.overlap = overlap
        self.filename_prefix = filename_prefix

    def process_audio_file(
        self,
        input_path: str,
        output_dir: str,
        preserve_timestamps: bool = True
    ) -> list[Tuple[str, dict]]:
        """
        Process an audio file: resample and/or create snippets.

        Args:
            input_path: Path to input WAV file.
            output_dir: Directory to save processed audio files.
            preserve_timestamps: If True, generate filenames with timestamps for snippets.

        Returns:
            List of tuples (output_path, metadata_dict) for each generated file.
        """
        # Read audio file
        audio, original_sr = sf.read(input_path)

        # Resample if needed
        if self.target_sample_rate and self.target_sample_rate != original_sr:
            audio = self._resample(audio, original_sr, self.target_sample_rate)
            sample_rate = self.target_sample_rate
        else:
            sample_rate = original_sr

        # Get base filename and extract timestamp if possible
        input_path_obj = Path(input_path)
        base_name = input_path_obj.stem

        # Create output directory if it doesn't exist
        os.makedirs(output_dir, exist_ok=True)

        # Generate snippets or process entire file
        if self.snippet_duration:
            return self._create_snippets(
                audio, sample_rate, base_name, output_dir, preserve_timestamps
            )
        else:
            # Process entire file
            output_name = f"{self.filename_prefix}_{base_name}" if self.filename_prefix else base_name
            output_path = os.path.join(output_dir, f"{output_name}.wav")
            sf.write(output_path, audio, sample_rate)

            metadata = {
                'duration': len(audio) / sample_rate,
                'sample_rate': sample_rate,
                'original_sample_rate': original_sr,
                'original_file': input_path_obj.name,
                'snippet_index': None
            }

            return [(output_path, metadata)]

    def _resample(self, audio: np.ndarray, original_sr: int, target_sr: int) -> np.ndarray:
        """
        Resample audio using sinc interpolation.

        Args:
            audio: Audio data.
            original_sr: Original sample rate.
            target_sr: Target sample rate.

        Returns:
            Resampled audio.
        """
        from scipy import signal

        # Calculate the number of samples in the resampled audio
        num_samples = int(len(audio) * target_sr / original_sr)

        # Resample using scipy's resample function
        resampled = signal.resample(audio, num_samples)

        return resampled.astype(audio.dtype)

    def _create_snippets(
        self,
        audio: np.ndarray,
        sample_rate: int,
        base_name: str,
        output_dir: str,
        preserve_timestamps: bool
    ) -> list[Tuple[str, dict]]:
        """
        Create audio snippets from full audio.

        Args:
            audio: Audio data.
            sample_rate: Sample rate of audio.
            base_name: Base filename without extension.
            output_dir: Output directory.
            preserve_timestamps: Whether to preserve timestamps in filenames.

        Returns:
            List of tuples (output_path, metadata_dict) for each snippet.
        """
        snippet_samples = int(self.snippet_duration * sample_rate)
        overlap_samples = int(self.overlap * sample_rate)
        hop_samples = snippet_samples - overlap_samples

        total_duration = len(audio) / sample_rate
        results = []

        snippet_idx = 0
        start_sample = 0

        while start_sample < len(audio):
            end_sample = min(start_sample + snippet_samples, len(audio))
            snippet = audio[start_sample:end_sample]

            # Calculate time offset for this snippet
            time_offset = start_sample / sample_rate

            # Generate filename
            if preserve_timestamps:
                # Try to parse timestamp from base_name and add offset
                output_name = self._generate_snippet_filename(
                    base_name, snippet_idx, time_offset
                )
            else:
                output_name = f"{base_name}_snippet_{snippet_idx:04d}.wav"

            output_path = os.path.join(output_dir, output_name)

            # Save snippet
            sf.write(output_path, snippet, sample_rate)

            metadata = {
                'duration': len(snippet) / sample_rate,
                'sample_rate': sample_rate,
                'snippet_index': snippet_idx,
                'time_offset': time_offset,
                'original_file': base_name
            }

            results.append((output_path, metadata))

            snippet_idx += 1
            start_sample += hop_samples

            # Break if we've reached the end
            if end_sample >= len(audio):
                break

        return results

    def _generate_snippet_filename(
        self,
        base_name: str,
        snippet_idx: int,
        time_offset: float
    ) -> str:
        """
        Generate filename for snippet, preserving timestamp if possible.

        Args:
            base_name: Original filename base.
            snippet_idx: Index of the snippet.
            time_offset: Time offset in seconds from start of original file.

        Returns:
            Generated filename.
        """
        from datetime import datetime

        # Common datetime formats to try
        datetime_formats = [
            "%Y_%m_%d_%H_%M_%S",
            "%Y%m%d_%H%M%S",
            "%Y-%m-%d_%H-%M-%S",
            "%Y%m%d%H%M%S",
        ]

        # Try to parse datetime from base_name
        parsed_dt = None
        for fmt in datetime_formats:
            try:
                # Try to find datetime pattern in the filename
                parts = base_name.split('_')
                # Try different combinations of parts
                for i in range(len(parts)):
                    for j in range(i+1, min(i+7, len(parts)+1)):
                        candidate = '_'.join(parts[i:j])
                        try:
                            parsed_dt = datetime.strptime(candidate, fmt)
                            break
                        except ValueError:
                            continue
                    if parsed_dt:
                        break
                if parsed_dt:
                    break
            except (ValueError, IndexError):
                continue

        if parsed_dt:
            # Add time offset
            new_dt = parsed_dt + timedelta(seconds=time_offset)
            timestamp_str = new_dt.strftime("%Y_%m_%d_%H_%M_%S")
            if self.filename_prefix:
                return f"{self.filename_prefix}_{timestamp_str}.wav"
            return f"{timestamp_str}.wav"
        else:
            # Fallback to simple numbering
            if self.filename_prefix:
                return f"{self.filename_prefix}_{base_name}_snippet_{snippet_idx:04d}.wav"
            return f"{base_name}_snippet_{snippet_idx:04d}.wav"

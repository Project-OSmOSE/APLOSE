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
        filename_prefix: Optional[str] = None,
        max_duration: Optional[float] = None,
        datetime_format: Optional[str] = None,
        time_offset: float = 0.0
    ):
        """
        Initialize AudioProcessor.

        Args:
            target_sample_rate: Target sample rate in Hz. If None, keeps original sample rate.
            snippet_duration: Duration of each snippet in seconds. If None, processes entire file.
            overlap: Overlap between consecutive snippets in seconds (default: 0.0).
            filename_prefix: Optional prefix to add to all output filenames.
            max_duration: Maximum duration in seconds to use from the audio file. If None, uses entire file.
            datetime_format: strptime format to parse datetime from filenames.
            time_offset: Number of seconds to skip at the beginning of each audio file (default: 0.0).
        """
        self.target_sample_rate = target_sample_rate
        self.snippet_duration = snippet_duration
        self.overlap = overlap
        self.filename_prefix = filename_prefix
        self.max_duration = max_duration
        self.datetime_format = datetime_format
        self.time_offset = time_offset

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

        # Skip the first time_offset seconds if specified
        if self.time_offset > 0:
            offset_samples = int(self.time_offset * original_sr)
            if offset_samples < len(audio):
                audio = audio[offset_samples:]
            else:
                audio = audio[:0]  # Empty array if offset exceeds file length

        # Truncate to max_duration if specified
        if self.max_duration is not None:
            max_samples = int(self.max_duration * original_sr)
            if len(audio) > max_samples:
                audio = audio[:max_samples]

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
                audio, sample_rate, base_name, output_dir, preserve_timestamps,
                base_time_offset=self.time_offset
            )
        else:
            # Process entire file
            # When filename_prefix is set, use only the prefix (drop original filename)
            if self.filename_prefix:
                output_name = self.filename_prefix
            else:
                output_name = base_name
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
        preserve_timestamps: bool,
        base_time_offset: float = 0.0
    ) -> list[Tuple[str, dict]]:
        """
        Create audio snippets from full audio.

        Args:
            audio: Audio data.
            sample_rate: Sample rate of audio.
            base_name: Base filename without extension.
            output_dir: Output directory.
            preserve_timestamps: Whether to preserve timestamps in filenames.
            base_time_offset: Additional time offset in seconds already applied to the audio
                              (e.g. from time_offset skipping the start of the file).

        Returns:
            List of tuples (output_path, metadata_dict) for each snippet.
        """
        snippet_samples = int(self.snippet_duration * sample_rate)
        overlap_samples = int(self.overlap * sample_rate)
        hop_samples = snippet_samples - overlap_samples

        total_duration = len(audio) / sample_rate
        results = []

        # Parse datetime from original filename once, reuse for all snippets
        original_dt = self._parse_original_datetime(base_name)

        snippet_idx = 0
        start_sample = 0

        while start_sample < len(audio):
            end_sample = min(start_sample + snippet_samples, len(audio))
            snippet = audio[start_sample:end_sample]

            # Calculate time offset for this snippet (relative to original file start)
            time_offset = base_time_offset + start_sample / sample_rate

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

            # Compute begin_datetime for this snippet if we could parse the original
            begin_datetime = None
            if original_dt is not None:
                begin_datetime = original_dt + timedelta(seconds=int(round(time_offset)))

            metadata = {
                'duration': len(snippet) / sample_rate,
                'sample_rate': sample_rate,
                'snippet_index': snippet_idx,
                'time_offset': time_offset,
                'original_file': base_name,
                'begin_datetime': begin_datetime
            }

            results.append((output_path, metadata))

            snippet_idx += 1
            start_sample += hop_samples

            # Break if we've reached the end
            if end_sample >= len(audio):
                break

        return results

    def _parse_original_datetime(self, base_name: str):
        """
        Parse datetime from original filename using self.datetime_format.

        Returns a datetime object, or None if parsing fails.
        """
        from datetime import datetime
        import re

        if not self.datetime_format:
            return None

        fmt = self.datetime_format
        regex_pattern = self._datetime_format_to_regex(fmt)

        # Try regex search anywhere in filename
        match = re.search(regex_pattern, base_name)
        if match:
            try:
                return datetime.strptime(match.group(0), fmt)
            except ValueError:
                pass

        # Try splitting on underscores
        parts = base_name.split('_')
        for i in range(len(parts)):
            for j in range(i + 1, min(i + 7, len(parts) + 1)):
                candidate = '_'.join(parts[i:j])
                try:
                    return datetime.strptime(candidate, fmt)
                except ValueError:
                    continue

        return None

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
        import re

        # Round time offset to whole seconds
        time_offset = int(round(time_offset))

        # Common datetime formats to try (user-provided format takes priority)
        datetime_formats = []
        if self.datetime_format:
            datetime_formats.append(self.datetime_format)
        datetime_formats.extend([
            "%Y_%m_%d_%H_%M_%S",
            "%Y%m%d_%H%M%S",
            "%Y-%m-%d_%H-%M-%S",
            "%Y%m%d%H%M%S",
        ])

        # Try to parse datetime from base_name
        parsed_dt = None
        for fmt in datetime_formats:
            try:
                # First try: parse using regex to find pattern anywhere in filename
                regex_pattern = self._datetime_format_to_regex(fmt)
                match = re.search(regex_pattern, base_name)
                if match:
                    matched_str = match.group(0)
                    try:
                        parsed_dt = datetime.strptime(matched_str, fmt)
                        break
                    except ValueError:
                        pass

                # Second try: find datetime pattern in the filename parts
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
            # Add time offset (rounded to whole seconds)
            new_dt = parsed_dt + timedelta(seconds=time_offset)
            timestamp_str = new_dt.strftime("%Y_%m_%d_%H_%M_%S")
            if self.filename_prefix:
                return f"{self.filename_prefix}_{timestamp_str}.wav"
            return f"{timestamp_str}.wav"
        else:
            # Fallback to simple numbering
            # When filename_prefix is set, use only the prefix (drop original filename)
            if self.filename_prefix:
                return f"{self.filename_prefix}_snippet_{snippet_idx:04d}.wav"
            return f"{base_name}_snippet_{snippet_idx:04d}.wav"

    def _datetime_format_to_regex(self, datetime_format: str) -> str:
        """
        Convert a strptime format string to a regex pattern.

        Args:
            datetime_format: strptime format string (e.g., '%Y%m%d%H%M%S').

        Returns:
            Regex pattern string that matches the datetime format.
        """
        # Mapping of strptime directives to regex patterns
        format_to_regex = {
            '%Y': r'(\d{4})',      # 4-digit year
            '%y': r'(\d{2})',      # 2-digit year
            '%m': r'(\d{2})',      # 2-digit month
            '%d': r'(\d{2})',      # 2-digit day
            '%H': r'(\d{2})',      # 2-digit hour (24h)
            '%I': r'(\d{2})',      # 2-digit hour (12h)
            '%M': r'(\d{2})',      # 2-digit minute
            '%S': r'(\d{2})',      # 2-digit second
            '%f': r'(\d{6})',      # 6-digit microsecond
        }

        # Build regex pattern from format string
        pattern = datetime_format
        for fmt, regex in format_to_regex.items():
            pattern = pattern.replace(fmt, regex)

        return pattern

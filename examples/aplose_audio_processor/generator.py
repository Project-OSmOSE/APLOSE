"""
Main generator class for creating APLOSE-compatible spectrogram files from audio.
"""

import json
import math
import re
from pathlib import Path
from typing import Optional, Union, List, Dict
from datetime import datetime, timedelta
from concurrent.futures import ProcessPoolExecutor, as_completed
from functools import partial
import numpy as np
from scipy import signal
import soundfile as sf

from .audio_processor import AudioProcessor


class AploseAudioProcessor:
    """
    Generate APLOSE-compatible spectrogram files from audio files.

    Supports:
    - Audio resampling
    - Audio snippet generation
    - Single-FFT and multi-FFT spectrograms
    - Data PNG + JSON export for interactive Plotly display
    - Batch processing of folders
    """

    def __init__(
        self,
        fft_sizes: Union[int, List[int]] = 2048,
        window: str = 'hann',
        hop_length_factor: float = 0.25,
        db_ref: float = 1.0,
        db_fullscale: Optional[float] = None,
        normalize_audio: bool = False,
        datetime_format: str = "%Y_%m_%d_%H_%M_%S",
        target_sample_rate: Optional[int] = None,
        snippet_duration: Optional[float] = None,
        snippet_overlap: float = 0.0,
        filename_prefix: Optional[str] = None,
        generate_data_png: bool = True,
        data_png_max_freq_bins: int = 1000,
        data_png_max_time_bins: int = 1000,
        data_png_freq_scale: str = 'log',
        max_duration: Optional[float] = None,
        num_workers: int = 1
    ):
        """
        Initialize the APLOSE audio processor.

        Args:
            fft_sizes: FFT size(s). Can be a single int or list of ints for multi-FFT.
            window: Window function ('hann', 'hamming', 'blackman').
            hop_length_factor: Hop length as fraction of FFT size (default: 0.25).
            db_ref: Reference value for dB conversion (default: 1.0). Ignored if db_fullscale is set.
            db_fullscale: dB re 1 µPa value corresponding to digital full scale (max WAV value).
                         When set, output is calibrated to dB re 1 µPa. Takes precedence over db_ref.
            normalize_audio: If True, normalize audio to [-1, 1] before computing spectrogram.
            datetime_format: strptime format to parse datetime from filenames.
            target_sample_rate: Target sample rate for resampling. None = keep original.
            snippet_duration: Duration in seconds for audio snippets. None = no splitting.
            snippet_overlap: Overlap between snippets in seconds (default: 0.0).
            filename_prefix: Optional prefix to add to all output filenames.
            generate_data_png: If True (default), generate data PNG + JSON for Plotly display.
            data_png_max_freq_bins: Maximum frequency bins for data PNG resampling (default: 1000).
            data_png_max_time_bins: Maximum time bins for data PNG resampling (default: 1000).
            data_png_freq_scale: Frequency scale for resampling ('log' or 'linear', default: 'log').
                                Log scale provides finer resolution at lower frequencies.
            max_duration: Maximum duration in seconds to use from each audio file. None = use entire file.
            num_workers: Number of parallel workers for processing (default: 1 = sequential).
        """
        # Handle single or multiple FFT sizes
        if isinstance(fft_sizes, int):
            self.fft_sizes = [fft_sizes]
        else:
            self.fft_sizes = sorted(fft_sizes)

        self.window = window
        self.hop_length_factor = hop_length_factor
        self.db_ref = db_ref
        self.db_fullscale = db_fullscale
        self.normalize_audio = normalize_audio
        self.datetime_format = datetime_format
        self.generate_data_png = generate_data_png
        self.data_png_max_freq_bins = data_png_max_freq_bins
        self.data_png_max_time_bins = data_png_max_time_bins
        self.data_png_freq_scale = data_png_freq_scale
        self.max_duration = max_duration
        self.num_workers = num_workers

        # Initialize audio processor
        self.audio_processor = AudioProcessor(
            target_sample_rate=target_sample_rate,
            snippet_duration=snippet_duration,
            overlap=snippet_overlap,
            filename_prefix=filename_prefix,
            max_duration=max_duration
        )

    def _process_single_audio_file(
        self,
        audio_file: Path,
        output_path: Path,
        preserve_timestamps: bool
    ) -> Dict[str, List[str]]:
        """
        Process a single audio file (helper for multiprocessing).

        Args:
            audio_file: Path to audio file.
            output_path: Output directory path.
            preserve_timestamps: Preserve timestamps in snippet filenames.

        Returns:
            Dictionary with 'wav_files' and 'png_files' lists.
        """
        wav_files = []
        png_files = []

        print(f"\nProcessing: {audio_file.name}")

        # Process audio (resample and/or create snippets)
        wav_results = self.audio_processor.process_audio_file(
            str(audio_file),
            str(output_path),
            preserve_timestamps=preserve_timestamps
        )

        print(f"  Generated {len(wav_results)} audio file(s)")

        # Process each audio file
        for wav_path, metadata in wav_results:
            wav_files.append(wav_path)

            # Generate data PNGs + JSON for Plotly display
            if self.generate_data_png:
                data_png_results = self._create_data_pngs_for_all_fft_sizes(wav_path, metadata)
                for png_path, json_path in data_png_results:
                    png_files.append(png_path)
                    print(f"    Created data PNG: {Path(png_path).name}")
                    print(f"    Created metadata: {Path(json_path).name}")

        return {'wav_files': wav_files, 'png_files': png_files}

    def process_folder(
        self,
        input_folder: str,
        output_folder: str,
        audio_extensions: List[str] = None,
        preserve_timestamps: bool = True,
        datetime_format: Optional[str] = None
    ) -> Dict[str, List[str]]:
        """
        Process all audio files in a folder.

        Args:
            input_folder: Path to folder containing audio files.
            output_folder: Path to output folder for WAV and spectrogram files.
            audio_extensions: List of audio file extensions to process (default: ['.wav', '.WAV']).
            preserve_timestamps: Preserve timestamps in snippet filenames.
            datetime_format: Optional datetime format override for parsing filenames.
                           If not provided, uses the instance's datetime_format.

        Returns:
            Dictionary with 'wav_files' and 'png_files' lists.
        """
        if audio_extensions is None:
            audio_extensions = ['.wav', '.WAV']

        input_path = Path(input_folder)
        output_path = Path(output_folder)

        # Create output directory
        output_path.mkdir(parents=True, exist_ok=True)

        # Find all audio files
        audio_files = []
        for ext in audio_extensions:
            audio_files.extend(input_path.glob(f'*{ext}'))

        if not audio_files:
            print(f"No audio files found in {input_folder}")
            return {'wav_files': [], 'png_files': []}

        print(f"Found {len(audio_files)} audio file(s) to process")

        # Temporarily override datetime_format if provided
        original_datetime_format = self.datetime_format
        if datetime_format is not None:
            self.datetime_format = datetime_format

        all_wav_files = []
        all_png_files = []

        audio_files_sorted = sorted(audio_files)

        if self.num_workers > 1 and len(audio_files_sorted) > 1:
            # Use multiprocessing for parallel processing
            print(f"Using {self.num_workers} parallel workers")
            with ProcessPoolExecutor(max_workers=self.num_workers) as executor:
                futures = {
                    executor.submit(
                        self._process_single_audio_file,
                        audio_file,
                        output_path,
                        preserve_timestamps
                    ): audio_file
                    for audio_file in audio_files_sorted
                }

                for future in as_completed(futures):
                    audio_file = futures[future]
                    try:
                        result = future.result()
                        all_wav_files.extend(result['wav_files'])
                        all_png_files.extend(result['png_files'])
                    except Exception as e:
                        print(f"Error processing {audio_file.name}: {e}")
        else:
            # Sequential processing
            for audio_file in audio_files_sorted:
                result = self._process_single_audio_file(
                    audio_file, output_path, preserve_timestamps
                )
                all_wav_files.extend(result['wav_files'])
                all_png_files.extend(result['png_files'])

        # Restore original datetime_format
        self.datetime_format = original_datetime_format

        print(f"\nProcessing complete!")
        print(f"Generated {len(all_wav_files)} WAV files")
        if self.generate_data_png:
            print(f"Generated {len(all_png_files)} PNG files")

        return {
            'wav_files': all_wav_files,
            'png_files': all_png_files
        }

    def process_single_file(
        self,
        input_file: str,
        output_folder: str,
        preserve_timestamps: bool = True,
        datetime_format: Optional[str] = None
    ) -> Dict[str, List[str]]:
        """
        Process a single audio file.

        Args:
            input_file: Path to audio file.
            output_folder: Path to output folder.
            preserve_timestamps: Preserve timestamps in snippet filenames.
            datetime_format: Optional datetime format override for parsing filenames.
                           If not provided, uses the instance's datetime_format.

        Returns:
            Dictionary with 'wav_files' and 'png_files' lists.
        """
        output_path = Path(output_folder)
        output_path.mkdir(parents=True, exist_ok=True)

        print(f"Processing: {input_file}")

        # Temporarily override datetime_format if provided
        original_datetime_format = self.datetime_format
        if datetime_format is not None:
            self.datetime_format = datetime_format

        # Process audio
        wav_results = self.audio_processor.process_audio_file(
            input_file,
            str(output_path),
            preserve_timestamps=preserve_timestamps
        )

        print(f"Generated {len(wav_results)} audio file(s)")

        all_wav_files = []
        all_png_files = []

        # Process each audio file
        for wav_path, metadata in wav_results:
            all_wav_files.append(wav_path)

            # Generate data PNGs + JSON for Plotly display
            if self.generate_data_png:
                data_png_results = self._create_data_pngs_for_all_fft_sizes(wav_path, metadata)
                for png_path, json_path in data_png_results:
                    all_png_files.append(png_path)
                    print(f"  Created data PNG: {Path(png_path).name}")
                    print(f"  Created metadata: {Path(json_path).name}")

        # Restore original datetime_format
        self.datetime_format = original_datetime_format

        print(f"\nProcessing complete!")
        print(f"Generated {len(all_wav_files)} WAV files")
        if self.generate_data_png:
            print(f"Generated {len(all_png_files)} PNG files")

        return {
            'wav_files': all_wav_files,
            'png_files': all_png_files
        }

    def _create_data_png_with_metadata(
        self,
        wav_path: str,
        spec_data: np.ndarray,
        freqs: np.ndarray,
        times: np.ndarray,
        sample_rate: int,
        nfft: int,
        hop_length: int,
        metadata: dict,
        max_freq_bins: int = 1000,
        max_time_bins: int = 1000,
        freq_scale: str = 'log'
    ) -> tuple:
        """
        Create a data PNG (grayscale, no axes) with JSON metadata for Plotly display.

        The PNG stores normalized spectrogram values as 16-bit grayscale pixels.
        The JSON contains metadata needed to reconstruct actual dB values.
        Data is resampled to max dimensions for faster loading.

        Args:
            wav_path: Path to WAV file (used to derive filenames).
            spec_data: Spectrogram data array (frequency x time) in dB.
            freqs: Frequency array in Hz.
            times: Time array in seconds.
            sample_rate: Audio sample rate.
            nfft: FFT size used.
            hop_length: Hop length used.
            metadata: Additional metadata from audio processing.
            max_freq_bins: Maximum frequency bins (default 1000).
            max_time_bins: Maximum time bins (default 1000).
            freq_scale: Frequency scale for resampling ('log' or 'linear', default: 'log').

        Returns:
            Tuple of (png_path, json_path).
        """
        from PIL import Image
        from scipy import ndimage
        from scipy.interpolate import interp1d

        # Store original dimensions
        orig_n_freqs, orig_n_times = spec_data.shape

        # Determine target dimensions
        target_n_freqs = min(orig_n_freqs, max_freq_bins)
        target_n_times = min(orig_n_times, max_time_bins)

        needs_freq_resample = orig_n_freqs > max_freq_bins
        needs_time_resample = orig_n_times > max_time_bins

        if needs_freq_resample or needs_time_resample:
            # Resample frequency axis
            if needs_freq_resample:
                if freq_scale == 'log':
                    # Create log-spaced target frequencies
                    # Use geomspace for logarithmic spacing (requires positive values)
                    freqs_resampled = np.geomspace(freqs[0], freqs[-1], target_n_freqs)
                else:
                    # Create linearly-spaced target frequencies
                    freqs_resampled = np.linspace(freqs[0], freqs[-1], target_n_freqs)

                # Interpolate spectrogram to target frequencies
                # Interpolate along frequency axis (axis 0)
                interp_func = interp1d(freqs, spec_data, axis=0, kind='linear',
                                       bounds_error=False, fill_value='extrapolate')
                spec_data_resampled = interp_func(freqs_resampled)
            else:
                spec_data_resampled = spec_data
                freqs_resampled = freqs

            # Resample time axis with linear spacing (time is already linear)
            if needs_time_resample:
                zoom_time = target_n_times / spec_data_resampled.shape[1]
                spec_data_resampled = ndimage.zoom(spec_data_resampled, (1.0, zoom_time), order=1)
                times_resampled = np.linspace(times[0], times[-1], spec_data_resampled.shape[1])
            else:
                times_resampled = times

            new_n_freqs, new_n_times = spec_data_resampled.shape
        else:
            spec_data_resampled = spec_data
            freqs_resampled = freqs
            times_resampled = times
            new_n_freqs, new_n_times = orig_n_freqs, orig_n_times

        # Get data range for normalization
        db_min = float(np.min(spec_data_resampled))
        db_max = float(np.max(spec_data_resampled))
        db_range = db_max - db_min

        # Normalize to 0-65535 for 16-bit PNG
        if db_range > 0:
            normalized = ((spec_data_resampled - db_min) / db_range * 65535).astype(np.uint16)
        else:
            normalized = np.zeros_like(spec_data_resampled, dtype=np.uint16)

        # Create 16-bit grayscale image
        # Note: spec_data is (frequency, time), image should be (height, width)
        # Flip vertically so low frequencies are at bottom
        img_data = np.flipud(normalized)
        img = Image.fromarray(img_data, mode='I;16')

        # Generate filenames
        wav_stem = Path(wav_path).stem
        png_filename = f"{wav_stem}_fft{nfft}_data.png"
        json_filename = f"{wav_stem}_fft{nfft}_data.json"
        png_path = str(Path(wav_path).parent / png_filename)
        json_path = str(Path(wav_path).parent / json_filename)

        # Save PNG
        img.save(png_path)

        # Parse datetime
        begin_dt, end_dt = self._parse_datetime(wav_stem, metadata['duration'])

        # Build JSON metadata (using resampled dimensions)
        json_data = {
            'format_version': 2,  # Version 2: supports log/linear frequency scale
            'png_file': png_filename,
            'encoding': {
                'bit_depth': 16,
                'db_min': db_min,
                'db_max': db_max,
                'description': 'Pixel value 0 = db_min, 65535 = db_max'
            },
            'spectrogram': {
                'shape': [new_n_freqs, new_n_times],  # Resampled dimensions
                'original_shape': [orig_n_freqs, orig_n_times],  # Original dimensions
                'frequency_min': float(freqs[0]),
                'frequency_max': float(freqs[-1]),
                'frequency_scale': freq_scale,  # 'log' or 'linear'
                'time_min': float(times[0]),
                'time_max': float(times[-1]),
                'time_scale': 'linear',  # Time bins are linearly spaced
                'n_frequencies': new_n_freqs,
                'n_times': new_n_times,
                'original_n_frequencies': orig_n_freqs,
                'original_n_times': orig_n_times,
                'resampled': needs_freq_resample or needs_time_resample
            },
            'audio': {
                'sample_rate': sample_rate,
                'duration': float(metadata['duration']),
                'filename': Path(wav_path).name
            },
            'analysis': {
                'nfft': nfft,
                'hop_length': hop_length,
                'window': self.window,
                'normalize_audio': self.normalize_audio
            },
            'calibration': {
                'db_fullscale': self.db_fullscale,
                'db_ref': self.db_ref if self.db_fullscale is None else None
            },
            'temporal': {
                'begin': begin_dt.isoformat(),
                'end': end_dt.isoformat()
            }
        }

        # Save JSON
        with open(json_path, 'w') as f:
            json.dump(json_data, f, indent=2)

        return png_path, json_path

    def _create_data_pngs_for_all_fft_sizes(
        self,
        wav_path: str,
        metadata: dict
    ) -> List[tuple]:
        """
        Create data PNG + JSON files for all FFT sizes.

        Args:
            wav_path: Path to WAV file.
            metadata: Metadata from audio processing.

        Returns:
            List of (png_path, json_path) tuples.
        """
        # Read audio once
        audio, sample_rate = sf.read(wav_path)

        results = []

        for nfft in self.fft_sizes:
            hop_length = int(nfft * self.hop_length_factor)

            # Calculate spectrogram
            spec_data, freqs, times = self._calculate_spectrogram(
                audio, sample_rate, nfft, hop_length
            )

            # Create data PNG with metadata
            png_path, json_path = self._create_data_png_with_metadata(
                wav_path, spec_data, freqs, times,
                sample_rate, nfft, hop_length, metadata,
                max_freq_bins=self.data_png_max_freq_bins,
                max_time_bins=self.data_png_max_time_bins,
                freq_scale=self.data_png_freq_scale
            )
            results.append((png_path, json_path))

        return results

    def _calculate_spectrogram(
        self,
        audio: np.ndarray,
        sample_rate: int,
        nfft: int,
        hop_length: int
    ) -> tuple:
        """
        Calculate spectrogram using STFT.

        Args:
            audio: Audio data.
            sample_rate: Sample rate.
            nfft: FFT size.
            hop_length: Hop length.

        Returns:
            Tuple of (spectrogram_db, frequencies, times).
        """
        # Normalize audio if requested
        if self.normalize_audio:
            max_val = np.max(np.abs(audio))
            if max_val > 0:
                audio = audio / max_val

        # Get window function
        if self.window == 'hann':
            window_func = signal.windows.hann(nfft)
        elif self.window == 'hamming':
            window_func = signal.windows.hamming(nfft)
        elif self.window == 'blackman':
            window_func = signal.windows.blackman(nfft)
        else:
            raise ValueError(f"Unsupported window function: {self.window}")

        # Calculate STFT
        freqs, times, stft = signal.stft(
            audio,
            fs=sample_rate,
            window=window_func,
            nperseg=nfft,
            noverlap=nfft - hop_length,
            return_onesided=True
        )

        # Convert to power spectrogram
        spec_power = np.abs(stft) ** 2

        # Convert to dB scale
        if self.db_fullscale is not None:
            # db_fullscale: dB re 1 µPa value of digital full scale (1.0)
            # Output will be in dB re 1 µPa
            spec_db = 10 * np.log10(spec_power + 1e-10) + self.db_fullscale
        else:
            # Legacy mode: use db_ref as reference value
            spec_db = 10 * np.log10(spec_power / self.db_ref + 1e-10)

        # Exclude DC bin (0 Hz) - start from first actual frequency bin (fs/nfft)
        # This makes freqs[0] = fs/nfft instead of 0
        spec_db = spec_db[1:, :]
        freqs = freqs[1:]

        return spec_db, freqs, times

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
            '%j': r'(\d{3})',      # 3-digit day of year
            '%U': r'(\d{2})',      # Week number (Sunday start)
            '%W': r'(\d{2})',      # Week number (Monday start)
            '%p': r'(AM|PM)',      # AM/PM
            '%z': r'([+-]\d{4})',  # UTC offset
            '%Z': r'([A-Z]+)',     # Timezone name
        }

        # Build regex pattern from format string
        pattern = datetime_format
        for fmt, regex in format_to_regex.items():
            pattern = pattern.replace(fmt, regex)

        # Escape any remaining special regex characters (except our groups)
        # But we need to be careful not to escape the parentheses we added
        special_chars = '.^$*+?{}[]|'
        for char in special_chars:
            if char in pattern and char not in '()':
                pattern = pattern.replace(char, '\\' + char)

        return pattern

    def _parse_datetime(
        self,
        filename: str,
        duration: float
    ) -> tuple:
        """
        Parse datetime from filename using regex pattern matching.

        Supports various datetime formats with or without separators:
        - '%Y%m%d%H%M%S' -> matches '20240115143000'
        - '%Y_%m_%d_%H_%M_%S' -> matches '2024_01_15_14_30_00'
        - '%y%m%d%H%M%S' -> matches '240115143000' or '8712.250128055936'

        The regex-based search finds the datetime pattern anywhere in the filename,
        so prefixes, suffixes, and non-underscore separators (like dots) are handled.

        Args:
            filename: Filename without extension.
            duration: Duration of audio in seconds.

        Returns:
            Tuple of (begin_datetime, end_datetime).
        """
        parsed_dt = None

        # Convert datetime format to regex pattern
        regex_pattern = self._datetime_format_to_regex(self.datetime_format)

        try:
            # First try: parse the entire filename
            try:
                parsed_dt = datetime.strptime(filename, self.datetime_format)
            except ValueError:
                pass

            # Second try: search for pattern anywhere in filename using regex
            if not parsed_dt:
                match = re.search(regex_pattern, filename)
                if match:
                    matched_str = match.group(0)
                    try:
                        parsed_dt = datetime.strptime(matched_str, self.datetime_format)
                    except ValueError:
                        pass

            # Third try: for formats with separators, try splitting and recombining
            if not parsed_dt and '_' in self.datetime_format:
                parts = filename.split('_')
                for i in range(len(parts)):
                    for j in range(i+1, min(i+7, len(parts)+1)):
                        candidate = '_'.join(parts[i:j])
                        try:
                            parsed_dt = datetime.strptime(candidate, self.datetime_format)
                            break
                        except ValueError:
                            continue
                    if parsed_dt:
                        break

            # Fourth try: extract all digit sequences and try common patterns
            if not parsed_dt:
                # Find all sequences of digits in the filename
                digit_sequences = re.findall(r'\d+', filename)

                # Try concatenating adjacent sequences to form datetime
                for i in range(len(digit_sequences)):
                    # Try single sequence
                    seq = digit_sequences[i]
                    try:
                        parsed_dt = datetime.strptime(seq, self.datetime_format)
                        break
                    except ValueError:
                        pass

                    # Try concatenating with next sequences
                    for j in range(i+1, min(i+6, len(digit_sequences)+1)):
                        combined = ''.join(digit_sequences[i:j])
                        try:
                            parsed_dt = datetime.strptime(combined, self.datetime_format)
                            break
                        except ValueError:
                            continue
                    if parsed_dt:
                        break

            if not parsed_dt:
                raise ValueError("Could not parse datetime")

            begin_dt = parsed_dt

        except (ValueError, IndexError):
            # Fallback to current time if parsing fails
            print(f"  Warning: Could not parse datetime from '{filename}' using format '{self.datetime_format}', using current time")
            begin_dt = datetime.now()

        # Calculate end datetime
        end_dt = begin_dt + timedelta(seconds=duration)

        return begin_dt, end_dt

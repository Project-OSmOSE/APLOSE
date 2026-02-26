"""View for NetCDF spectrogram operations"""
import json
import os
from pathlib import Path
import logging

import numpy as np
import xarray as xr
from django.http import JsonResponse
from django.conf import settings
from django.http import FileResponse, Http404
from rest_framework.decorators import action
from rest_framework.viewsets import ViewSet
from rest_framework.response import Response
from rest_framework import status

from backend.api.models import SpectrogramAnalysis

logger = logging.getLogger(__name__)


class NetCDFViewSet(ViewSet):
    """
    API endpoints for NetCDF spectrogram operations.

    Provides functionality to parse and serve NetCDF spectrogram files
    for visualization in the frontend.
    """

    @action(detail=False, methods=['get'], url_path='parse')
    def parse_netcdf(self, request):
        """
        Parse a NetCDF spectrogram file and return its data as JSON.

        Query parameters:
            path: Path to the NetCDF file (optional)

        If no path is provided, serves the static example spectrogram.

        Returns:
            JSON response with spectrogram data:
            {
                "spectrogram": [[...]], 2D array of power values
                "time": [...],          1D array of time values
                "frequency": [...],     1D array of frequency values
                "attributes": {...}     File metadata
            }
        """
        # Get file path from query params, default to example file
        file_path = request.query_params.get('path')

        if not file_path:
            # Use static example file
            backend_dir = Path(__file__).parent.parent.parent
            file_path = backend_dir / 'static' / 'examples' / 'example_spectrogram.nc'
        else:
            file_path = Path(file_path)

        # Security: Ensure file exists and is readable
        if not file_path.exists():
            return Response(
                {'error': f'NetCDF file not found: {file_path}'},
                status=status.HTTP_404_NOT_FOUND
            )

        if not file_path.is_file():
            return Response(
                {'error': f'Path is not a file: {file_path}'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # Open and parse NetCDF file
            ds = xr.open_dataset(file_path)

            # Extract spectrogram data
            spectrogram = ds['spectrogram'].values
            time = ds['time'].values
            frequency = ds['frequency'].values

            # Get downsampling info if available
            downsampling = {}
            if 'downsampling_time_step' in ds.attrs:
                downsampling['time_step'] = int(ds.attrs['downsampling_time_step'])
            if 'downsampling_freq_step' in ds.attrs:
                downsampling['freq_step'] = int(ds.attrs['downsampling_freq_step'])

            # Convert numpy types to Python types for JSON serialization
            response_data = {
                'spectrogram': spectrogram.tolist(),
                'time': time.tolist(),
                'frequency': frequency.tolist(),
                'attributes': {k: str(v) for k, v in ds.attrs.items()},
                'shape': list(spectrogram.shape),
            }

            if downsampling:
                response_data['downsampling'] = downsampling

            ds.close()

            return JsonResponse(response_data)

        except Exception as e:
            return Response(
                {'error': f'Failed to parse NetCDF file: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=False, methods=['get'], url_path='example')
    def get_example(self, request):
        """
        Get information about the static example spectrogram.

        Returns metadata without loading the full data array.
        """
        try:
            backend_dir = Path(__file__).parent.parent.parent
            file_path = backend_dir / 'static' / 'examples' / 'example_spectrogram.nc'

            if not file_path.exists():
                return Response(
                    {'error': 'Example spectrogram file not found'},
                    status=status.HTTP_404_NOT_FOUND
                )

            # Open file and get metadata only
            ds = xr.open_dataset(file_path)

            metadata = {
                'path': str(file_path),
                'attributes': {k: str(v) for k, v in ds.attrs.items()},
                'dimensions': {
                    'time': len(ds['time']),
                    'frequency': len(ds['frequency']),
                },
                'time_range': [
                    float(ds['time'].min()),
                    float(ds['time'].max())
                ],
                'frequency_range': [
                    float(ds['frequency'].min()),
                    float(ds['frequency'].max())
                ],
            }

            ds.close()

            return JsonResponse(metadata)

        except Exception as e:
            return Response(
                {'error': f'Failed to read example file: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=False, methods=['get'], url_path='dataset-spectrogram')
    def get_dataset_spectrogram(self, request):
        """
        Get spectrogram data for a dataset analysis.

        Query parameters:
            analysis_id: ID of the SpectrogramAnalysis
            downsample: Optional downsampling factor (default: 1, no downsampling)

        Returns:
            JSON response with spectrogram data
        """
        analysis_id = request.query_params.get('analysis_id')

        if not analysis_id:
            return Response(
                {'error': 'analysis_id parameter required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # Get analysis
            analysis = SpectrogramAnalysis.objects.get(pk=analysis_id)
        except SpectrogramAnalysis.DoesNotExist:
            return Response(
                {'error': f'SpectrogramAnalysis not found: {analysis_id}'},
                status=status.HTTP_404_NOT_FOUND
            )

        try:
            # Get NetCDF file path
            netcdf_path = analysis.get_netcdf_path()

            if not netcdf_path.exists():
                return Response(
                    {'error': f'NetCDF file not found: {netcdf_path}'},
                    status=status.HTTP_404_NOT_FOUND
                )

            # Open and parse NetCDF file
            ds = xr.open_dataset(netcdf_path)

            # Get downsampling factor
            downsample = int(request.query_params.get('downsample', 1))

            # Check if this is a multi-FFT file
            fft_sizes_str = ds.attrs.get('fft_sizes', '')
            is_multi_fft = bool(fft_sizes_str)

            if is_multi_fft:
                # Multi-FFT file: extract the spectrogram for this analysis's FFT size
                nfft = analysis.nfft
                var_name = f'spectrogram_fft{nfft}'
                time_coord = f'time_fft{nfft}'
                freq_coord = f'frequency_fft{nfft}'

                if var_name not in ds.data_vars:
                    ds.close()
                    return Response(
                        {'error': f'FFT size {nfft} not found in NetCDF file. Available: {list(ds.data_vars.keys())}'},
                        status=status.HTTP_404_NOT_FOUND
                    )

                # Extract and optionally downsample data
                spectrogram = ds[var_name].values
                time = ds[time_coord].values
                frequency = ds[freq_coord].values
            else:
                # Legacy single-FFT file
                spectrogram = ds['spectrogram'].values
                time = ds['time'].values
                frequency = ds['frequency'].values

            if downsample > 1:
                # Downsample for performance
                spectrogram = spectrogram[::downsample, ::downsample]
                time = time[::downsample]
                frequency = frequency[::downsample]
                logger.info(f"Downsampled by factor {downsample}: {spectrogram.shape}")

            # Convert numpy types to Python types for JSON serialization
            response_data = {
                'spectrogram': spectrogram.tolist(),
                'time': time.tolist(),
                'frequency': frequency.tolist(),
                'attributes': {k: str(v) for k, v in ds.attrs.items()},
                'shape': list(spectrogram.shape),
                'analysis': {
                    'id': analysis.id,
                    'name': analysis.name,
                    'dataset': analysis.dataset.name,
                    'start': analysis.start.isoformat() if analysis.start else None,
                    'end': analysis.end.isoformat() if analysis.end else None,
                    'sample_rate': analysis.sample_rate,
                    'duration': analysis.duration,
                },
            }

            if downsample > 1:
                if is_multi_fft:
                    original_shape = [len(ds[freq_coord]), len(ds[time_coord])]
                else:
                    original_shape = [len(ds['frequency']), len(ds['time'])]

                response_data['downsampling'] = {
                    'factor': downsample,
                    'original_shape': original_shape,
                }

            ds.close()

            return JsonResponse(response_data)

        except Exception as e:
            logger.error(f"Failed to load spectrogram for analysis {analysis_id}: {e}")
            return Response(
                {'error': f'Failed to load spectrogram: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=False, methods=['get'], url_path='list-example-files')
    def list_example_files(self, request):
        """
        List available PNG/JSON spectrogram files in the example dataset folder.
        Groups files by recording (one WAV with multiple FFT analyses).

        Returns:
            JSON response with list of available recordings:
            {
                "recordings": [
                    {
                        "id": "recording_base_name",
                        "wav": "recording.wav",
                        "timestamp": "2025-01-30T22:30:00",
                        "analyses": [
                            {"fft": 4096, "json": "file_fft4096_data.json", "png": "file_fft4096_data.png"},
                            {"fft": 8192, "json": "file_fft8192_data.json", "png": "file_fft8192_data.png"},
                        ]
                    }
                ],
                "basePath": "/api/netcdf/example-file"
            }
        """
        import re
        try:
            # Get the example folder path from settings or use default
            datawork_dir = Path(settings.DATAWORK_FOLDER if hasattr(settings, 'DATAWORK_FOLDER') else '/opt/datawork')
            example_dir = datawork_dir / 'dataset' / 'example'

            if not example_dir.exists():
                return JsonResponse({
                    'recordings': [],
                    'basePath': '',
                    'message': 'Example folder not found. Place PNG/JSON files in volumes/datawork/dataset/example/'
                })

            # Find all JSON files (metadata files)
            json_files = list(example_dir.glob('*_data.json'))

            # Group by base recording name (without _fftXXXX_data suffix)
            recordings_dict = {}
            fft_pattern = re.compile(r'(.+)_fft(\d+)_data\.json$')

            for json_file in sorted(json_files):
                match = fft_pattern.match(json_file.name)
                if not match:
                    continue

                base_name = match.group(1)
                fft_size = int(match.group(2))

                # Read JSON to get metadata
                try:
                    with open(json_file, 'r') as f:
                        metadata = json.load(f)

                    png_file = metadata.get('png_file', '')
                    wav_file = metadata.get('audio', {}).get('filename', '')
                    timestamp = metadata.get('temporal', {}).get('begin', '')

                    # Check if PNG exists
                    png_path = example_dir / png_file if png_file else None
                    png_exists = png_path and png_path.exists()

                    if base_name not in recordings_dict:
                        recordings_dict[base_name] = {
                            'id': base_name,
                            'wav': wav_file,
                            'timestamp': timestamp,
                            'analyses': []
                        }

                    recordings_dict[base_name]['analyses'].append({
                        'fft': fft_size,
                        'json': json_file.name,
                        'png': png_file if png_exists else None,
                    })

                except (json.JSONDecodeError, KeyError) as e:
                    logger.warning(f"Could not parse JSON file {json_file}: {e}")
                    continue

            # Sort analyses by FFT size within each recording
            recordings = []
            for rec in recordings_dict.values():
                rec['analyses'].sort(key=lambda x: x['fft'])
                recordings.append(rec)

            # Sort recordings by timestamp
            recordings.sort(key=lambda x: x['timestamp'])

            return JsonResponse({
                'recordings': recordings,
                'basePath': '/api/netcdf/example-file?file=',
            })

        except Exception as e:
            logger.error(f"Failed to list example files: {e}")
            return Response(
                {'error': f'Failed to list example files: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=False, methods=['get'], url_path='example-file')
    def serve_example_file(self, request):
        """
        Serve a file from the example dataset folder.

        Query parameters:
            file: Name of the file to serve (e.g., spectrogram.png)

        Returns:
            FileResponse with the requested file
        """
        filename = request.query_params.get('file')
        if not filename:
            return Response(
                {'error': 'Filename is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Security: prevent directory traversal
        if '..' in filename or filename.startswith('/'):
            return Response(
                {'error': 'Invalid filename'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            datawork_dir = Path(settings.DATAWORK_FOLDER if hasattr(settings, 'DATAWORK_FOLDER') else '/opt/datawork')
            example_dir = datawork_dir / 'dataset' / 'example'
            file_path = example_dir / filename

            if not file_path.exists() or not file_path.is_file():
                raise Http404(f"File not found: {filename}")

            # Determine content type
            content_types = {
                '.json': 'application/json',
                '.png': 'image/png',
                '.wav': 'audio/wav',
                '.mp3': 'audio/mpeg',
            }
            content_type = content_types.get(file_path.suffix.lower(), 'application/octet-stream')

            return FileResponse(
                open(file_path, 'rb'),
                content_type=content_type,
                as_attachment=False
            )

        except Http404:
            raise
        except Exception as e:
            logger.error(f"Failed to serve example file {filename}: {e}")
            return Response(
                {'error': f'Failed to serve file: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=False, methods=['get'], url_path='list-sound-library')
    def list_sound_library(self, request):
        """
        List available audio files in the sound library folder.
        Groups files by prefix (e.g., "Blue whale D-call" from "Blue whale D-call_2025_09_22_00_04_02.wav").

        Returns:
            JSON response with list of available sound files:
            {
                "files": [
                    {
                        "prefix": "Blue whale D-call",
                        "filename": "Blue whale D-call_2025_09_22_00_04_02.wav",
                        "analyses": [
                            {"fft": 4096, "json": "file_fft4096_data.json", "png": "file_fft4096_data.png"},
                        ]
                    }
                ],
                "basePath": "/api/netcdf/sound-library-file?file="
            }
        """
        import re
        try:
            # Get the sound library folder path
            datawork_dir = Path(settings.DATAWORK_FOLDER if hasattr(settings, 'DATAWORK_FOLDER') else '/opt/datawork')
            library_dir = datawork_dir / 'dataset' / 'sound_library'

            logger.info(f"Sound library list - datawork_dir: {datawork_dir}")
            logger.info(f"Sound library list - library_dir: {library_dir}")
            logger.info(f"Sound library list - library_dir exists: {library_dir.exists()}")

            if not library_dir.exists():
                return JsonResponse({
                    'files': [],
                    'basePath': '',
                    'message': 'Sound library folder not found. Place files in volumes/datawork/dataset/sound_library/'
                })

            # Find all JSON files (metadata files)
            json_files = list(library_dir.glob('*_data.json'))

            # Group by WAV file (extract prefix from filename)
            files_dict = {}
            # Pattern: anything_fftNNNN_data.json (captures base name and fft size)
            fft_pattern = re.compile(r'^(.+)_fft(\d+)_data\.json$')

            for json_file in sorted(json_files):
                match = fft_pattern.match(json_file.name)
                if not match:
                    continue

                base_name = match.group(1)
                fft_size = int(match.group(2))

                # Read JSON to get metadata
                try:
                    with open(json_file, 'r') as f:
                        metadata = json.load(f)

                    png_file = metadata.get('png_file', '')
                    wav_file = metadata.get('audio', {}).get('filename', '')

                    # Extract prefix from wav filename (everything before the date pattern)
                    # Pattern: prefix_YYYY_MM_DD_HH_MM_SS.wav (prefix can contain spaces)
                    prefix_match = re.match(r'^(.+)_\d{4}_\d{2}_\d{2}_\d{2}_\d{2}_\d{2}\.wav$', wav_file)
                    if prefix_match:
                        prefix = prefix_match.group(1).strip()
                    else:
                        # Fallback: use filename without extension
                        prefix = os.path.splitext(wav_file)[0] if wav_file else base_name

                    # Check if PNG exists
                    png_path = library_dir / png_file if png_file else None
                    png_exists = png_path and png_path.exists()

                    file_key = wav_file or base_name

                    if file_key not in files_dict:
                        files_dict[file_key] = {
                            'prefix': prefix,
                            'filename': wav_file,
                            'baseName': base_name,
                            'analyses': []
                        }

                    files_dict[file_key]['analyses'].append({
                        'fft': fft_size,
                        'json': json_file.name,
                        'png': png_file if png_exists else None,
                    })

                except (json.JSONDecodeError, KeyError) as e:
                    logger.warning(f"Could not parse JSON file {json_file}: {e}")
                    continue

            # Sort analyses by FFT size within each file
            files = []
            for file_data in files_dict.values():
                file_data['analyses'].sort(key=lambda x: x['fft'])
                files.append(file_data)

            # Sort files by prefix
            files.sort(key=lambda x: x['prefix'])

            return JsonResponse({
                'files': files,
                'basePath': '/api/netcdf/sound-library-file?file=',
            })

        except Exception as e:
            logger.error(f"Failed to list sound library files: {e}")
            return Response(
                {'error': f'Failed to list sound library files: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=False, methods=['get'], url_path='sound-library-file')
    def serve_sound_library_file(self, request):
        """
        Serve a file from the sound library folder.

        Query parameters:
            file: Name of the file to serve (e.g., spectrogram.png)

        Returns:
            FileResponse with the requested file
        """
        filename = request.query_params.get('file')
        if not filename:
            return Response(
                {'error': 'Filename is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Security: prevent directory traversal
        if '..' in filename or filename.startswith('/'):
            return Response(
                {'error': 'Invalid filename'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            datawork_dir = Path(settings.DATAWORK_FOLDER if hasattr(settings, 'DATAWORK_FOLDER') else '/opt/datawork')
            library_dir = datawork_dir / 'dataset' / 'sound_library'
            file_path = library_dir / filename

            logger.info(f"Sound library file request: {filename}")
            logger.info(f"Looking in directory: {library_dir}")
            logger.info(f"Full path: {file_path}")
            logger.info(f"Directory exists: {library_dir.exists()}")
            logger.info(f"File exists: {file_path.exists()}")

            if not library_dir.exists():
                logger.error(f"Sound library directory not found: {library_dir}")
                return Response(
                    {'error': f'Sound library directory not found: {library_dir}'},
                    status=status.HTTP_404_NOT_FOUND
                )

            if not file_path.exists() or not file_path.is_file():
                # List available files for debugging
                available_files = list(library_dir.glob('*.png'))[:10]
                logger.error(f"File not found: {file_path}")
                logger.error(f"Available PNG files: {[f.name for f in available_files]}")
                raise Http404(f"File not found: {filename}. Directory: {library_dir}")

            # Determine content type
            content_types = {
                '.json': 'application/json',
                '.png': 'image/png',
                '.wav': 'audio/wav',
                '.mp3': 'audio/mpeg',
            }
            content_type = content_types.get(file_path.suffix.lower(), 'application/octet-stream')

            return FileResponse(
                open(file_path, 'rb'),
                content_type=content_type,
                as_attachment=False
            )

        except Http404:
            raise
        except Exception as e:
            logger.error(f"Failed to serve sound library file {filename}: {e}")
            return Response(
                {'error': f'Failed to serve file: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

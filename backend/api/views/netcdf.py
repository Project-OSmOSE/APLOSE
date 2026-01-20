"""View for NetCDF spectrogram operations"""
import json
import os
from pathlib import Path

import numpy as np
import xarray as xr
from django.http import JsonResponse
from rest_framework.decorators import action
from rest_framework.viewsets import ViewSet
from rest_framework.response import Response
from rest_framework import status


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

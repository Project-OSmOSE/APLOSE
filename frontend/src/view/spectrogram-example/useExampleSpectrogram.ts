import { useMemo } from 'react';

/**
 * Hook to load a static example NetCDF spectrogram for demonstration purposes.
 *
 * Returns a simplified spectrogram object that can be used with the AnnotatorCanvasWindow
 * and related visualization tools.
 *
 * TODO: This is currently a stub that returns mock data. Future implementation should:
 * - Load an actual NetCDF file from the example dataset
 * - Integrate with the existing spectrogram loading infrastructure
 * - Support switching between different example files
 */
export const useExampleSpectrogram = () => {
  const spectrogram = useMemo(() => ({
    id: 'example-netcdf-spectrogram',
    name: 'Example NetCDF Spectrogram',

    // NetCDF file path (from example dataset)
    spectrogramPath: '/datawork/dataset/netcdf_example/processed/netcdf_analysis/spectrogram/2024_01_01_00_00_00_000000.nc',

    // Audio is optional for NetCDF spectrograms
    audioPath: undefined,

    // Timing information
    start: new Date('2024-01-01T00:00:00.000000+0000'),
    end: new Date('2024-01-01T00:00:10.000000+0000'),
    duration: 10,

    // Frequency range (Hz)
    frequencyMin: 0,
    frequencyMax: 24000,

    // Default visualization settings
    colormap: 'viridis',
    brightness: 0,
    contrast: 1,

    // Annotations (empty for example)
    annotations: [],

    // Dataset information
    dataset: {
      id: 'netcdf_example',
      name: 'NetCDF Example Dataset',
    },
  }), []);

  return {
    spectrogram,
    isFetching: false,
    error: null,
  };
};

import React, { useEffect, useState, useMemo } from 'react';
import Plot from 'react-plotly.js';
import { useAnnotationTask } from '@/api';
import { useWindowHeight, useWindowWidth } from '@/features/Annotator/Canvas';
import { NetCDFControls } from './NetCDFControls';
import styles from './NetCDFSpectrogram.module.scss';

interface NetCDFData {
  spectrogram: number[][];
  time: number[];
  frequency: number[];
  attributes: Record<string, any>;
  shape: number[];
  downsampling: {
    time_step: number;
    freq_step: number;
  };
}

export const NetCDFSpectrogram: React.FC = () => {
  const { spectrogram } = useAnnotationTask();
  const width = useWindowWidth();
  const height = useWindowHeight();
  const [netcdfData, setNetcdfData] = useState<NetCDFData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Colorscale and threshold controls
  const [colorscale, setColorscale] = useState('Jet');
  const [zmin, setZmin] = useState<number>(0);
  const [zmax, setZmax] = useState<number>(0);

  // Parse NetCDF data from GraphQL response
  useEffect(() => {
    if (!spectrogram?.netcdfData) {
      setLoading(false);
      return;
    }

    try {
      const data: NetCDFData = JSON.parse(spectrogram.netcdfData);
      setNetcdfData(data);
      setLoading(false);
    } catch (e) {
      console.error('Error parsing NetCDF data:', e);
      setError('Failed to parse NetCDF data');
      setLoading(false);
    }
  }, [spectrogram?.netcdfData]);

  // Calculate data range for colorscale
  const dataRange = useMemo(() => {
    if (!netcdfData) return { min: 0, max: 0 };

    let min = Infinity;
    let max = -Infinity;

    for (const row of netcdfData.spectrogram) {
      for (const val of row) {
        if (val < min) min = val;
        if (val > max) max = val;
      }
    }

    return { min, max };
  }, [netcdfData]);

  // Initialize threshold values when data loads
  useEffect(() => {
    if (dataRange.min !== Infinity && dataRange.max !== -Infinity) {
      setZmin(dataRange.min);
      setZmax(dataRange.max);
    }
  }, [dataRange]);

  const plotData = useMemo(() => {
    if (!netcdfData) return [];

    return [
      {
        type: 'heatmap' as const,
        z: netcdfData.spectrogram,
        x: netcdfData.time,
        y: netcdfData.frequency,
        colorscale: colorscale,
        zmin: zmin,
        zmax: zmax,
        hovertemplate: 'Time: %{x:.2f}s<br>Frequency: %{y:.0f}Hz<br>Power: %{z:.1f}dB<extra></extra>',
        colorbar: {
          title: { text: 'dB' },
          len: 0.9,
          x: 1.02,
        },
      },
    ];
  }, [netcdfData, colorscale, zmin, zmax]);

  const layout = useMemo(() => {
    if (!netcdfData) return {};

    return {
      width: width,
      height: height,
      margin: { l: 60, r: 120, t: 20, b: 50 },
      xaxis: {
        title: { text: 'Time (s)' },
        showgrid: true,
        zeroline: false,
        range: [netcdfData.time[0], netcdfData.time[netcdfData.time.length - 1]],
      },
      yaxis: {
        title: { text: 'Frequency (Hz)' },
        showgrid: true,
        zeroline: false,
        range: [netcdfData.frequency[0], netcdfData.frequency[netcdfData.frequency.length - 1]],
      },
      dragmode: 'pan' as const,
      hovermode: 'closest' as const,
      plot_bgcolor: '#000',
      paper_bgcolor: '#000',
      font: {
        color: '#fff',
      },
    };
  }, [netcdfData, width, height]);

  const config = useMemo(() => ({
    displayModeBar: true,
    displaylogo: false,
    scrollZoom: true,
    doubleClick: 'reset' as const,
    responsive: true,
    modeBarButtonsToRemove: ['lasso2d', 'select2d'] as any,
    modeBarButtonsToAdd: [],
  }), []);

  if (loading) {
    return <div className={styles.loading}>Loading NetCDF spectrogram...</div>;
  }

  if (error || !netcdfData) {
    return <div className={styles.error}>{error || 'No NetCDF data available'}</div>;
  }

  return (
    <div className={styles.netcdfContainer}>
      <NetCDFControls
        colorscale={colorscale}
        onColorscaleChange={setColorscale}
        zmin={zmin}
        zmax={zmax}
        onZminChange={setZmin}
        onZmaxChange={setZmax}
        dataMin={dataRange.min}
        dataMax={dataRange.max}
      />
      <Plot
        data={plotData}
        layout={layout}
        config={config}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
};

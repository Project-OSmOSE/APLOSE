import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import Plot from 'react-plotly.js';
import { AnnotationType, useAnnotationTask } from '@/api';
import { useWindowHeight, useWindowWidth } from '@/features/Annotator/Canvas';
import { NetCDFControls } from './NetCDFControls';
import styles from './NetCDFSpectrogram.module.scss';
import { useAddAnnotation } from '@/features/Annotator/Annotation';
import { useAppSelector } from '@/features/App';
import { selectFocusLabel } from '@/features/Annotator/Label';
import { selectFocusConfidence } from '@/features/Annotator/Confidence';
import { selectIsDrawingEnabled } from '@/features/Annotator/UX';

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
  const [colorscale, setColorscale] = useState('Viridis');
  const [zmin, setZmin] = useState<number>(0);
  const [zmax, setZmax] = useState<number>(0);
  const [yAxisScale, setYAxisScale] = useState<'linear' | 'log'>('log');

  // Plot reference for managing dragmode
  const plotRef = useRef<any>(null);

  // Annotation support
  const addAnnotation = useAddAnnotation();
  const focusedLabel = useAppSelector(selectFocusLabel);
  const focusedConfidence = useAppSelector(selectFocusConfidence);
  const isDrawingEnabled = useAppSelector(selectIsDrawingEnabled);

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
        showscale: false,
        hovertemplate: 'Time: %{x:.2f}s<br>Frequency: %{y:.0f}Hz<br>Power: %{z:.1f}dB<extra></extra>',
      },
    ];
  }, [netcdfData, colorscale, zmin, zmax]);

  const layout = useMemo(() => {
    if (!netcdfData) return {};

    const controlsHeight = 80;
    const plotHeight = height - controlsHeight;

    const yAxisConfig = yAxisScale === 'log'
      ? {
          type: 'log' as const,
          range: [Math.log10(netcdfData.frequency[0]), Math.log10(netcdfData.frequency[netcdfData.frequency.length - 1])],
        }
      : {
          type: 'linear' as const,
          range: [netcdfData.frequency[0], netcdfData.frequency[netcdfData.frequency.length - 1]],
        };

    return {
      width: width,
      height: plotHeight,
      margin: { l: 60, r: 20, t: 10, b: 40 },
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
        ...yAxisConfig,
      },
      dragmode: isDrawingEnabled ? ('select' as const) : (false as const),
      hovermode: 'closest' as const,
      plot_bgcolor: '#000',
      paper_bgcolor: '#000',
      font: {
        color: '#fff',
      },
    };
  }, [netcdfData, width, height, isDrawingEnabled, yAxisScale]);

  const config = useMemo(() => ({
    displayModeBar: true,
    displaylogo: false,
    scrollZoom: true,
    doubleClick: 'reset' as const,
    responsive: true,
    modeBarButtonsToRemove: ['lasso2d'] as any,
    modeBarButtonsToAdd: [],
  }), []);

  // Handle box selection to create annotations
  const onSelected = useCallback((event: any) => {
    if (!event || !event.range || !focusedLabel || !isDrawingEnabled) return;

    const { x, y } = event.range;

    // x is time range, y is frequency range
    const startTime = Math.min(x[0], x[1]);
    const endTime = Math.max(x[0], x[1]);
    const startFrequency = Math.min(y[0], y[1]);
    const endFrequency = Math.max(y[0], y[1]);

    // Only create annotation if box has meaningful size
    if (endTime - startTime > 0.01 && endFrequency - startFrequency > 1) {
      addAnnotation({
        type: AnnotationType.Box,
        startTime,
        endTime,
        startFrequency,
        endFrequency,
        label: focusedLabel,
        confidence: focusedConfidence ?? undefined,
      });
    }
  }, [addAnnotation, focusedLabel, focusedConfidence, isDrawingEnabled]);

  // Restore dragmode after zoom/pan operations
  const onRelayout = useCallback((event: any) => {
    if (!plotRef.current || !isDrawingEnabled) return;

    // After any relayout event (zoom, pan, etc.), restore dragmode to 'select'
    const plotlyDiv = plotRef.current.el;
    if (plotlyDiv && plotlyDiv.layout && plotlyDiv.layout.dragmode !== 'select') {
      // Use Plotly.relayout to restore select mode
      try {
        const Plotly = (window as any).Plotly;
        if (Plotly) {
          Plotly.relayout(plotlyDiv, { dragmode: 'select' });
        }
      } catch (e) {
        console.error('Error restoring dragmode:', e);
      }
    }
  }, [isDrawingEnabled]);

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
        yAxisScale={yAxisScale}
        onYAxisScaleChange={setYAxisScale}
      />
      <div className={styles.plotContainer}>
        <Plot
          ref={plotRef}
          data={plotData}
          layout={layout}
          config={config}
          style={{ width: '100%', height: '100%' }}
          onSelected={onSelected}
          onRelayout={onRelayout}
        />
      </div>
    </div>
  );
};

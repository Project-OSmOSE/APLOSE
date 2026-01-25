import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import Plot from 'react-plotly.js';
import { AnnotationType, useAnnotationTask } from '@/api';
import { useWindowHeight, useWindowWidth } from '@/features/Annotator/Canvas';
import { NetCDFControls } from './NetCDFControls';
import styles from './NetCDFSpectrogram.module.scss';
import { useAddAnnotation, selectAllAnnotations, selectAnnotation } from '@/features/Annotator/Annotation';
import { useAppSelector, useAppDispatch } from '@/features/App';
import { selectFocusLabel, selectAllLabels } from '@/features/Annotator/Label';
import { selectFocusConfidence } from '@/features/Annotator/Confidence';
import { selectIsDrawingEnabled } from '@/features/Annotator/UX';
import { useAudio } from '@/features/Audio';
import { focusAnnotation } from '@/features/Annotator/Annotation/slice';

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

// APLOSE label colors (from annotation-colors.css)
const LABEL_COLORS = [
  'rgb(0, 177, 185)',    // ion-color-0: cyan
  'rgb(162, 59, 114)',   // ion-color-1: magenta
  'rgb(241, 143, 1)',    // ion-color-2: orange
  'rgb(199, 62, 29)',    // ion-color-3: red-orange
  'rgb(187, 126, 93)',   // ion-color-4: brown
  'rgb(234, 196, 53)',   // ion-color-5: yellow
  'rgb(152, 206, 0)',    // ion-color-6: lime green
  'rgb(103, 97, 168)',   // ion-color-7: purple
  'rgb(0, 155, 114)',    // ion-color-8: teal
  'rgb(42, 45, 52)',     // ion-color-9: dark gray
];

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

  // Capture label/confidence at start of selection to prevent label jumping
  const selectionStartLabelRef = useRef<string | null>(null);
  const selectionStartConfidenceRef = useRef<string | null | undefined>(null);

  // Annotation support
  const addAnnotation = useAddAnnotation();
  const focusedLabel = useAppSelector(selectFocusLabel);
  const focusedConfidence = useAppSelector(selectFocusConfidence);
  const isDrawingEnabled = useAppSelector(selectIsDrawingEnabled);
  const allAnnotations = useAppSelector(selectAllAnnotations);
  const focusedAnnotation = useAppSelector(selectAnnotation);
  const allLabels = useAppSelector(selectAllLabels);
  const dispatch = useAppDispatch();

  // Audio support - only for playback indicator and seek
  const { seek, time: audioTime, duration: audioDuration } = useAudio();

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

    // Add playback position indicator line
    const shapes: any[] = [];
    const annotations: any[] = [];

    // Add playback indicator
    if (audioDuration && audioTime !== undefined) {
      shapes.push({
        type: 'line' as const,
        x0: audioTime,
        x1: audioTime,
        y0: 0,
        y1: 1,
        yref: 'paper' as const,
        line: {
          color: '#ff0000',
          width: 2,
        },
        layer: 'above' as const,
      });
    }

    // Get y-axis range limits for clamping
    const minFreq = netcdfData.frequency[0];
    const maxFreq = netcdfData.frequency[netcdfData.frequency.length - 1];
    const yMin = yAxisScale === 'log' ? Math.log10(minFreq) : minFreq;
    const yMax = yAxisScale === 'log' ? Math.log10(maxFreq) : maxFreq;

    // Add annotation boxes as Plotly shapes
    allAnnotations.forEach((annotation) => {
      if (annotation.type !== AnnotationType.Box) return;
      // Check for null/undefined, but allow 0 as a valid value
      if (annotation.startTime == null || annotation.endTime == null ||
          annotation.startFrequency == null || annotation.endFrequency == null) return;

      const isFocused = focusedAnnotation?.id === annotation.id;

      // Get label color based on index in allLabels
      const labelIndex = allLabels.indexOf(annotation.label);
      const colorIndex = labelIndex >= 0 ? labelIndex % 10 : 0;
      const labelColor = LABEL_COLORS[colorIndex];

      // Parse RGB from label color for fillcolor
      const rgbMatch = labelColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
      const fillColor = rgbMatch
        ? `rgba(${rgbMatch[1]}, ${rgbMatch[2]}, ${rgbMatch[3]}, 0.15)`
        : 'rgba(255, 255, 0, 0.15)';

      // Convert frequencies to log10 space if in log mode, with clamping
      let y0, y1;
      if (yAxisScale === 'log') {
        // Clamp frequencies to valid range before taking log
        const clampedStart = Math.max(minFreq, Math.min(maxFreq, annotation.startFrequency));
        const clampedEnd = Math.max(minFreq, Math.min(maxFreq, annotation.endFrequency));
        y0 = Math.log10(clampedStart);
        y1 = Math.log10(clampedEnd);
      } else {
        y0 = annotation.startFrequency;
        y1 = annotation.endFrequency;
      }

      shapes.push({
        type: 'rect' as const,
        x0: annotation.startTime,
        x1: annotation.endTime,
        y0: y0,
        y1: y1,
        line: {
          color: labelColor,
          width: isFocused ? 3 : 2,
        },
        fillcolor: fillColor,
        layer: 'above' as const,
        // Store annotation ID for click handling
        name: `annotation-${annotation.id}`,
      });

      // Add text label for the annotation
      // In log mode, convert y position to log10 space and clamp to visible range
      let textY;
      if (yAxisScale === 'log') {
        const clampedEndFreq = Math.max(minFreq, Math.min(maxFreq, annotation.endFrequency));
        textY = Math.log10(clampedEndFreq);
        // Ensure textY is within the y-axis range
        textY = Math.max(yMin, Math.min(yMax, textY));
      } else {
        textY = annotation.endFrequency;
      }

      annotations.push({
        x: annotation.startTime,
        y: textY,
        xref: 'x' as const,
        yref: 'y' as const,
        text: annotation.label,
        showarrow: false,
        font: {
          color: labelColor,
          size: 12,
          family: 'Arial, sans-serif',
        },
        bgcolor: 'rgba(0, 0, 0, 0.7)',
        borderpad: 3,
        xanchor: 'left' as const,
        yanchor: 'bottom' as const,
      });
    });

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
      shapes: shapes,
      annotations: annotations,
      dragmode: isDrawingEnabled ? ('select' as const) : (false as const),
      hovermode: 'closest' as const,
      plot_bgcolor: '#000',
      paper_bgcolor: '#000',
      font: {
        color: '#fff',
      },
    };
  }, [netcdfData, width, height, isDrawingEnabled, yAxisScale, audioTime, audioDuration, allAnnotations, focusedAnnotation, allLabels]);

  const config = useMemo(() => ({
    displayModeBar: true,
    displaylogo: false,
    scrollZoom: false,
    doubleClick: 'reset' as const,
    responsive: true,
    modeBarButtonsToRemove: ['lasso2d'] as any,
    modeBarButtonsToAdd: [],
  }), []);

  // Handle plot clicks: focus annotation or seek audio
  const onPlotClick = useCallback((event: any) => {
    // Check if click is on the plot (has points data)
    if (event?.points && event.points.length > 0) {
      const clickedTime = event.points[0].x;
      const clickedFreq = event.points[0].y;

      // Check if click is within any annotation bounds
      for (const annotation of allAnnotations) {
        if (annotation.type !== AnnotationType.Box) continue;
        if (!annotation.startTime || !annotation.endTime || !annotation.startFrequency || !annotation.endFrequency) continue;

        const inTimeRange = clickedTime >= annotation.startTime && clickedTime <= annotation.endTime;
        const inFreqRange = clickedFreq >= annotation.startFrequency && clickedFreq <= annotation.endFrequency;

        if (inTimeRange && inFreqRange) {
          // Focus this annotation
          dispatch(focusAnnotation(annotation));
          return;
        }
      }

      // No annotation clicked, seek audio to clicked position
      if (typeof clickedTime === 'number') {
        seek(clickedTime);
      }
    }
  }, [seek, allAnnotations, dispatch]);

  // Capture label/confidence when mousedown on plot (start of drag/selection)
  const onPlotMouseDown = useCallback(() => {
    if (isDrawingEnabled && focusedLabel) {
      selectionStartLabelRef.current = focusedLabel;
      selectionStartConfidenceRef.current = focusedConfidence;
    }
  }, [isDrawingEnabled, focusedLabel, focusedConfidence]);

  // Handle box selection to create annotations
  const onSelected = useCallback((event: any) => {
    if (!event || !event.range || !isDrawingEnabled) return;

    // Use the label captured at selection start, not the current focused label
    const labelToUse = selectionStartLabelRef.current;
    const confidenceToUse = selectionStartConfidenceRef.current;

    if (!labelToUse) {
      console.warn('No label was selected when starting the annotation');
      return;
    }

    const { x, y } = event.range;

    // x is time range, y is frequency range (in log10 space if log mode)
    const startTime = Math.min(x[0], x[1]);
    const endTime = Math.max(x[0], x[1]);

    let startFrequency = Math.min(y[0], y[1]);
    let endFrequency = Math.max(y[0], y[1]);

    // Convert from log10 space back to actual frequencies if in log mode
    if (yAxisScale === 'log') {
      startFrequency = Math.pow(10, startFrequency);
      endFrequency = Math.pow(10, endFrequency);
    }

    // Only create annotation if box has meaningful size
    if (endTime - startTime > 0.01 && endFrequency - startFrequency > 1) {
      addAnnotation({
        type: AnnotationType.Box,
        startTime,
        endTime,
        startFrequency,
        endFrequency,
        label: labelToUse,
        confidence: confidenceToUse ?? undefined,
      });
    }

    // Clear the stored values
    selectionStartLabelRef.current = null;
    selectionStartConfidenceRef.current = null;
  }, [addAnnotation, isDrawingEnabled, yAxisScale]);

  // Restore dragmode after zoom/pan operations
  const onRelayout = useCallback((_event: any) => {
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
      <div className={styles.plotContainer} onMouseDown={onPlotMouseDown}>
        <Plot
          ref={plotRef}
          data={plotData}
          layout={layout}
          config={config}
          style={{ width: '100%', height: '100%' }}
          onClick={onPlotClick}
          onSelected={onSelected}
          onRelayout={onRelayout}
        />
      </div>
    </div>
  );
};

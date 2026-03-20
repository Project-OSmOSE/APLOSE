import React, { useEffect, useState, useMemo, useCallback, useRef, ReactNode } from 'react';
import Plot from 'react-plotly.js';
import { IonSpinner } from '@ionic/react';
import { useAudio } from '@/features/Audio/context';
import { PlayPauseButton } from '@/features/Audio/PlayPauseButton';
import { PlaybackRateSelect } from '@/features/Audio/PlaybackRate';
import styles from './styles.module.scss';

interface DataPNGMetadata {
  format_version: number;
  png_file: string;
  encoding: {
    bit_depth: number;
    db_min: number;
    db_max: number;
    description: string;
  };
  spectrogram: {
    shape: [number, number];
    original_shape: [number, number];
    frequency_min: number;
    frequency_max: number;
    frequency_scale: 'log' | 'linear';
    time_min: number;
    time_max: number;
    time_scale: string;
    n_frequencies: number;
    n_times: number;
    original_n_frequencies: number;
    original_n_times: number;
    resampled: boolean;
  };
  audio: {
    sample_rate: number;
    duration: number;
    filename: string;
  };
  analysis: {
    nfft: number;
    hop_length: number;
    window: string;
    normalize_audio: boolean;
  };
  calibration: {
    db_fullscale: number | null;
    db_ref: number | null;
  };
  temporal: {
    begin: string;
    end: string;
  };
}

interface FftOption {
  value: number;
  label: string;
  fft: number;
}

interface SoundLibraryViewerProps {
  jsonPath: string;
  basePath: string;
  wavFile?: string;
  fftOptions?: FftOption[];
  selectedFftIndex?: number;
  onFftChange?: (index: number) => void;
  onBack?: () => void;
  fileSelector?: ReactNode;
}

const LOG_STEPS = 1000;

function freqToPos(freq: number, minHz: number, maxHz: number): number {
  const lo = Math.max(minHz, 1);
  if (lo >= maxHz) return 0;
  return Math.round((Math.log(Math.max(freq, lo) / lo) / Math.log(maxHz / lo)) * LOG_STEPS);
}

function posToFreq(pos: number, minHz: number, maxHz: number): number {
  const lo = Math.max(minHz, 1);
  if (lo >= maxHz) return lo;
  return Math.round(lo * Math.pow(maxHz / lo, pos / LOG_STEPS));
}

const COLORSCALES = [
  'Viridis', 'Hot', 'Jet', 'Portland', 'Picnic', 'Rainbow',
  'Blackbody', 'Earth', 'Electric', 'Greens', 'Blues', 'Greys', 'Greys_r', 'YlGnBu', 'YlOrRd',
];

/**
 * Sound Library Spectrogram Viewer
 *
 * Loads and displays spectrogram data from PNG + JSON format files.
 */
export const SoundLibraryViewer: React.FC<SoundLibraryViewerProps> = ({
  jsonPath,
  basePath,
  wavFile,
  fftOptions = [],
  selectedFftIndex = 0,
  onFftChange,
  onBack,
  fileSelector,
}) => {
  const [metadata, setMetadata] = useState<DataPNGMetadata | null>(null);
  const [spectrogramData, setSpectrogramData] = useState<number[][] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Plot reference for managing layout updates
  const plotRef = useRef<any>(null);

  // Use the global audio context
  const audio = useAudio();

  // Track whether the user has explicitly seeked (to show the marker even at t=0)
  const [hasSeeked, setHasSeeked] = useState(false);

  // Reset seek flag when a new file is loaded
  useEffect(() => {
    setHasSeeked(false);
  }, [jsonPath, basePath, wavFile]);

  // Controls
  const [colorscale, setColorscale] = useState('Greys_r');
  const [yAxisScale, setYAxisScale] = useState<'log' | 'linear'>('linear');

  // Draft state — only pushed to plot on Apply
  const [draftZmin, setDraftZmin] = useState(-120);
  const [draftZmax, setDraftZmax] = useState(0);
  const [draftFreqMin, setDraftFreqMin] = useState(0);
  const [draftFreqMax, setDraftFreqMax] = useState(24000);

  // Applied state — what the plot actually uses
  const [zmin, setZmin] = useState<number | null>(null);
  const [zmax, setZmax] = useState<number | null>(null);
  const [appliedFreqMin, setAppliedFreqMin] = useState<number | null>(null);
  const [appliedFreqMax, setAppliedFreqMax] = useState<number | null>(null);

  // Load metadata and PNG
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Load JSON metadata
        const jsonUrl = `${basePath}${encodeURIComponent(jsonPath)}`;
        const jsonResponse = await fetch(jsonUrl);
        if (!jsonResponse.ok) {
          throw new Error(`Failed to load metadata: ${jsonResponse.status} ${jsonResponse.statusText}`);
        }
        const meta: DataPNGMetadata = await jsonResponse.json();
        setMetadata(meta);

        // Derive PNG filename from JSON filename (replace .json with .png)
        // This handles cases where files were renamed but JSON metadata still has old filename
        const pngFilename = jsonPath.replace(/\.json$/, '.png');
        const pngUrl = `${basePath}${encodeURIComponent(pngFilename)}`;
        const pngData = await decodePNG(pngUrl, meta);
        setSpectrogramData(pngData);

        // Set initial y-axis scale from metadata
        if (meta.spectrogram.frequency_scale) {
          setYAxisScale(meta.spectrogram.frequency_scale);
        }

        // Reset all draft + applied ranges to match new file
        setDraftZmin(meta.encoding.db_min);
        setDraftZmax(meta.encoding.db_max);
        setZmin(null);
        setZmax(null);
        setDraftFreqMin(meta.spectrogram.frequency_min);
        setDraftFreqMax(meta.spectrogram.frequency_max);
        setAppliedFreqMin(null);
        setAppliedFreqMax(null);

        // Set audio source
        const audioUrl = wavFile
          ? `${basePath}${encodeURIComponent(wavFile)}`
          : `${basePath}${encodeURIComponent(meta.audio.filename)}`;
        audio.setSource(audioUrl);

        setLoading(false);
      } catch (e) {
        console.error('Error loading data:', e);
        setError(e instanceof Error ? e.message : 'Failed to load spectrogram');
        setLoading(false);
      }
    };

    if (jsonPath && basePath) {
      loadData();
    }

    return () => {
      audio.clearSource();
    };
  }, [jsonPath, basePath, wavFile]);

  // Decode 16-bit PNG to spectrogram data
  const decodePNG = async (url: string, meta: DataPNGMetadata): Promise<number[][]> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      // Don't set crossOrigin for same-origin requests
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }

        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, img.width, img.height);
        const { data, width, height } = imageData;

        // Convert to 2D array and scale to dB values
        const { db_min, db_max } = meta.encoding;
        const dbRange = db_max - db_min;
        const spectrogram: number[][] = [];

        for (let y = 0; y < height; y++) {
          const row: number[] = [];
          for (let x = 0; x < width; x++) {
            const idx = (y * width + x) * 4;
            // For 16-bit PNG shown as 8-bit, use red channel
            const pixelValue = data[idx] / 255;
            const dbValue = db_min + pixelValue * dbRange;
            row.push(dbValue);
          }
          spectrogram.push(row);
        }

        // Flip vertically (PNG has low freq at top, we want at bottom)
        resolve(spectrogram.reverse());
      };
      img.onerror = (e) => {
        console.error('PNG load error:', url, e);
        reject(new Error(`Failed to load PNG image: ${url}`));
      };
      img.src = url;
    });
  };

  // Calculate data range
  const dataRange = useMemo(() => {
    if (!metadata) return { min: -120, max: 0 };
    return { min: metadata.encoding.db_min, max: metadata.encoding.db_max };
  }, [metadata]);

  // Effective ranges (applied → plot)
  const effectiveZmin = zmin ?? dataRange.min;
  const effectiveZmax = zmax ?? dataRange.max;
  const freqDataMin = metadata?.spectrogram.frequency_min ?? 0;
  const freqDataMax = metadata?.spectrogram.frequency_max ?? 24000;
  const effectiveFreqMin = appliedFreqMin ?? freqDataMin;
  const effectiveFreqMax = appliedFreqMax ?? freqDataMax;

  const handleApplyAll = () => {
    setZmin(draftZmin);
    setZmax(draftZmax);
    setAppliedFreqMin(draftFreqMin);
    setAppliedFreqMax(draftFreqMax);
  };

  const handleResetZRange = () => {
    setDraftZmin(dataRange.min);
    setDraftZmax(dataRange.max);
    setZmin(null);
    setZmax(null);
  };

  const handleResetFreqRange = () => {
    setDraftFreqMin(freqDataMin);
    setDraftFreqMax(freqDataMax);
    setAppliedFreqMin(null);
    setAppliedFreqMax(null);
  };

  // Generate frequency and time arrays based on metadata scale
  const { frequencies, times } = useMemo(() => {
    if (!metadata || !spectrogramData) return { frequencies: [], times: [] };

    const { frequency_min, frequency_max, frequency_scale, time_min, time_max } = metadata.spectrogram;
    const height = spectrogramData.length;
    const width = spectrogramData[0]?.length || 0;

    // Generate frequency array based on scale from JSON
    let freqs: number[];
    if (frequency_scale === 'log') {
      // Log-spaced frequencies
      freqs = Array.from({ length: height }, (_, i) => {
        const t = i / (height - 1);
        return frequency_min * Math.pow(frequency_max / frequency_min, t);
      });
    } else {
      // Linear-spaced frequencies
      freqs = Array.from({ length: height }, (_, i) =>
        frequency_min + (frequency_max - frequency_min) * i / (height - 1)
      );
    }

    // Generate time array (always linear)
    const timeArr = Array.from({ length: width }, (_, i) =>
      time_min + (time_max - time_min) * i / (width - 1)
    );

    return { frequencies: freqs, times: timeArr };
  }, [metadata, spectrogramData]);

  // Plot data - no colorbar
  const plotData = useMemo(() => {
    if (!spectrogramData || !frequencies.length || !times.length) return [];

    const isReversed = colorscale.endsWith('_r');
    const actualColorscale = isReversed ? colorscale.slice(0, -2) : colorscale;

    return [
      {
        type: 'heatmap' as const,
        z: spectrogramData,
        x: times,
        y: frequencies,
        colorscale: actualColorscale,
        reversescale: isReversed,
        zmin: effectiveZmin,
        zmax: effectiveZmax,
        showscale: false,
        hovertemplate: 'Time: %{x:.2f}s<br>Frequency: %{y:.0f}Hz<br>Power: %{z:.1f}dB<extra></extra>',
      },
    ];
  }, [spectrogramData, frequencies, times, colorscale, effectiveZmin, effectiveZmax]);

  // Layout with playback indicator line
  const layout = useMemo(() => {
    if (!metadata) return {};

    const { time_min, time_max } = metadata.spectrogram;

    const shapes: any[] = [];

    // Playback indicator line - animated with audio time
    if (audio.time > 0 || hasSeeked) {
      shapes.push({
        type: 'line' as const,
        x0: audio.time,
        x1: audio.time,
        y0: effectiveFreqMin,
        y1: effectiveFreqMax,
        yref: 'y' as const,
        line: { color: '#ff0000', width: 2 },
        layer: 'above' as const,
      });
    }

    // Y-axis configuration based on scale type
    const yAxisConfig = yAxisScale === 'log'
      ? {
          type: 'log' as const,
          range: [Math.log10(Math.max(1, effectiveFreqMin)), Math.log10(effectiveFreqMax)],
          autorange: false,
          fixedrange: false,
        }
      : {
          type: 'linear' as const,
          range: [effectiveFreqMin, effectiveFreqMax],
          autorange: false,
          fixedrange: false,
        };

    return {
      margin: { l: 60, r: 20, t: 10, b: 40 },
      xaxis: {
        title: { text: 'Time (s)' },
        showgrid: true,
        gridcolor: '#333',
        zeroline: false,
        tickfont: { color: '#aaa' },
        range: [time_min, time_max],
        autorange: false,
        fixedrange: false,
      },
      yaxis: {
        title: { text: 'Frequency (Hz)' },
        showgrid: true,
        gridcolor: '#333',
        zeroline: false,
        tickfont: { color: '#aaa' },
        ...yAxisConfig,
      },
      shapes,
      hovermode: 'closest' as const,
      plot_bgcolor: '#000',
      paper_bgcolor: '#000',
      font: { color: '#fff' },
    };
  }, [metadata, yAxisScale, audio.time, hasSeeked, effectiveFreqMin, effectiveFreqMax]);

  const config = useMemo(() => ({
    displayModeBar: true,
    displaylogo: false,
    scrollZoom: false,
    doubleClick: 'reset' as const,
    responsive: true,
    modeBarButtonsToRemove: ['lasso2d', 'select2d'] as any,
  }), []);

  // Click to seek audio
  const handlePlotClick = useCallback((event: any) => {
    if (event?.points?.[0]?.x !== undefined) {
      audio.seek(event.points[0].x as number);
      setHasSeeked(true);
    }
  }, [audio]);

  // Enforce zoom constraints
  const onRelayout = useCallback((event: any) => {
    if (!plotRef.current || !metadata) return;

    const plotlyDiv = plotRef.current.el;
    if (!plotlyDiv) return;

    const Plotly = (window as any).Plotly;
    if (!Plotly) return;

    const updates: any = {};
    let needsUpdate = false;

    const { frequency_min, frequency_max, time_min, time_max } = metadata.spectrogram;

    // Check if x-axis range was modified
    if (event && (event['xaxis.range[0]'] !== undefined || event['xaxis.range'] !== undefined)) {
      const currentXAxis = plotlyDiv.layout?.xaxis;
      if (currentXAxis) {
        const currentRange = currentXAxis.range || [time_min, time_max];
        const newRange = [
          Math.max(time_min, Math.min(time_max, currentRange[0])),
          Math.max(time_min, Math.min(time_max, currentRange[1]))
        ];

        if (newRange[0] !== currentRange[0] || newRange[1] !== currentRange[1]) {
          updates['xaxis.range'] = newRange;
          needsUpdate = true;
        }
      }
    }

    // Check if y-axis range was modified
    if (event && (event['yaxis.range[0]'] !== undefined || event['yaxis.range'] !== undefined)) {
      const currentYAxis = plotlyDiv.layout?.yaxis;
      if (currentYAxis?.type === 'log') {
        const minLogFreq = Math.log10(Math.max(1, frequency_min));
        const maxLogFreq = Math.log10(frequency_max);

        const currentRange = currentYAxis.range || [minLogFreq, maxLogFreq];
        const newRange = [
          Math.max(minLogFreq, Math.min(maxLogFreq, currentRange[0])),
          Math.max(minLogFreq, Math.min(maxLogFreq, currentRange[1]))
        ];

        if (newRange[0] !== currentRange[0] || newRange[1] !== currentRange[1]) {
          updates['yaxis.range'] = newRange;
          needsUpdate = true;
        }
      } else {
        const currentRange = currentYAxis?.range || [frequency_min, frequency_max];
        const newRange = [
          Math.max(frequency_min, Math.min(frequency_max, currentRange[0])),
          Math.max(frequency_min, Math.min(frequency_max, currentRange[1]))
        ];

        if (newRange[0] !== currentRange[0] || newRange[1] !== currentRange[1]) {
          updates['yaxis.range'] = newRange;
          needsUpdate = true;
        }
      }
    }

    if (needsUpdate) {
      try {
        Plotly.relayout(plotlyDiv, updates);
      } catch (e) {
        console.error('Error updating plot layout:', e);
      }
    }
  }, [metadata]);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <IonSpinner />
        <p>Loading spectrogram...</p>
      </div>
    );
  }

  if (error || !metadata || !spectrogramData) {
    return (
      <div className={styles.errorContainer}>
        <h3>Error Loading Spectrogram</h3>
        <p>{error || 'No data available'}</p>
      </div>
    );
  }

  return (
    <div className={styles.viewerContainer}>
      {/* Controls Panel */}
      <div className={styles.controlsPanel}>
        {/* Back Button */}
        {onBack && (
          <button className={styles.backButton} onClick={onBack}>
            ← Back
          </button>
        )}

        {/* File Selector Dropdown */}
        {fileSelector && (
          <div className={styles.controlGroup}>
            <label>Sound</label>
            {fileSelector}
          </div>
        )}

        {/* FFT Selector */}
        {fftOptions.length > 0 && (
          <div className={styles.controlGroup}>
            <label>Analysis</label>
            <select
              value={selectedFftIndex}
              onChange={(e) => onFftChange?.(parseInt(e.target.value))}
            >
              {fftOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        )}

        <div className={styles.controlGroup}>
          <label>Y-Axis</label>
          <div className={styles.buttonGroup}>
            <button
              onClick={() => setYAxisScale('linear')}
              className={yAxisScale === 'linear' ? styles.active : ''}
            >
              Linear
            </button>
            <button
              onClick={() => setYAxisScale('log')}
              className={yAxisScale === 'log' ? styles.active : ''}
            >
              Log
            </button>
          </div>
        </div>

        <div className={styles.controlGroup}>
          <label>Colorscale</label>
          <select value={colorscale} onChange={(e) => setColorscale(e.target.value)}>
            {COLORSCALES.map((scale) => (
              <option key={scale} value={scale}>{scale}</option>
            ))}
          </select>
        </div>

        <div className={styles.controlGroup}>
          <label>Min: {draftZmin.toFixed(1)} dB</label>
          <input
            type="range"
            min={dataRange.min}
            max={dataRange.max}
            step={(dataRange.max - dataRange.min) / 100}
            value={draftZmin}
            onChange={(e) => setDraftZmin(parseFloat(e.target.value))}
          />
        </div>

        <div className={styles.controlGroup}>
          <label>Max: {draftZmax.toFixed(1)} dB</label>
          <input
            type="range"
            min={dataRange.min}
            max={dataRange.max}
            step={(dataRange.max - dataRange.min) / 100}
            value={draftZmax}
            onChange={(e) => setDraftZmax(parseFloat(e.target.value))}
          />
          <button className={styles.resetButton} onClick={handleResetZRange}>
            Reset dB
          </button>
        </div>

        <div className={styles.controlGroup}>
          <label>Freq Min: {draftFreqMin} Hz</label>
          <input
            type="range"
            min={0}
            max={LOG_STEPS}
            step={1}
            value={freqToPos(draftFreqMin, freqDataMin, freqDataMax)}
            onChange={(e) => setDraftFreqMin(posToFreq(parseInt(e.target.value, 10), freqDataMin, freqDataMax))}
          />
        </div>

        <div className={styles.controlGroup}>
          <label>Freq Max: {draftFreqMax} Hz</label>
          <input
            type="range"
            min={0}
            max={LOG_STEPS}
            step={1}
            value={freqToPos(draftFreqMax, freqDataMin, freqDataMax)}
            onChange={(e) => setDraftFreqMax(posToFreq(parseInt(e.target.value, 10), freqDataMin, freqDataMax))}
          />
          <button className={styles.resetButton} onClick={handleResetFreqRange}>
            Reset Freq
          </button>
          <button className={styles.applyButton} onClick={handleApplyAll}>
            Apply ranges
          </button>
        </div>

        <div className={styles.infoText}>
          <span>{metadata.temporal.begin}</span>
        </div>
      </div>

      {/* Spectrogram Plot */}
      <div className={styles.plotArea}>
        <Plot
          ref={plotRef}
          data={plotData}
          layout={layout}
          config={config}
          style={{ width: '100%', height: '100%' }}
          onClick={handlePlotClick}
          onRelayout={onRelayout}
          useResizeHandler
        />
      </div>

      {/* Audio Controls */}
      <div className={styles.navigationPanel}>
        <div className={styles.audioControls}>
          <PlayPauseButton />
          <PlaybackRateSelect />
        </div>
      </div>
    </div>
  );
};

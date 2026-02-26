import React, { useEffect, useState, useMemo, useCallback } from 'react';
import Plot from 'react-plotly.js';
import { IonSpinner } from '@ionic/react';
import { useAudio } from '@/features/Audio/context';
import { PlayPauseButton } from '@/features/Audio/PlayPauseButton';
import { CurrentTime } from '@/features/Audio/CurrentTime';
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

interface DataPNGViewerProps {
  jsonPath: string;
  basePath: string;
  wavFile?: string;
  fftOptions?: FftOption[];
  selectedFftIndex?: number;
  onFftChange?: (index: number) => void;
  onPrevious?: () => void;
  onNext?: () => void;
  hasPrevious?: boolean;
  hasNext?: boolean;
}

const COLORSCALES = [
  'Viridis', 'Hot', 'Jet', 'Portland', 'Picnic', 'Rainbow',
  'Blackbody', 'Earth', 'Electric', 'Greens', 'Blues', 'Greys', 'Greys_r', 'YlGnBu', 'YlOrRd',
];

/**
 * Data PNG Spectrogram Viewer
 *
 * Loads and displays spectrogram data from PNG + JSON format files.
 * Uses the same visualization style as the annotation page.
 */
export const DataPNGViewer: React.FC<DataPNGViewerProps> = ({
  jsonPath,
  basePath,
  wavFile,
  fftOptions = [],
  selectedFftIndex = 0,
  onFftChange,
  onPrevious,
  onNext,
  hasPrevious = false,
  hasNext = false,
}) => {
  const [metadata, setMetadata] = useState<DataPNGMetadata | null>(null);
  const [spectrogramData, setSpectrogramData] = useState<number[][] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Use the global audio context
  const audio = useAudio();

  // Controls
  const [colorscale, setColorscale] = useState('Greys_r');
  const [yAxisScale, setYAxisScale] = useState<'log' | 'linear'>('linear');
  const [zmin, setZmin] = useState<number | null>(null);
  const [zmax, setZmax] = useState<number | null>(null);

  // Load metadata and PNG
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Load JSON metadata
        const jsonUrl = `${basePath}${encodeURIComponent(jsonPath)}`;
        console.log('Fetching metadata from:', jsonUrl);
        const jsonResponse = await fetch(jsonUrl);
        if (!jsonResponse.ok) {
          throw new Error(`Failed to load metadata: ${jsonResponse.status} ${jsonResponse.statusText}`);
        }
        const meta: DataPNGMetadata = await jsonResponse.json();
        setMetadata(meta);

        // Load PNG and decode
        const pngUrl = `${basePath}${encodeURIComponent(meta.png_file)}`;
        console.log('Fetching PNG from:', pngUrl);
        const pngData = await decodePNG(pngUrl, meta);
        setSpectrogramData(pngData);

        // Set initial y-axis scale from metadata
        if (meta.spectrogram.frequency_scale) {
          setYAxisScale(meta.spectrogram.frequency_scale);
        }

        // Reset z-range to use data range
        setZmin(null);
        setZmax(null);

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
      img.crossOrigin = 'anonymous';
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
      img.onerror = () => reject(new Error('Failed to load PNG image'));
      img.src = url;
    });
  };

  // Calculate data range
  const dataRange = useMemo(() => {
    if (!metadata) return { min: -120, max: 0 };
    return { min: metadata.encoding.db_min, max: metadata.encoding.db_max };
  }, [metadata]);

  // Effective z-range
  const effectiveZmin = zmin ?? dataRange.min;
  const effectiveZmax = zmax ?? dataRange.max;

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

    const shapes: any[] = [];

    // Playback indicator line - animated with audio time
    if (audio.time > 0) {
      shapes.push({
        type: 'line',
        x0: audio.time,
        x1: audio.time,
        y0: metadata.spectrogram.frequency_min,
        y1: metadata.spectrogram.frequency_max,
        line: { color: '#ff0000', width: 2 },
        layer: 'above',
      });
    }

    return {
      margin: { l: 70, r: 20, t: 20, b: 50 },
      xaxis: {
        title: { text: 'Time (s)', font: { color: '#aaa' } },
        showgrid: true,
        gridcolor: '#333',
        zeroline: false,
        tickfont: { color: '#aaa' },
        range: [metadata.spectrogram.time_min, metadata.spectrogram.time_max],
        autorange: false,
        constrain: 'domain' as const,
        constraintoward: 'center' as const,
      },
      yaxis: {
        title: { text: 'Frequency (Hz)', font: { color: '#aaa' } },
        showgrid: true,
        gridcolor: '#333',
        zeroline: false,
        tickfont: { color: '#aaa' },
        type: yAxisScale,
        range: yAxisScale === 'log'
          ? [Math.log10(Math.max(1, metadata.spectrogram.frequency_min)), Math.log10(metadata.spectrogram.frequency_max)]
          : [metadata.spectrogram.frequency_min, metadata.spectrogram.frequency_max],
        autorange: false,
        constrain: 'domain' as const,
        constraintoward: 'center' as const,
      },
      shapes,
      hovermode: 'closest' as const,
      plot_bgcolor: '#1a1a1a',
      paper_bgcolor: '#1a1a1a',
      font: { color: '#fff' },
    };
  }, [metadata, yAxisScale, audio.time]);

  const config = useMemo(() => ({
    displayModeBar: true,
    displaylogo: false,
    scrollZoom: true,
    doubleClick: 'reset' as const,
    responsive: true,
    modeBarButtonsToRemove: ['lasso2d', 'select2d'] as any,
  }), []);

  // Click to seek audio
  const handlePlotClick = useCallback((event: any) => {
    if (event?.points?.[0]?.x !== undefined) {
      audio.seek(event.points[0].x as number);
    }
  }, [audio]);

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
          <label>Min: {effectiveZmin.toFixed(0)} dB</label>
          <input
            type="range"
            min={dataRange.min}
            max={dataRange.max}
            step={1}
            value={effectiveZmin}
            onChange={(e) => setZmin(parseFloat(e.target.value))}
          />
        </div>

        <div className={styles.controlGroup}>
          <label>Max: {effectiveZmax.toFixed(0)} dB</label>
          <input
            type="range"
            min={dataRange.min}
            max={dataRange.max}
            step={1}
            value={effectiveZmax}
            onChange={(e) => setZmax(parseFloat(e.target.value))}
          />
        </div>

        <button className={styles.resetButton} onClick={() => { setZmin(null); setZmax(null); }}>
          Reset
        </button>

        <div className={styles.infoText}>
          <span>{metadata.temporal.begin}</span>
        </div>
      </div>

      {/* Spectrogram Plot */}
      <div className={styles.plotArea}>
        <Plot
          data={plotData}
          layout={layout}
          config={config}
          style={{ width: '100%', height: '100%' }}
          onClick={handlePlotClick}
          useResizeHandler
        />
      </div>

      {/* Audio Controls and Navigation - using same components as annotation page */}
      <div className={styles.navigationPanel}>
        <div className={styles.audioControls}>
          <PlayPauseButton />
          <CurrentTime />
          <PlaybackRateSelect />
        </div>

        <div className={styles.navButtons}>
          <button
            disabled={!hasPrevious}
            onClick={onPrevious}
            className={styles.navButton}
          >
            ◀ Previous
          </button>
          <button
            disabled={!hasNext}
            onClick={onNext}
            className={styles.navButton}
          >
            Next ▶
          </button>
        </div>
      </div>
    </div>
  );
};

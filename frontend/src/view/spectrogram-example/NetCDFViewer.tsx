import React, { useEffect, useState, useMemo } from 'react';
import Plot from 'react-plotly.js';
import { IonSpinner } from '@ionic/react';
import styles from './styles.module.scss';

interface NetCDFData {
  spectrogram: number[][];
  time: number[];
  frequency: number[];
  attributes: Record<string, any>;
}

interface NetCDFViewerProps {
  spectrogramPath: string;
}

/**
 * Standalone NetCDF Spectrogram Viewer
 *
 * Loads and displays a NetCDF spectrogram file using Plotly.
 * This is a simplified version for demonstration purposes.
 */
export const NetCDFViewer: React.FC<NetCDFViewerProps> = ({ spectrogramPath }) => {
  const [netcdfData, setNetcdfData] = useState<NetCDFData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Colorscale controls
  const [colorscale, setColorscale] = useState('Jet');
  const [zmin, setZmin] = useState<number>(0);
  const [zmax, setZmax] = useState<number>(100);

  // Load NetCDF data
  useEffect(() => {
    const loadNetCDF = async () => {
      try {
        setLoading(true);

        // Call backend API to parse NetCDF file
        // If spectrogramPath is empty, backend will serve the built-in example
        const url = spectrogramPath
          ? `/api/netcdf/parse/?path=${encodeURIComponent(spectrogramPath)}`
          : `/api/netcdf/parse/`;

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`Failed to load NetCDF: ${response.statusText}`);
        }

        const data = await response.json();
        setNetcdfData(data);
        setLoading(false);
      } catch (e) {
        console.error('Error loading NetCDF:', e);
        setError(e instanceof Error ? e.message : 'Failed to load NetCDF file');
        setLoading(false);
      }
    };

    loadNetCDF();
  }, [spectrogramPath]);

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

  const layout = useMemo(() => ({
    xaxis: {
      title: 'Time (s)',
      showgrid: true,
      zeroline: false,
    },
    yaxis: {
      title: 'Frequency (Hz)',
      showgrid: true,
      zeroline: false,
    },
    margin: { l: 60, r: 100, t: 40, b: 60 },
    autosize: true,
    hovermode: 'closest' as const,
  }), []);

  const config = useMemo(() => ({
    responsive: true,
    displayModeBar: true,
    modeBarButtonsToRemove: ['lasso2d', 'select2d'],
    toImageButtonOptions: {
      format: 'png' as const,
      filename: 'spectrogram',
      scale: 2,
    },
  }), []);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <IonSpinner />
        <p>Loading NetCDF spectrogram...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <h3>Error Loading Spectrogram</h3>
        <p>{error}</p>
        <p className={styles.helpText}>
          Make sure the backend API endpoint for NetCDF parsing is available and
          the spectrogram file exists at: <code>{spectrogramPath}</code>
        </p>
      </div>
    );
  }

  if (!netcdfData) {
    return <div>No spectrogram data available</div>;
  }

  return (
    <div className={styles.plotContainer}>
      <div className={styles.controls}>
        <div className={styles.control}>
          <label>Colorscale:</label>
          <select value={colorscale} onChange={(e) => setColorscale(e.target.value)}>
            <option value="Jet">Jet</option>
            <option value="Viridis">Viridis</option>
            <option value="Hot">Hot</option>
            <option value="Greys">Greys</option>
            <option value="Blues">Blues</option>
          </select>
        </div>
        <div className={styles.control}>
          <label>Min (dB):</label>
          <input
            type="number"
            value={zmin}
            onChange={(e) => setZmin(parseFloat(e.target.value))}
            step="1"
          />
        </div>
        <div className={styles.control}>
          <label>Max (dB):</label>
          <input
            type="number"
            value={zmax}
            onChange={(e) => setZmax(parseFloat(e.target.value))}
            step="1"
          />
        </div>
        <button
          className={styles.resetButton}
          onClick={() => {
            setZmin(dataRange.min);
            setZmax(dataRange.max);
          }}
        >
          Reset Range
        </button>
      </div>

      <div className={styles.plot}>
        <Plot
          data={plotData}
          layout={layout}
          config={config}
          style={{ width: '100%', height: '100%' }}
          useResizeHandler
        />
      </div>

      <div className={styles.info}>
        <p>
          <strong>Time range:</strong> {netcdfData.time[0].toFixed(2)}s - {netcdfData.time[netcdfData.time.length - 1].toFixed(2)}s
        </p>
        <p>
          <strong>Frequency range:</strong> {netcdfData.frequency[0].toFixed(0)}Hz - {netcdfData.frequency[netcdfData.frequency.length - 1].toFixed(0)}Hz
        </p>
        <p>
          <strong>Data range:</strong> {dataRange.min.toFixed(1)}dB - {dataRange.max.toFixed(1)}dB
        </p>
      </div>
    </div>
  );
};

import React from 'react';
import styles from './NetCDFSpectrogram.module.scss';

interface NetCDFControlsProps {
  colorscale: string;
  onColorscaleChange: (colorscale: string) => void;
  zmin: number;
  zmax: number;
  onZminChange: (zmin: number) => void;
  onZmaxChange: (zmax: number) => void;
  dataMin: number;
  dataMax: number;
  yAxisScale: 'linear' | 'log';
  onYAxisScaleChange: (scale: 'linear' | 'log') => void;
}

const COLORSCALES = [
  'Viridis',
  'Hot',
  'Jet',
  'Portland',
  'Picnic',
  'Rainbow',
  'Blackbody',
  'Earth',
  'Electric',
  'Greens',
  'Blues',
  'Greys',
  'YlGnBu',
  'YlOrRd',
];

export const NetCDFControls: React.FC<NetCDFControlsProps> = ({
  colorscale,
  onColorscaleChange,
  zmin,
  zmax,
  onZminChange,
  onZmaxChange,
  dataMin,
  dataMax,
  yAxisScale,
  onYAxisScaleChange,
}) => {
  return (
    <div className={styles.controlsPanel}>
      <div className={styles.controlGroup}>
        <label>Y-Axis Scale</label>
        <div className={styles.buttonGroup}>
          <button
            onClick={() => onYAxisScaleChange('linear')}
            className={yAxisScale === 'linear' ? styles.active : ''}
          >
            Linear
          </button>
          <button
            onClick={() => onYAxisScaleChange('log')}
            className={yAxisScale === 'log' ? styles.active : ''}
          >
            Log
          </button>
        </div>
      </div>

      <div className={styles.controlGroup}>
        <label>Colorscale</label>
        <select value={colorscale} onChange={(e) => onColorscaleChange(e.target.value)}>
          {COLORSCALES.map((scale) => (
            <option key={scale} value={scale}>
              {scale}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.controlGroup}>
        <label>
          Min: {zmin.toFixed(1)} dB
        </label>
        <input
          type="range"
          min={dataMin}
          max={dataMax}
          step={(dataMax - dataMin) / 100}
          value={zmin}
          onChange={(e) => onZminChange(parseFloat(e.target.value))}
        />
      </div>

      <div className={styles.controlGroup}>
        <label>
          Max: {zmax.toFixed(1)} dB
        </label>
        <input
          type="range"
          min={dataMin}
          max={dataMax}
          step={(dataMax - dataMin) / 100}
          value={zmax}
          onChange={(e) => onZmaxChange(parseFloat(e.target.value))}
        />
      </div>

      <div className={styles.controlGroup}>
        <button
          onClick={() => {
            onZminChange(dataMin);
            onZmaxChange(dataMax);
          }}
          className={styles.resetButton}
        >
          Reset Range
        </button>
      </div>
    </div>
  );
};

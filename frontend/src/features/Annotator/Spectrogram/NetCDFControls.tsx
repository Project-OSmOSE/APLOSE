import React from 'react';
import styles from './NetCDFSpectrogram.module.scss';
import { useAppDispatch, useAppSelector } from '@/features/App';
import {
  setFrequencyScaleType,
  selectFrequencyScaleType,
  FrequencyScaleType,
  setPlotlyColorscale,
  selectPlotlyColorscale,
  setPlotlyZmin,
  setPlotlyZmax,
  selectPlotlyZmin,
  selectPlotlyZmax,
  resetPlotlyZRange,
} from '@/features/Annotator/VisualConfiguration';

interface NetCDFControlsProps {
  dataMin: number;
  dataMax: number;
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
  'Greys_r',
  'YlGnBu',
  'YlOrRd',
];

export const NetCDFControls: React.FC<NetCDFControlsProps> = ({
  dataMin,
  dataMax,
}) => {
  const dispatch = useAppDispatch();
  const frequencyScale = useAppSelector(selectFrequencyScaleType);
  const colorscale = useAppSelector(selectPlotlyColorscale);
  const storedZmin = useAppSelector(selectPlotlyZmin);
  const storedZmax = useAppSelector(selectPlotlyZmax);

  // Use stored values if available, otherwise use data range
  const zmin = storedZmin ?? dataMin;
  const zmax = storedZmax ?? dataMax;

  const handleScaleChange = (scale: FrequencyScaleType) => {
    dispatch(setFrequencyScaleType(scale));
  };

  const handleColorscaleChange = (scale: string) => {
    dispatch(setPlotlyColorscale(scale));
  };

  const handleZminChange = (value: number) => {
    dispatch(setPlotlyZmin(value));
  };

  const handleZmaxChange = (value: number) => {
    dispatch(setPlotlyZmax(value));
  };

  const handleResetRange = () => {
    dispatch(resetPlotlyZRange());
  };

  return (
    <div className={styles.controlsPanel}>
      <div className={styles.controlGroup}>
        <label>Y-Axis Scale</label>
        <div className={styles.buttonGroup}>
          <button
            onClick={() => handleScaleChange('linear')}
            className={frequencyScale === 'linear' ? styles.active : ''}
          >
            Linear
          </button>
          <button
            onClick={() => handleScaleChange('log')}
            className={frequencyScale === 'log' ? styles.active : ''}
          >
            Log
          </button>
        </div>
      </div>

      <div className={styles.controlGroup}>
        <label>Colorscale</label>
        <select value={colorscale} onChange={(e) => handleColorscaleChange(e.target.value)}>
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
          onChange={(e) => handleZminChange(parseFloat(e.target.value))}
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
          onChange={(e) => handleZmaxChange(parseFloat(e.target.value))}
        />
      </div>

      <div className={styles.controlGroup}>
        <button
          onClick={handleResetRange}
          className={styles.resetButton}
        >
          Reset Range
        </button>
      </div>
    </div>
  );
};

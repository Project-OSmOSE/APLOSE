import React, { useState, useEffect } from 'react';
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
  setPlotlyFreqMin,
  setPlotlyFreqMax,
  selectPlotlyFreqMin,
  selectPlotlyFreqMax,
  resetPlotlyFreqRange,
} from '@/features/Annotator/VisualConfiguration';

interface NetCDFControlsProps {
  dataMin: number;
  dataMax: number;
  freqMin: number;
  freqMax: number;
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
  freqMin,
  freqMax,
}) => {
  const dispatch = useAppDispatch();
  const frequencyScale = useAppSelector(selectFrequencyScaleType);
  const colorscale = useAppSelector(selectPlotlyColorscale);
  const storedZmin = useAppSelector(selectPlotlyZmin);
  const storedZmax = useAppSelector(selectPlotlyZmax);
  const storedFreqMin = useAppSelector(selectPlotlyFreqMin);
  const storedFreqMax = useAppSelector(selectPlotlyFreqMax);

  // Use stored values if available, otherwise use data range
  const zmin = storedZmin ?? dataMin;
  const zmax = storedZmax ?? dataMax;

  // Local draft state — only pushed to Redux (and thus the plot) on Apply
  const [draftFreqMin, setDraftFreqMin] = useState(() => Math.round(storedFreqMin ?? freqMin));
  const [draftFreqMax, setDraftFreqMax] = useState(() => Math.round(storedFreqMax ?? freqMax));

  // Sync drafts when the underlying data bounds change (new spectrogram loaded)
  useEffect(() => {
    setDraftFreqMin(Math.round(storedFreqMin ?? freqMin));
    setDraftFreqMax(Math.round(storedFreqMax ?? freqMax));
  }, [freqMin, freqMax]); // eslint-disable-line react-hooks/exhaustive-deps

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

  const handleApplyFreqRange = () => {
    const clampedMin = Math.max(Math.round(freqMin), Math.min(draftFreqMin, draftFreqMax));
    const clampedMax = Math.min(Math.round(freqMax), Math.max(draftFreqMin, draftFreqMax));
    dispatch(setPlotlyFreqMin(clampedMin));
    dispatch(setPlotlyFreqMax(clampedMax));
  };

  const handleResetFreqRange = () => {
    setDraftFreqMin(Math.round(freqMin));
    setDraftFreqMax(Math.round(freqMax));
    dispatch(resetPlotlyFreqRange());
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

      <div className={styles.controlGroup}>
        <label>Freq Min (Hz)</label>
        <input
          type="number"
          min={Math.round(freqMin)}
          max={Math.round(freqMax)}
          step={1}
          value={draftFreqMin}
          onChange={(e) => setDraftFreqMin(parseInt(e.target.value, 10))}
        />
      </div>

      <div className={styles.controlGroup}>
        <label>Freq Max (Hz)</label>
        <input
          type="number"
          min={Math.round(freqMin)}
          max={Math.round(freqMax)}
          step={1}
          value={draftFreqMax}
          onChange={(e) => setDraftFreqMax(parseInt(e.target.value, 10))}
        />
      </div>

      <div className={styles.controlGroup}>
        <button onClick={handleApplyFreqRange} className={styles.resetButton}>
          Apply
        </button>
        <button onClick={handleResetFreqRange} className={styles.resetButton}>
          Reset Freq
        </button>
      </div>
    </div>
  );
};

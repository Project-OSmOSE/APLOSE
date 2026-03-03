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

  // Local draft state — only pushed to Redux (and thus the plot) on Apply
  const [draftZmin, setDraftZmin] = useState(() => storedZmin ?? dataMin);
  const [draftZmax, setDraftZmax] = useState(() => storedZmax ?? dataMax);
  const [draftFreqMin, setDraftFreqMin] = useState(() => Math.round(storedFreqMin ?? freqMin));
  const [draftFreqMax, setDraftFreqMax] = useState(() => Math.round(storedFreqMax ?? freqMax));

  // Sync dB drafts when data range changes (new spectrogram)
  useEffect(() => {
    setDraftZmin(storedZmin ?? dataMin);
    setDraftZmax(storedZmax ?? dataMax);
  }, [dataMin, dataMax]); // eslint-disable-line react-hooks/exhaustive-deps

  // Sync freq drafts when data bounds change (new spectrogram loaded)
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

  const handleApplyZRange = () => {
    dispatch(setPlotlyZmin(draftZmin));
    dispatch(setPlotlyZmax(draftZmax));
  };

  const handleResetRange = () => {
    setDraftZmin(dataMin);
    setDraftZmax(dataMax);
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
        <label>Min: {draftZmin.toFixed(1)} dB</label>
        <input
          type="range"
          min={dataMin}
          max={dataMax}
          step={(dataMax - dataMin) / 100}
          value={draftZmin}
          onChange={(e) => setDraftZmin(parseFloat(e.target.value))}
        />
      </div>

      <div className={styles.controlGroup}>
        <label>Max: {draftZmax.toFixed(1)} dB</label>
        <input
          type="range"
          min={dataMin}
          max={dataMax}
          step={(dataMax - dataMin) / 100}
          value={draftZmax}
          onChange={(e) => setDraftZmax(parseFloat(e.target.value))}
        />
      </div>

      <div className={styles.controlGroup}>
        <button onClick={handleApplyZRange} className={styles.resetButton}>
          Apply dB
        </button>
        <button onClick={handleResetRange} className={styles.resetButton}>
          Reset dB
        </button>
      </div>

      <div className={styles.controlGroup}>
        <label>Freq Min: {draftFreqMin} Hz</label>
        <input
          type="range"
          min={Math.round(freqMin)}
          max={Math.round(freqMax)}
          step={1}
          value={draftFreqMin}
          onChange={(e) => setDraftFreqMin(parseInt(e.target.value, 10))}
        />
      </div>

      <div className={styles.controlGroup}>
        <label>Freq Max: {draftFreqMax} Hz</label>
        <input
          type="range"
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

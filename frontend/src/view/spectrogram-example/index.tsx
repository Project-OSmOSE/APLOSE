import React from 'react';
import styles from './styles.module.scss';
import { NetCDFViewer } from './NetCDFViewer';

/**
 * Spectrogram Example Page
 *
 * Displays a static NetCDF spectrogram file for demonstration and testing purposes.
 * Uses a standalone NetCDF viewer with Plotly for interactive visualization.
 */
export const SpectrogramExamplePage: React.FC = () => {
  // Use the static example spectrogram included in the Docker image
  // No path needed - the backend will serve the built-in example by default
  const spectrogramPath = '';

  return (
    <div className={ styles.pageContainer }>
      <div className={ styles.exampleContainer }>

        <div className={ styles.header }>
          <h1>NetCDF Spectrogram Example</h1>
          <p>Interactive Plotly visualization of a synthetic spectrogram</p>
          <p className={ styles.note }>
            <strong>Note:</strong> This demonstrates NetCDF file visualization with a built-in example.
            The spectrogram contains synthetic whale-like calls, chirps, and pulses.
            For real data visualization, create an annotation campaign and import a dataset.
          </p>
        </div>

        <div className={ styles.spectrogramContainer }>
          <NetCDFViewer spectrogramPath={spectrogramPath} />
        </div>

      </div>
    </div>
  );
}

export default SpectrogramExamplePage;

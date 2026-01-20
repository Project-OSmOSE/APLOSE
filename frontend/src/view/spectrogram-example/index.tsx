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
  // Path to example NetCDF file (relative to backend datawork directory)
  const spectrogramPath = '/opt/datawork/dataset/netcdf_example/processed/netcdf_analysis/spectrogram/2024_01_01_00_00_00_000000.nc';

  return (
    <div className={ styles.pageContainer }>
      <div className={ styles.exampleContainer }>

        <div className={ styles.header }>
          <h1>NetCDF Spectrogram Example</h1>
          <p>Interactive Plotly visualization of a NetCDF spectrogram file</p>
          <p className={ styles.note }>
            <strong>Note:</strong> This is a demonstration page showing NetCDF file visualization.
            For full annotation capabilities, create an annotation campaign and import the
            {' '}<code>netcdf_example</code> dataset.
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

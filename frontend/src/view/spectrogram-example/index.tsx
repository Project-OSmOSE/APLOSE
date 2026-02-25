import React, { useState, useEffect, useCallback } from 'react';
import { IonSpinner } from '@ionic/react';
import styles from './styles.module.scss';
import { DataPNGViewer } from './DataPNGViewer';
import { NetCDFViewer } from './NetCDFViewer';

interface ExampleFile {
  json: string;
  png: string | null;
  wav: string | null;
  timestamp: string;
}

interface ExampleFilesResponse {
  files: ExampleFile[];
  basePath: string;
  message?: string;
}

/**
 * Spectrogram Example Page
 *
 * Displays spectrogram files from the example dataset folder.
 * Supports both PNG/JSON format (new) and NetCDF format (legacy).
 */
export const SpectrogramExamplePage: React.FC = () => {
  const [files, setFiles] = useState<ExampleFile[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [basePath, setBasePath] = useState('');
  const [useNetCDF, setUseNetCDF] = useState(false);

  // Fetch file list on mount
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/netcdf/list-example-files/');
        if (!response.ok) {
          throw new Error('Failed to fetch file list');
        }
        const data: ExampleFilesResponse = await response.json();

        if (data.files.length === 0) {
          // No files, show NetCDF example instead
          setUseNetCDF(true);
        } else {
          setFiles(data.files);
          setBasePath('/api/netcdf/example-file');
        }
        setLoading(false);
      } catch (e) {
        console.error('Error fetching files:', e);
        // Fall back to NetCDF example
        setUseNetCDF(true);
        setLoading(false);
      }
    };

    fetchFiles();
  }, []);

  // Navigation handlers
  const handlePrevious = useCallback(() => {
    if (selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
    }
  }, [selectedIndex]);

  const handleNext = useCallback(() => {
    if (selectedIndex < files.length - 1) {
      setSelectedIndex(selectedIndex + 1);
    }
  }, [selectedIndex, files.length]);

  // File selection handler
  const handleFileSelect = useCallback((index: number) => {
    setSelectedIndex(index);
  }, []);

  if (loading) {
    return (
      <div className={styles.pageContainer}>
        <div className={styles.loadingContainer}>
          <IonSpinner />
          <p>Loading spectrograms...</p>
        </div>
      </div>
    );
  }

  // Show NetCDF example if no PNG/JSON files available
  if (useNetCDF) {
    return (
      <div className={styles.pageContainer}>
        <div className={styles.exampleContainer}>
          <div className={styles.header}>
            <h1>NetCDF Spectrogram Example</h1>
            <p>Interactive Plotly visualization of a synthetic spectrogram</p>
            <p className={styles.note}>
              <strong>Note:</strong> No PNG/JSON files found in the example folder.
              Showing built-in NetCDF example. Place your spectrogram files in{' '}
              <code>volumes/datawork/dataset/example/</code> to view them here.
            </p>
          </div>
          <div className={styles.spectrogramContainer}>
            <NetCDFViewer spectrogramPath="" />
          </div>
        </div>
      </div>
    );
  }

  const selectedFile = files[selectedIndex];

  return (
    <div className={styles.pageContainer}>
      <div className={styles.viewerContainer}>
        {/* File Selector */}
        <div className={styles.fileSelector}>
          {files.map((file, index) => (
            <button
              key={file.json}
              onClick={() => handleFileSelect(index)}
              className={`${styles.fileButton} ${index === selectedIndex ? styles.active : ''}`}
            >
              {file.timestamp || file.json.replace('.json', '')}
            </button>
          ))}
        </div>

        {/* DataPNG Viewer */}
        {selectedFile && (
          <DataPNGViewer
            jsonPath={selectedFile.json}
            basePath={basePath}
            onPrevious={handlePrevious}
            onNext={handleNext}
            hasPrevious={selectedIndex > 0}
            hasNext={selectedIndex < files.length - 1}
          />
        )}
      </div>
    </div>
  );
}

export default SpectrogramExamplePage;

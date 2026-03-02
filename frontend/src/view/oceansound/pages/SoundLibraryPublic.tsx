import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { IonSpinner } from '@ionic/react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from '../styles.module.scss';
import { SoundLibraryViewer } from '@/view/sound-library/SoundLibraryViewer';

interface Analysis {
  fft: number;
  json: string;
  png: string | null;
}

interface SoundFile {
  prefix: string;
  filename: string;
  baseName: string;
  analyses: Analysis[];
}

interface SoundLibraryResponse {
  files: SoundFile[];
  basePath: string;
  message?: string;
}

/**
 * Public Sound Library Page
 *
 * Displays sound library thumbnails publicly.
 * Clicking a thumbnail opens the full spectrogram viewer directly.
 */
export const SoundLibraryPublic: React.FC = () => {
  const [files, setFiles] = useState<SoundFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [basePath, setBasePath] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [selectedFftIndex, setSelectedFftIndex] = useState(0);

  const { fileIndex } = useParams<{ fileIndex?: string }>();
  const navigate = useNavigate();

  // Parse selected file index from URL
  const selectedFileIndex = fileIndex !== undefined ? parseInt(fileIndex, 10) : null;
  const selectedFile = selectedFileIndex !== null && !isNaN(selectedFileIndex) ? files[selectedFileIndex] : null;
  const selectedAnalysis = selectedFile?.analyses[selectedFftIndex];

  // Reset FFT index when file changes
  useEffect(() => {
    setSelectedFftIndex(0);
  }, [selectedFileIndex]);

  // Navigate to file view
  const handleCardClick = (index: number) => {
    navigate(`/oceansound/sounds/${index}`);
  };

  // Navigate back to thumbnails
  const handleBack = () => {
    navigate('/oceansound/sounds');
  };

  // Fetch file list on mount
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('/api/netcdf/list-sound-library/');
        if (!response.ok) {
          throw new Error('Failed to fetch sound library');
        }
        const data: SoundLibraryResponse = await response.json();

        if (!data.files || data.files.length === 0) {
          setError(data.message || 'No sounds available yet');
        } else {
          setFiles(data.files);
          setBasePath(data.basePath);
        }
        setLoading(false);
      } catch (e) {
        console.error('Error fetching sound library:', e);
        setError('Sound library is currently unavailable');
        setLoading(false);
      }
    };

    fetchFiles();
  }, []);

  // Get thumbnail URL for a file
  const getThumbnailUrl = useCallback((file: SoundFile) => {
    const firstAnalysis = file.analyses[0];
    if (firstAnalysis?.json) {
      const pngFilename = firstAnalysis.json.replace(/\.json$/, '.png');
      return `${basePath}${encodeURIComponent(pngFilename)}`;
    }
    return null;
  }, [basePath]);

  // FFT options for dropdown
  const fftOptions = useMemo(() => {
    if (!selectedFile) return [];
    return selectedFile.analyses.map((a, idx) => ({
      value: idx,
      label: `nfft: ${a.fft}`,
      fft: a.fft,
    }));
  }, [selectedFile]);

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.loadingContainer}>
          <IonSpinner />
          <p>Loading sound library...</p>
        </div>
      </div>
    );
  }

  // Show full spectrogram viewer when a file is selected via URL
  if (selectedFile && selectedAnalysis && files.length > 0) {
    return (
      <div className={styles.spectrogramViewerPage}>
        <SoundLibraryViewer
          jsonPath={selectedAnalysis.json}
          basePath={basePath}
          wavFile={selectedFile.filename}
          fftOptions={fftOptions}
          selectedFftIndex={selectedFftIndex}
          onFftChange={setSelectedFftIndex}
          onBack={handleBack}
          fileSelector={
            <select
              value={selectedFileIndex ?? ''}
              onChange={(e) => navigate(`/oceansound/sounds/${e.target.value}`)}
              className={styles.fileDropdown}
            >
              {files.map((file, idx) => (
                <option key={file.filename || file.baseName} value={idx}>
                  {file.prefix}
                </option>
              ))}
            </select>
          }
        />
      </div>
    );
  }

  // Show thumbnail grid
  return (
    <div className={styles.page}>
      <h1>Sound Library</h1>
      <p className={styles.pageIntro}>
        Browse our collection of marine acoustic recordings. Click any spectrogram to explore it in detail.
      </p>

      {error ? (
        <div className={styles.emptyState}>
          <p>{error}</p>
          <p>Check back later for new sounds.</p>
        </div>
      ) : (
        <div className={styles.soundGrid}>
          {files.map((file, index) => {
            const thumbnailUrl = getThumbnailUrl(file);
            return (
              <div
                key={file.filename || file.baseName}
                className={styles.soundCard}
                onClick={() => handleCardClick(index)}
                style={{ cursor: 'pointer' }}
              >
                <div className={styles.soundThumbnail}>
                  {thumbnailUrl ? (
                    <img src={thumbnailUrl} alt={file.prefix} />
                  ) : (
                    <div className={styles.noImage}>No preview</div>
                  )}
                </div>
                <div className={styles.soundInfo}>
                  <h3>{file.prefix}</h3>
                  <p className={styles.analysisCount}>
                    {file.analyses.length} analysis{file.analyses.length !== 1 ? 'es' : ''}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

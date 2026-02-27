import React, { useState, useEffect, useCallback } from 'react';
import { IonSpinner } from '@ionic/react';
import { Link } from 'react-router-dom';
import styles from '../styles.module.scss';

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
 * Users can browse sounds but need to log in for full functionality.
 */
export const SoundLibraryPublic: React.FC = () => {
  const [files, setFiles] = useState<SoundFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [basePath, setBasePath] = useState('');
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div className={styles.page}>
      <h1>Sound Library</h1>
      <p className={styles.pageIntro}>
        Browse our collection of marine acoustic recordings. Each spectrogram represents
        a unique underwater sound captured through passive acoustic monitoring.
      </p>

      {error ? (
        <div className={styles.emptyState}>
          <p>{error}</p>
          <p>Check back later for new sounds.</p>
        </div>
      ) : (
        <>
          <div className={styles.soundGrid}>
            {files.map((file) => {
              const thumbnailUrl = getThumbnailUrl(file);
              return (
                <div key={file.filename || file.baseName} className={styles.soundCard}>
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

          <div className={styles.ctaSection}>
            <p>
              Want to explore these sounds in detail or contribute annotations?
            </p>
            <Link to="/app/login" className={styles.ctaButton}>
              Log in to APLOSE
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

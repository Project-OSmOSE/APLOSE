/**
 * Utility functions for decoding data PNG spectrograms.
 *
 * Data PNGs are 16-bit grayscale images that store normalized spectrogram values.
 * They come with a JSON sidecar file containing metadata for reconstruction.
 */

export interface DataPngMetadata {
  format_version: number;
  png_file: string;
  encoding: {
    bit_depth: number;
    db_min: number;
    db_max: number;
    description: string;
  };
  spectrogram: {
    shape: [number, number]; // [n_frequencies, n_times]
    frequency_min: number;
    frequency_max: number;
    time_min: number;
    time_max: number;
    n_frequencies: number;
    n_times: number;
  };
  audio: {
    sample_rate: number;
    duration: number;
    filename: string;
  };
  analysis: {
    nfft: number;
    hop_length: number;
    window: string;
    normalize_audio: boolean;
  };
  calibration: {
    db_fullscale: number | null;
    db_ref: number | null;
  };
  temporal: {
    begin: string;
    end: string;
  };
}

export interface DecodedSpectrogramData {
  spectrogram: number[][];
  time: number[];
  frequency: number[];
  attributes: {
    begin: string;
    end: string;
    sample_rate: number;
    nfft: number;
    hop_length: number;
    window: string;
    duration: number;
    audio_file: string;
    normalize_audio: boolean;
    db_fullscale?: number;
    db_ref?: number;
  };
  shape: [number, number];
  downsampling: {
    time_step: number;
    freq_step: number;
  };
}

/**
 * Decode a 16-bit grayscale PNG image from an ArrayBuffer.
 * Returns a 2D array of values in range [0, 65535].
 */
export async function decode16BitPng(pngArrayBuffer: ArrayBuffer): Promise<{
  data: Uint16Array;
  width: number;
  height: number;
}> {
  // Create a blob from the array buffer and load as image
  const blob = new Blob([pngArrayBuffer], { type: 'image/png' });
  const imageUrl = URL.createObjectURL(blob);

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      // Create canvas to read pixel data
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        URL.revokeObjectURL(imageUrl);
        reject(new Error('Failed to get canvas context'));
        return;
      }

      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, img.width, img.height);

      // For 16-bit PNG, the browser converts to 8-bit RGBA.
      // We need to reconstruct 16-bit values from the image.
      // This is a limitation - browsers don't natively support 16-bit PNG reading.
      // For production use, consider using a library like pngjs or sending raw data from server.

      // As a workaround, we'll read the 8-bit values and scale up
      // This loses precision but provides a working implementation
      const width = img.width;
      const height = img.height;
      const data = new Uint16Array(width * height);

      for (let i = 0; i < width * height; i++) {
        // Use red channel (grayscale images have same value in R, G, B)
        const pixelValue = imageData.data[i * 4];
        // Scale from 0-255 to 0-65535
        data[i] = Math.round(pixelValue * 257);
      }

      URL.revokeObjectURL(imageUrl);
      resolve({ data, width, height });
    };

    img.onerror = () => {
      URL.revokeObjectURL(imageUrl);
      reject(new Error('Failed to load PNG image'));
    };

    img.src = imageUrl;
  });
}

/**
 * Convert normalized pixel values back to dB values.
 */
export function pixelsToDb(
  pixelData: Uint16Array,
  dbMin: number,
  dbMax: number
): Float32Array {
  const dbRange = dbMax - dbMin;
  const result = new Float32Array(pixelData.length);

  for (let i = 0; i < pixelData.length; i++) {
    // Normalize from 0-65535 to 0-1, then scale to dB range
    result[i] = (pixelData[i] / 65535) * dbRange + dbMin;
  }

  return result;
}

/**
 * Generate frequency array based on metadata.
 */
export function generateFrequencyArray(metadata: DataPngMetadata): number[] {
  const { n_frequencies, frequency_min, frequency_max } = metadata.spectrogram;
  const frequencies = new Array(n_frequencies);
  const step = (frequency_max - frequency_min) / (n_frequencies - 1);

  for (let i = 0; i < n_frequencies; i++) {
    frequencies[i] = frequency_min + i * step;
  }

  return frequencies;
}

/**
 * Generate time array based on metadata.
 */
export function generateTimeArray(metadata: DataPngMetadata): number[] {
  const { n_times, time_min, time_max } = metadata.spectrogram;
  const times = new Array(n_times);
  const step = (time_max - time_min) / (n_times - 1);

  for (let i = 0; i < n_times; i++) {
    times[i] = time_min + i * step;
  }

  return times;
}

/**
 * Decode data PNG and JSON metadata into the format expected by NetCDFSpectrogram.
 */
export async function decodeDataPng(
  pngArrayBuffer: ArrayBuffer,
  metadata: DataPngMetadata
): Promise<DecodedSpectrogramData> {
  // Decode the PNG
  const { data: pixelData, width, height } = await decode16BitPng(pngArrayBuffer);

  // Convert pixels to dB values
  const dbValues = pixelsToDb(
    pixelData,
    metadata.encoding.db_min,
    metadata.encoding.db_max
  );

  // Reshape to 2D array (height x width = frequencies x times)
  // Note: PNG is stored with low frequencies at bottom, so we need to flip vertically
  const spectrogram: number[][] = [];
  for (let f = 0; f < height; f++) {
    const row: number[] = [];
    // Read from bottom to top (flip vertical)
    const srcRow = height - 1 - f;
    for (let t = 0; t < width; t++) {
      row.push(dbValues[srcRow * width + t]);
    }
    spectrogram.push(row);
  }

  // Generate time and frequency arrays
  const time = generateTimeArray(metadata);
  const frequency = generateFrequencyArray(metadata);

  return {
    spectrogram,
    time,
    frequency,
    attributes: {
      begin: metadata.temporal.begin,
      end: metadata.temporal.end,
      sample_rate: metadata.audio.sample_rate,
      nfft: metadata.analysis.nfft,
      hop_length: metadata.analysis.hop_length,
      window: metadata.analysis.window,
      duration: Math.ceil(metadata.audio.duration),
      audio_file: metadata.audio.filename,
      normalize_audio: metadata.analysis.normalize_audio,
      ...(metadata.calibration.db_fullscale !== null && {
        db_fullscale: metadata.calibration.db_fullscale
      }),
      ...(metadata.calibration.db_ref !== null && {
        db_ref: metadata.calibration.db_ref
      }),
    },
    shape: metadata.spectrogram.shape,
    downsampling: {
      time_step: 1,
      freq_step: 1,
    },
  };
}

/**
 * Load and decode data PNG from URLs.
 */
export async function loadDataPngFromUrls(
  pngUrl: string,
  jsonUrl: string
): Promise<DecodedSpectrogramData> {
  // Fetch both files in parallel
  const [pngResponse, jsonResponse] = await Promise.all([
    fetch(pngUrl),
    fetch(jsonUrl),
  ]);

  if (!pngResponse.ok) {
    throw new Error(`Failed to load PNG: ${pngResponse.status}`);
  }
  if (!jsonResponse.ok) {
    throw new Error(`Failed to load JSON: ${jsonResponse.status}`);
  }

  const [pngBuffer, metadata] = await Promise.all([
    pngResponse.arrayBuffer(),
    jsonResponse.json() as Promise<DataPngMetadata>,
  ]);

  return decodeDataPng(pngBuffer, metadata);
}

import type { FftNode } from '../../../src/api';

export type FFT = Omit<FftNode, 'spectrogramAnalysis'>
export const fft: FFT = {
  id: '1',
  samplingFrequency: 480,
  overlap: 0.50,
  nfft: 2048,
  windowSize: 2048,
  legacy: true,
}

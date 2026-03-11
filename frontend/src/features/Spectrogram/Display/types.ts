import type { FftNode } from '@/api';

export type SpectrogramMode = 'wav' | 'png' | 'npz'

export type ZoomMode = 'processed' | 'numeric'

export type FFT = Pick<FftNode, 'nfft' | 'overlap' | 'windowSize'>

import type { FftNode } from '@/api';

export type SpectrogramMode = 'wav' | 'png' | 'npz' | 'png-numeric-zoom'

export type FFT = Pick<FftNode, 'nfft' | 'overlap' | 'windowSize'>

export type SpectrogramOptions = {
    zoom: number,
    tile: number,
    mode?: SpectrogramMode,
} & Partial<FFT>

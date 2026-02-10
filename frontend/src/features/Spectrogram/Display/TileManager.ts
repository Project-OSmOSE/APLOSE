import type { FFT, SpectrogramMode, SpectrogramOptions } from './types';
import { SpectrogramDimensions } from '@/features/Spectrogram/Display/dimension.hook';
import { AnnotationSpectrogramNode, SpectrogramAnalysisNode } from '@/api';

export type TileManagerOptions = {
    spectrogram: Pick<AnnotationSpectrogramNode, 'id' | 'filename' | 'path'>,
    analysis: Pick<SpectrogramAnalysisNode, 'id' | 'legacy'>,
    mode: SpectrogramMode,
    fft?: Partial<FFT>,
}

export class TileManager {

    private readonly PRELOAD_MARGIN = 1;

    private controller = new AbortController();

    private loadingTileIndexes: number[] = [];
    private loadedTileIndexes: number[] = [];

    private static currentManager: TileManager | undefined;

    public static getManager(canvas: HTMLCanvasElement, options: TileManagerOptions, zoom: number, left: number): TileManager {
        if (!this.currentManager?.optionsEquals(options) || this.currentManager?.canvas !== canvas) {
            if (this.currentManager) this.currentManager.controller.abort('Options changed');
            this.currentManager = new TileManager(canvas, options, zoom, left);
        }
        return this.currentManager
    }

    private get tileHeight(): number {
        return this.canvas.height
    }

    private get tileWidth(): number {
        return this.canvas.height * SpectrogramDimensions.width / SpectrogramDimensions.height
    }

    private _zoom: number = 0;
    public set zoom(value: number) {
        if (this._zoom === value) return;
        this.controller.abort('Zoom changed')
        this.loadingTileIndexes = [];
        this.loadedTileIndexes = [];
        this._zoom = Math.max(0, value);
        this.controller = new AbortController();
        this.update()
    }

    private _left: number = 0;
    public set left(value: number) {
        if (this._left === value) return;
        this._left = Math.min(Math.max(0, value), this.canvas.width);
        this.update()
    }

    private get tilesCount(): number {
        return Math.pow(2, this._zoom)
    }

    protected constructor(private readonly canvas: HTMLCanvasElement,
                          private readonly options: TileManagerOptions,
                          zoom: number,
                          left: number) {
        console.debug('new TileManager called', options, zoom, left);
        const context = this.canvas.getContext('2d');
        context?.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this._zoom = zoom;
        this._left = left;
        this.update()
    }

    private optionsEquals(options: TileManagerOptions): boolean {
        return this.options.analysis.id === options.analysis.id &&
            this.options.spectrogram.id === options.spectrogram.id &&
            this.options.mode === options.mode &&
            this.options.fft?.nfft === options.fft?.nfft &&
            this.options.fft?.windowSize === options.fft?.windowSize &&
            this.options.fft?.overlap === options.fft?.overlap;
    }

    private getUrl(index: number): string {
        switch (this.options.mode) {
            case 'png':
                if (this.options.analysis.legacy) {
                    const p = this.options.spectrogram.path
                    const f = this.options.spectrogram.filename
                    return `${ p.split(f)[0] }${ f }_${ this._zoom }_${ index }${ p.split(f)[1] }`
                } else return this.options.spectrogram.path
            default:
                return `/api/data/analysis/${ this.options.analysis.id }/spectrogram/${ this.options.spectrogram.id }/?${
                    Object.entries({
                        ...(this.options.fft ?? {}),
                        mode: this.options.mode,
                        zoom: this._zoom,
                        tile: index,
                    } satisfies SpectrogramOptions).map(kv => kv.map(encodeURIComponent).join('=')).join('&')
                }`
        }
    }

    private async update(): Promise<void> {
        const startTileIdx = Math.floor(this._left / SpectrogramDimensions.width);
        const endTileIdx = Math.ceil((this._left + SpectrogramDimensions.width) / SpectrogramDimensions.width);

        const visible = Array.from(
            { length: endTileIdx - startTileIdx + 1 },
            (_, i) => Math.min(startTileIdx + i, this.tilesCount - 1),
        );

        const min = Math.min(...visible);
        const max = Math.max(...visible);
        const preloaded = [
            Math.max(0, min - this.PRELOAD_MARGIN),
            Math.min(this.tilesCount - 1, max + this.PRELOAD_MARGIN),
        ].filter(index => !visible.includes(index))

        const newTiles = [...visible, ...preloaded].filter(index => !this.loadedTileIndexes.includes(index) && !this.loadingTileIndexes.includes(index));
        this.loadingTileIndexes = [...new Set([...this.loadingTileIndexes, ...newTiles])];
        await this.loadTiles(newTiles)
    }

    private async loadTiles(indexes: number[]): Promise<void> {
        for (const index of indexes) {
            await this.loadTile(index)
        }
    }

    private async loadTile(index: number): Promise<void> {
        if (this.loadedTileIndexes.some(i => i === index)) return;
        if (index < 0 || index >= this.tilesCount) return;
        try {
            const tile = await this.fetchTile(index)
            this.displayTile(tile, index)
        } catch (error) {
            console.error(`Failed to load tile ${ this._zoom }-${ index }:`, error);
            throw error;
        }
    }

    private async fetchTile(index: number): Promise<HTMLImageElement> {
        const response = await fetch(
            this.getUrl(index),
            { signal: this.controller.signal },
        )

        if (response.status !== 200) throw new Error(response.statusText)

        const blob = await response.blob()
        const objectURL = URL.createObjectURL(blob)

        const img = new Image();
        const loadPromise = new Promise((resolve, reject) => {
            img.onload = () => resolve(img);
            img.onerror = reject;
        });
        img.src = objectURL;
        await loadPromise;
        this.loadedTileIndexes.push(index)
        return img;

    }

    private displayTile(image: HTMLImageElement, index: number) {
        const context = this.canvas.getContext('2d', { alpha: false });
        if (!context) return;
        context.drawImage(
            image,
            index * this.tileWidth,
            0,
            this.tileWidth,
            this.tileHeight,
        )
    }

}

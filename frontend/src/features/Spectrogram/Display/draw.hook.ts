import { MutableRefObject, useCallback, useEffect, useState } from 'react';
import { SpectrogramDimensions, useSpectrogramDimensions } from './dimension.hook.ts';

const PRELOAD_MARGIN = 1
type TileKey = `${ number }_${ number }` // [zoomLevel]_[index]

export const useSpectrogramTiles = ({
                                      canvasRef,
                                      zoomLevel,
                                      getUrl,
                                    }: {
  canvasRef: MutableRefObject<HTMLCanvasElement | null>,
  zoomLevel: number,
  getUrl: (zoomLevel: number, index: number) => string
}) => {
  const { width, height } = useSpectrogramDimensions(0)

  const [ loadedTiles, setLoadedTiles ] = useState<Map<TileKey, HTMLImageElement>>(new Map());
  const [ preloadedTiles, setPreloadedTiles ] = useState<Set<TileKey>>(new Set());
  const [ visibleTiles, setVisibleTiles ] = useState<Set<TileKey>>(new Set());

  useEffect(() => {

  }, [ canvasRef.current, preloadedTiles, visibleTiles, canvasRef.current?.scrollLeft ]);

  /**
   * Update tiles sets
   */
  useEffect(() => {
    if (!canvasRef.current) return;
    const viewportX = canvasRef.current.scrollLeft
    const viewportWidth = canvasRef.current.width;
    const tilesPerZoom = Math.pow(2, zoomLevel);
    const startTileIdx = Math.floor(viewportX / SpectrogramDimensions.width);
    const endTileIdx = Math.ceil((viewportX + viewportWidth) / SpectrogramDimensions.width);

    const visible = Array.from(
      { length: endTileIdx - startTileIdx + 1 },
      (_, i) => Math.min(startTileIdx + i, tilesPerZoom - 1),
    );

    const min = Math.min(...visible);
    const max = Math.max(...visible);
    const preloaded = [
      Math.max(0, min - PRELOAD_MARGIN),
      Math.min(tilesPerZoom - 1, max + PRELOAD_MARGIN),
    ].filter(index => !visible.includes(index))

    console.log(visible, preloaded, startTileIdx, tilesPerZoom, zoomLevel)

    setVisibleTiles(new Set(visible.map(index => `${ zoomLevel }_${ index }` as TileKey)));
    setPreloadedTiles(new Set(preloaded.map(index => `${ zoomLevel }_${ index }` as TileKey)));
  }, [ canvasRef.current, zoomLevel, canvasRef.current?.scrollLeft ]);

  /**
   * Actually load and display tiles
   */
  useEffect(() => {
    if (!canvasRef.current) return;
    loadTiles().catch(console.warn)
  }, [ visibleTiles, preloadedTiles ]);

  const display = useCallback((index: number, image: HTMLImageElement) => {
    const context = canvasRef.current?.getContext('2d', { alpha: false });
    if (!context) return;
    context.drawImage(
      image,
      index * width,
      0,
      width,
      height,
    )
  }, [ canvasRef.current, width, height ])

  const loadTile = useCallback(async (key: TileKey) => {
    const [ zoom, index ] = key.split('_')
    const url = getUrl(+zoom, +index);

    const img = new Image();
    const loadPromise = new Promise((resolve, reject) => {
      img.onload = () => resolve(img);
      img.onerror = reject;
    });

    img.src = url;
    console.debug('url:', url)

    try {
      await loadPromise;
      setLoadedTiles(prev => {
        prev.set(key, img)
        return prev
      })
      display(+index, img)
      return img;
    } catch (error) {
      console.error(`Failed to load tile ${ key }:`, error);
      throw error;
    }
  }, [ getUrl, display ])

  const loadTiles = useCallback(async () => {

    // Priority 1: Visible tiles
    let promises = [];
    for (const key of visibleTiles) {
      if (!loadedTiles.has(key)) {
        promises.push(loadTile(key));
      }
    }
    await Promise.allSettled(promises);

    // Priority 2: Adjacent tiles for smooth panning
    promises = [];
    for (const key of preloadedTiles) {
      if (!loadedTiles.has(key)) {
        promises.push(loadTile(key));
      }
    }
    await Promise.allSettled(promises);

    // Clean distant tiles
    const displayedKeys = [ ...visibleTiles, ...preloadedTiles ];
    setLoadedTiles(prev => {
      for (const key of prev.keys()) {
        if (!displayedKeys.includes(key)) {
          prev.delete(key);
          // Let garbage collector handle the Image object
        }
      }
      return prev
    });
  }, [ visibleTiles, preloadedTiles, loadedTiles, loadTile ])

}

import { useMemo } from 'react';

export const useWindowRatio = () => {
    return useMemo(() => window.devicePixelRatio * (1920 / (window.screen.width * window.devicePixelRatio)), [])
}

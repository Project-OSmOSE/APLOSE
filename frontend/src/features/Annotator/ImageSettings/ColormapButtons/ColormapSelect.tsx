import React, { Fragment } from 'react';
import { useImageSettingsContext } from '../Root'
import { ColormapComponent } from '@/features/Colormap';

export const ColormapSelect: React.FC = () => {
    const {
        allowColormapChange,
        colormap,
        setColormap,
        isColormapInverted,
    } = useImageSettingsContext()

    if (!allowColormapChange) return <Fragment/>
    return <ColormapComponent.Select value={ colormap }
                                     onValueChange={ setColormap }
                                     inverted={ isColormapInverted }/>
}
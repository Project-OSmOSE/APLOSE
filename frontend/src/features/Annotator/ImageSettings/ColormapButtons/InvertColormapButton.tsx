import React, { createElement, Fragment, useCallback, useMemo } from 'react';
import { useImageSettingsContext } from '../Root'
import { MirrorLeft, MirrorRight } from '@solar-icons/react';
import { Button } from '@/components/base';

export const InvertColormapButton: React.FC = () => {
    const {
        allowColormapChange,
        isColormapInverted,
        setIsColormapInverted,
    } = useImageSettingsContext()

    const invert = useCallback(() => {
        setIsColormapInverted(prev => !prev)
    }, [ setIsColormapInverted ])

    const icon = useMemo(() => {
        return createElement(isColormapInverted ? MirrorRight : MirrorLeft, { weight: 'Bold', size: 20 })
    }, [ isColormapInverted ])

    if (!allowColormapChange) return <Fragment/>
    return <Button color="dark"
                   onClick={ invert }
                   children={ icon }/>
}
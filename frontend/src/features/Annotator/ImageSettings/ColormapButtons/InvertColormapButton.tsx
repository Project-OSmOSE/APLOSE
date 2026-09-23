import React, { createElement, Fragment, useCallback, useMemo } from 'react';
import { useImageSettingsContext } from '../Root'
import { MirrorLeftBoldIcon, MirrorRightBoldIcon } from '@solar-icons/react';
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
        return createElement(isColormapInverted ? MirrorRightBoldIcon : MirrorLeftBoldIcon, { size: 20 })
    }, [ isColormapInverted ])

    if (!allowColormapChange) return <Fragment/>
    return <Button color="dark"
                   onClick={ invert }
                   children={ icon }/>
}
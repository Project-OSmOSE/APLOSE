import React, { Fragment } from 'react';
import { useImageSettingsContext } from '../Root';
import { InvertColormapButton } from './InvertColormapButton';
import { ColormapSelect } from './ColormapSelect';
import { ButtonGroup } from '@/components/base';

export const ColormapButtons: React.FC = () => {
    const { allowColormapChange } = useImageSettingsContext()

    if (!allowColormapChange) return <Fragment/>
    return <ButtonGroup smallGap>
        <InvertColormapButton/>
        <ColormapSelect/>
    </ButtonGroup>
}

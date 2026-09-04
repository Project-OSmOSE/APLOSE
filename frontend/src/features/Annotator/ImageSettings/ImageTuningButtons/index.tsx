import React, { Fragment } from 'react';
import { useImageSettingsContext } from '../Root';
import { BrightnessControl } from './BrightnessControl';
import { ContrastControl } from './ContrastControl';
import { ButtonGroup } from '@/components/base';

export const ImageTuningButtons: React.FC = () => {
    const { allowImageTuning } = useImageSettingsContext()

    if (!allowImageTuning) return <Fragment/>
    return <ButtonGroup smallGap>
        <BrightnessControl/>
        <ContrastControl/>
    </ButtonGroup>
}

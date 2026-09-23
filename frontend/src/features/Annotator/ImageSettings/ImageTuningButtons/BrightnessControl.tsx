import React, { Fragment } from 'react';
import { useImageSettingsContext } from '../Root'
import { Button, Popover, Slider } from '@/components/base';
import { RestartLinearIcon, SunLinearIcon } from '@solar-icons/react';
import styles from '@/features/Annotator/styles.module.scss';

export const BrightnessControl: React.FC = () => {
    const {
        allowImageTuning,
        brightness,
        setBrightness,
        resetBrightness,
    } = useImageSettingsContext()

    if (!allowImageTuning) return <Fragment/>
    return <Popover.Root>
        <Popover.Trigger delay={ 0 } color="dark">
            <SunLinearIcon size={ 20 }/>
        </Popover.Trigger>
        <Popover.Content className={ styles.VerticalItem }>
            <Slider orientation="vertical"
                    label="Brightness"
                    value={ brightness }
                    onValueChange={ setBrightness }
                    onDoubleClick={ resetBrightness }/>
            <Button onClick={ resetBrightness }>
                <RestartLinearIcon size={ 20 }/>
            </Button>
        </Popover.Content>
    </Popover.Root>
}
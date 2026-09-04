import React, { Fragment } from 'react';
import { useImageSettingsContext } from '../Root'
import { Button, Popover, Slider } from '@/components/base';
import { Restart, Stop } from '@solar-icons/react';
import styles from '@/features/Annotator/styles.module.scss';

export const ContrastControl: React.FC = () => {
    const {
        allowImageTuning,
        contrast,
        setContrast,
        resetContrast,
    } = useImageSettingsContext()

    if (!allowImageTuning) return <Fragment/>
    return <Popover.Root>
        <Popover.Trigger delay={ 0 } color="dark">
            <Stop weight="BoldDuotone" size={ 20 }/>
        </Popover.Trigger>
        <Popover.Content className={ styles.VerticalItem }>
            <Slider orientation="vertical"
                    label="Contrast"
                    value={ contrast }
                    onValueChange={ setContrast }
                    onDoubleClick={ resetContrast }/>
            <Button onClick={ resetContrast }>
                <Restart weight="Linear" size={ 20 }/>
            </Button>
        </Popover.Content>
    </Popover.Root>
}
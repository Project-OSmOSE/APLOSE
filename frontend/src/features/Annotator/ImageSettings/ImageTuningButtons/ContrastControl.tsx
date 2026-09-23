import React, { Fragment } from 'react';
import { RestartLinearIcon, StopBoldDuotoneIcon } from '@solar-icons/react';
import { useImageSettingsContext } from '../Root'
import { Button, Popover, Slider } from '@/components/base';
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
            <StopBoldDuotoneIcon size={ 20 }/>
        </Popover.Trigger>
        <Popover.Content className={ styles.VerticalItem }>
            <Slider orientation="vertical"
                    label="Contrast"
                    value={ contrast }
                    onValueChange={ setContrast }
                    onDoubleClick={ resetContrast }/>
            <Button onClick={ resetContrast }>
                <RestartLinearIcon size={ 20 }/>
            </Button>
        </Popover.Content>
    </Popover.Root>
}
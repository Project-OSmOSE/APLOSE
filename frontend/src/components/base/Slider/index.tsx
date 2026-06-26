import React from 'react';
import { Slider as BaseSlider, SliderRootProps as BaseProps } from '@base-ui/react/slider';
import styles from './Slider.module.scss'
import type { BaseColor } from '@/components/base/types';
import { Note } from '@/components/base';

export type SliderProps = Omit<BaseProps<number>, 'thumbAlignment' | 'children'> & {
    color?: BaseColor
    label?: string
    displayValue?: boolean
}
export const Slider: React.FC<SliderProps> = ({
                                                  label,
                                                  displayValue,
                                                  className,
                                                  onDoubleClick,
                                                  ...props
                                              }) => (
    <BaseSlider.Root className={ [ styles.Root, className ].join(' ') }
                     thumbAlignment="edge"
                     { ...props }>
        { label && <BaseSlider.Label render={ (props) => <Note color="medium" { ...props }/> }
                                     className={ styles.Label }
                                     children={ label }/> }
        { displayValue && <BaseSlider.Value className={ styles.Value }/> }
        <BaseSlider.Control onDoubleClick={ onDoubleClick } className={ styles.Control }>
            <BaseSlider.Track className={ styles.Track }>
                <BaseSlider.Indicator className={ styles.Indicator }/>
                <BaseSlider.Thumb className={ [ styles.Thumb, className ].join(' ') }/>
            </BaseSlider.Track>
        </BaseSlider.Control>
    </BaseSlider.Root>
)

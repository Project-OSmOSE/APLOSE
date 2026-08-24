import React, { useCallback } from 'react';
import { Note, Select as BaseSelect, SelectProps as BaseSelectProps } from '@/components/base'
import { type Colormap, COLORMAP_LIST, COLORMAPS, type ColorStep } from '../const';
import styles from './Colormap.module.scss'

export type SelectProps =
    Omit<BaseSelectProps<Colormap, false>, 'items' | 'itemName' | 'itemToStringValue' | 'itemToElementLabel'>
    & { inverted?: boolean };
export const Select: React.FC<SelectProps> = ({ inverted, ...props }) => {

    const itemToGradient = useCallback((item: Colormap) => {
        const steps: string[] = COLORMAPS[item]
            .map((step: ColorStep) => `rgb(${ step.rgb.join(',') }) ${ step.index * 100 }%`)
        return <div className={ styles.Colormap }
                    style={ { background: `linear-gradient(to ${ inverted ? 'left' : 'right' }, ${ steps.join(', ') })` } }/>
    }, [ inverted ])

    const itemToElementLabel = useCallback((item: Colormap) => (
        <div className={ styles.SelectItem }>
            { itemToGradient(item) }
            <Note>{ item }</Note>
        </div>
    ), [ itemToGradient ])

    return (
        <BaseSelect itemName="colormap"
                    defaultValue="Greys"
                    items={ COLORMAP_LIST }
                    itemToStringValue={ item => item }
                    itemToElementLabel={ itemToElementLabel }
                    valueItemToElementLabel={ itemToGradient }
                    { ...props }/>
    )
}
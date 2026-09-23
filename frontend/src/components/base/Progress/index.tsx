import React, { Fragment, useMemo } from 'react';
import { Progress as BaseProgress, ProgressRootProps } from '@base-ui/react/progress'
import type { BaseColor } from '@/components/base/types';
import { Note, type NoteProps } from '@/components/base';
import styles from './Progress.module.scss'
import { CheckCircleBoldDuotoneIcon, LoaderLineDuotoneIcon } from '@solar-icons/react';

export type ProgressProps = Pick<ProgressRootProps, 'value' | 'max' | 'children'> & {
    color?: BaseColor,
    disabled?: boolean
}
export const Progress: React.FC<ProgressProps> = ({ children, max, ...props }) => (
    <BaseProgress.Root className={ styles.Progress } max={ max } { ...props }>
        { children && <BaseProgress.Label className={ styles.Label }>{ children }</BaseProgress.Label> }
        <BaseProgress.Value className={ styles.Value }>
            { (formattedValue, value) =>
                max === 0 ? '-' :
                    max ? `${ value } / ${ max }` : formattedValue
            }
        </BaseProgress.Value>
        { max !== 0 && <BaseProgress.Track className={ styles.Track }>
            <BaseProgress.Indicator className={ styles.Indicator }/>
        </BaseProgress.Track> }
    </BaseProgress.Root>
)

export const ProgressNote: React.FC<Omit<NoteProps, 'className' | 'children'> & Pick<ProgressRootProps, 'value'>> = ({
                                                                                                                         value,
                                                                                                                         ...props
                                                                                                                     }) => {

    const icon = useMemo(() => {
        if (!value) return <Fragment/>
        if (value === 100) return <CheckCircleBoldDuotoneIcon size={ 20 } className={ styles.Icon }/>
        return <LoaderLineDuotoneIcon size={ 20 } className={ styles.Icon }/>
    }, [ value ])

    return <Note className={ styles.ProgressNote } { ...props }>
        <span>{ value ? Math.trunc(value) : 0 }%</span>
        { icon }
    </Note>
}
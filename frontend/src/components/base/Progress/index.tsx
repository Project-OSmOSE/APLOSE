import React from 'react';
import { Progress as BaseProgress, ProgressRootProps } from '@base-ui/react/progress'
import styles from './Progress.module.scss'
import type { BaseColor } from '@/components/base/types';

export type ProgressProps = Pick<ProgressRootProps, 'value' | 'max' | 'children'> & { color?: BaseColor, disabled?: boolean }
export const Progress: React.FC<ProgressProps> = ({ children, max, ...props }) => (
    <BaseProgress.Root className={ styles.Progress } max={ max } { ...props }>
        <BaseProgress.Label className={ styles.Label }>{ children }</BaseProgress.Label>
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
import React from 'react';
import { Combobox, type ComboboxChipProps as BaseComboboxChipProps } from '@base-ui/react/combobox';
import { Chip as BaseChip, ChipRemove as BaseChipRemove } from '@/components/base/Chip'

export type ComboboxChipProps = Omit<BaseComboboxChipProps, 'style' | 'className'>

export const Chip: React.FC<ComboboxChipProps> = ({ children, 'aria-label': ariaLabel, ...props }) => (
    <Combobox.Chip aria-label={ ariaLabel } { ...props }>
        <BaseChip color="primary">
            { children }
            <Combobox.ChipRemove render={ <BaseChipRemove/> }
                                 nativeButton={ false }
                                 aria-label={ `Remove ${ ariaLabel }` }/>
        </BaseChip>
    </Combobox.Chip>
)

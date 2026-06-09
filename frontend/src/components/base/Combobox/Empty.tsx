import React from 'react';
import { Combobox, type ComboboxEmptyProps as BaseComboboxEmptyProps } from '@base-ui/react/combobox';
import { Note } from '@/components/base/Note';

export type ComboboxEmptyProps = Omit<BaseComboboxEmptyProps, 'style' | 'className' | 'color'>

export const Empty: React.FC<ComboboxEmptyProps> = ({ children, ...props }) => (
    <Combobox.Empty { ...props } >
        <Note color="medium" children={ children }/>
    </Combobox.Empty>
)

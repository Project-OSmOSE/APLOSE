import React from 'react';
import { Combobox, Spinner } from '@/components/base';
import { BaseComboboxSelectProps } from './types';
import comboboxStyles from '@/components/base/Combobox/Combobox.module.scss';

type MultipleInputGroupProps<Value> =
    Pick<BaseComboboxSelectProps<Value, true>, 'id' | 'itemName' | 'placeholder' | 'name' | 'disabled' | 'readOnly'>
    & Required<Pick<BaseComboboxSelectProps<Value, true>, 'itemToElementLabel'>>
    & { className?: string, loading?: boolean }

export function MultipleInputGroup<Value>({
                                              id,
                                              itemName,
                                              itemToElementLabel,
                                              className,
                                              placeholder,
                                              loading,
                                              name,
                                              disabled,
                                              readOnly,
                                          }: MultipleInputGroupProps<Value>) {
    return <Combobox.InputGroup className={ className }>
        <Combobox.Chips>
            <Combobox.Value>
                { (value: Value[]) => (
                    <React.Fragment>
                        <div className={ comboboxStyles.InputGroup }>
                            <Combobox.Input id={ id } name={ name }
                                            placeholder={ placeholder || value.length > 0 ? '' : `Select ${ itemName }` }/>

                            { loading && <Spinner size={ 16 } className={ comboboxStyles.Spinner }/> }
                            { !disabled && !readOnly && <Combobox.Clear/> }
                            { !readOnly && <Combobox.Trigger/> }
                        </div>
                        { value.map((item, index) => (
                            <Combobox.Chip key={ index }>{ itemToElementLabel(item) }</Combobox.Chip>
                        )) }
                    </React.Fragment>
                ) }
            </Combobox.Value>
        </Combobox.Chips>
    </Combobox.InputGroup>
}
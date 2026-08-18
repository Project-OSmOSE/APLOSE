import { Fragment } from 'react';
import { Combobox } from '@/components/base';
import { BaseComboboxSelectProps } from './types';

type MultipleInputGroupProps<Value> = Pick<BaseComboboxSelectProps<Value, true>, 'id' | 'itemName'>
    & Required<Pick<BaseComboboxSelectProps<Value, true>, 'itemToElementLabel'>>
    & { className?: string }

export function MultipleInputGroup<Value>({
                                              id,
                                              itemName,
                                              itemToElementLabel,
                                              className,
                                          }: MultipleInputGroupProps<Value>) {
    return <Combobox.InputGroup className={ className }>
        <Combobox.Chips>
            <Combobox.Value>
                { (value: Value[]) => (
                    <Fragment>
                        <Combobox.Input id={ id }
                                        placeholder={ value.length > 0 ? '' : `Select ${ itemName }` }/>
                        { value.map((item, index) => (
                            <Combobox.Chip key={ index }>{ itemToElementLabel(item) }</Combobox.Chip>
                        )) }
                    </Fragment>
                ) }
            </Combobox.Value>
        </Combobox.Chips>
    </Combobox.InputGroup>
}
import { Combobox, Spinner } from '@/components/base';
import { BaseComboboxSelectProps } from './types'
import styles from '@/components/base/Combobox/Combobox.module.scss';

type SingleInputGroupProps<Value> =
    Pick<BaseComboboxSelectProps<Value, false>, 'id' | 'placeholder' | 'loading' | 'disabled' | 'readOnly' | 'itemName'>
    & Required<Pick<BaseComboboxSelectProps<Value, false>, 'itemToElementLabel'>> & { className?: string }

export function SingleInputGroup<Value>({
                                            id,
                                            placeholder,
                                            itemName,
                                            itemToElementLabel,
                                            disabled,
                                            readOnly,
                                            loading,
                                            className,
                                        }: SingleInputGroupProps<Value>) {

    return <Combobox.InputGroup className={ className }>
        <Combobox.Input placeholder={ placeholder ? placeholder : `Select ${ itemName }` }
                        id={ id }/>
        { loading && <Spinner size={ 16 } className={ styles.Spinner }/> }
        { !disabled && !readOnly && <Combobox.Clear/> }
        { !readOnly && <Combobox.Trigger/> }
        <span className={ styles.Value }><Combobox.Value children={ itemToElementLabel }/></span>
    </Combobox.InputGroup>
}
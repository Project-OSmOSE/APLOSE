import React, { HTMLProps, useCallback } from 'react';
import { IonNote } from '@ionic/react';
import styles from './form.module.scss'
import { Label } from './Label';


type SelectProperties = {
  options: Array<string>;
  value: string;
  label?: string;
  required?: boolean;
  onValueSelected: (value: string) => void;
  error?: string;
} & Omit<HTMLProps<HTMLDivElement>, 'id' | 'ref'>

export const Switch: React.FC<SelectProperties> = ({
                                                     label,
                                                     required = false,
                                                     options,
                                                     value,
                                                     onValueSelected,
                                                     disabled,
                                                     className,
                                                     error,
                                                     ...props
                                                   }) => {

  return <div id="aplose-input"
              aria-disabled={ disabled }
              className={ [ styles.default, styles.switch, className, label ? styles.hasLabel : '' ].join(' ') } { ...props }>
    <Label required={ required } label={ label }/>

    <div className={ styles.switchContainer } style={ {
      gridTemplateColumns: `repeat(${ options.length }, 1fr)`,
    } }>
      { options.map(o => <div key={ o }
                              onClick={ () => {
                                if (disabled) return;
                                onValueSelected(o);
                              } }
                              className={ [ styles.switchItem, value === o ? styles.selected : '' ].join(' ') }>
        { o }</div>) }
      <div className={ styles.switchSelect } style={ {
        width: `${ 100 / options.length }%`,
        left: `${ options.indexOf(value) * 100 / options.length }%`,
      } }/>
    </div>

    { error && <IonNote color="danger">{ error }</IonNote> }
  </div>
}


const BOOLEAN_OPTIONS = [ 'Unset', 'With', 'Without' ]
type BooleanOption = typeof BOOLEAN_OPTIONS[number];

export const BooleanSwitch: React.FC<Omit<SelectProperties, 'options' | 'value' | 'onValueSelected'> & {
  value?: boolean | null,
  onValueSelected: (value?: boolean) => void;
}> = ({ value, onValueSelected, ...props }) => {

  const booleanOptionToValue = useCallback((option: BooleanOption, reversed?: true): boolean | undefined => {
    switch (option) {
      case 'With':
        return !reversed;
      case 'Without':
        return !!reversed;
      case 'Unset':
        return undefined;
    }
  }, [])

  const valueToBooleanOption = useCallback((value?: boolean | null, reversed?: true): BooleanOption => {
    switch (value) {
      case true:
        return reversed ? 'Without' : 'With';
      case false:
        return reversed ? 'With' : 'Without';
      default:
        return 'Unset';
    }
  }, [])

  return <Switch { ...props }
                 options={ BOOLEAN_OPTIONS }
                 value={ valueToBooleanOption(value) }
                 onValueSelected={ value => onValueSelected(booleanOptionToValue(value)) }/>
}


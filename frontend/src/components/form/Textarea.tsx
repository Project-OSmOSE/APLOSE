import React, { TextareaHTMLAttributes } from 'react';
import { IonNote } from '@ionic/react';
import { useAppDispatch } from '@/features/App';
import { EventSlice } from '@/features/UX/Events';
import styles from './form.module.scss'
import { Label } from './Label';


export type OldTextareaProperties = {
  label?: string;
  error?: string;
  'data-testid'?: string;
  containerClassName?: string;
} & TextareaHTMLAttributes<HTMLTextAreaElement>


export const Textarea: React.FC<OldTextareaProperties> = ({
                                                            label,
                                                            disabled,
                                                            value,
                                                            error,
                                                            required,
                                                            containerClassName,
                                                            ['data-testid']: testId,
                                                            ...textareaArgs
                                                          }) => {

  const dispatch = useAppDispatch();

  return <div id="aplose-input" className={ [ styles.default, 'textarea', containerClassName ].join(' ') }
              aria-disabled={ disabled } aria-invalid={ !!error }>
    <Label required={ required } label={ label }/>

    <div className={ styles.input }>
      <textarea { ...textareaArgs }
                value={ value }
                data-testid={ testId }
                disabled={ disabled }
                onFocus={ () => dispatch(EventSlice.actions.disableShortcuts()) }
                onBlur={ () => dispatch(EventSlice.actions.enableShortcuts()) }
                required={ required }/>
    </div>
    { error && <IonNote color="danger">{ error }</IonNote> }
  </div>
}

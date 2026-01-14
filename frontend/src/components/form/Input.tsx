import React, { Fragment, HTMLInputTypeAttribute, InputHTMLAttributes, useCallback, useMemo, useState } from 'react';
import { IonIcon, IonNote } from '@ionic/react';
import { eyeOffOutline, eyeOutline } from 'ionicons/icons/index.js';
import { useAppDispatch } from '@/features/App';
import { EventSlice } from '@/features/UX/Events';
import styles from './form.module.scss'
import { Label } from './Label';

type InputProperties = {
  label?: string;
  startIcon?: string;
  note?: string;
  error?: string;
  'data-testid'?: string;
} & InputHTMLAttributes<HTMLInputElement>
export const Input: React.FC<InputProperties> = ({
                                                   label,
                                                   startIcon,
                                                   note,
                                                   error,
                                                   required,
                                                   disabled,
                                                   type: _type,

                                                   onFocus,
                                                   onBlur,
                                                   ['data-testid']: testId,
                                                   ...inputArgs
                                                 }) => {

  const className = useMemo(() => {
    const className = [];
    if (startIcon) className.push(styles.hasStartIcon);
    if (_type === 'password') className.push(styles.hasEndIcon);
    return className
  }, [ startIcon, _type ])
  const [ type, setType ] = useState<HTMLInputTypeAttribute | undefined>(_type);
  const dispatch = useAppDispatch();

  const toggleType = useCallback(() => {
    if (_type !== 'password') return;
    if (type === 'password') setType('text');
    else setType('password');
  }, [ _type, type ])

  return <div id="aplose-input"
              data-testid="input-container"
              className={ `${ styles.default } ${ _type === 'checkbox' ? styles.inline : '' }` }
              aria-disabled={ disabled }
              aria-invalid={ !!error }>
    <Label required={ required } label={ label }/>

    <div className={ styles.input }>
      { startIcon && <IonIcon className={ styles.startIcon }
                              data-testid="input-icon"
                              icon={ startIcon }/> }
      <input { ...inputArgs }
             id={ label }
             data-testid={ testId ?? 'input' }
             type={ type }
             required={ required }
             disabled={ disabled }
             onFocus={ e => {
               dispatch(EventSlice.actions.disableShortcuts())
               if (onFocus) onFocus(e)
             } }
             onBlur={ e => {
               dispatch(EventSlice.actions.enableShortcuts())
               if (onBlur) onBlur(e)
             } }
             className={ `${ className.join(' ') } ${ inputArgs.className }` }/>

      { _type === 'password' && <Fragment>
        { type === 'password' && <IonIcon data-testid="input-pwd-icon" className={ styles.endIcon } icon={ eyeOutline }
                                          onClick={ toggleType }/> }
        { type === 'text' && <IonIcon data-testid="input-txt-icon" className={ styles.endIcon } icon={ eyeOffOutline }
                                      onClick={ toggleType }/> }
      </Fragment> }
    </div>

    { note && <IonNote data-testid="input-note">{ note }</IonNote> }
    { error && <IonNote data-testid="input-error" color="danger">{ error }</IonNote> }
  </div>
}

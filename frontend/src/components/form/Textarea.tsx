import React, { TextareaHTMLAttributes } from 'react';
import styles from './form.module.scss'
import { Label } from './Label';
import { Note } from '@/components/base/Note';
import { useEvent } from '@/components/ui/Event';


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
    const { enableShortcuts, disableShortcuts } = useEvent()

    return <div id="aplose-input" className={ [ styles.default, 'textarea', containerClassName ].join(' ') }
                aria-disabled={ disabled } aria-invalid={ !!error }>
        <Label required={ required } label={ label }/>

        <div className={ styles.input }>
      <textarea { ...textareaArgs }
                value={ value }
                data-testid={ testId }
                disabled={ disabled }
                onFocus={ disableShortcuts }
                onBlur={ enableShortcuts }
                required={ required }/>
        </div>
        { error && <Note color="danger">{ error }</Note> }
    </div>
}

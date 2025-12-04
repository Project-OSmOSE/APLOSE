import React, { type FormEvent, KeyboardEvent, useCallback } from 'react';
import { IonSearchbar } from '@ionic/react';

export const Searchbar: React.FC<{
  search?: string;
  onInput?(search?: string): void;
  onChange?(search?: string): void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}> = ({ search, onChange, onInput, placeholder, className, disabled }) => {

  const doSearch = useCallback((event: KeyboardEvent<HTMLIonSearchbarElement>) => {
    if (!onChange) return;
    if (event.key === 'Enter') {
      const search = event.currentTarget.value?.trim()
      if (search && search.length > 0)
        onChange(search)
      else onChange(undefined)
    }
  }, [ onChange ])

  const _onInput = useCallback((event: FormEvent<HTMLIonSearchbarElement>) => {
    if (!onInput) return;
    const search = event.currentTarget.value?.trim()
    if (search && search.length > 0)
      onInput(search)
    else onInput(undefined)
  }, [ onInput ])

  const clearSearch = useCallback(() => {
    if (onChange) onChange(undefined)
    if (onInput) onInput(undefined)
  }, [ onChange, onInput ])

  return <IonSearchbar placeholder={ placeholder }
                       disabled={ disabled }
                       className={ className }
                       onKeyDown={ doSearch }
                       onInput={ _onInput }
                       onIonClear={ clearSearch }
                       value={ search }/>
}
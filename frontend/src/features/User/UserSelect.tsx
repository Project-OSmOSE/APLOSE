import { Item, Select } from '@/components/form';
import React, { useCallback, useMemo } from 'react';
import { Maybe, UserNode } from '@/api';

type User = Pick<UserNode, 'id' | 'displayName'>

export const UserSelect: React.FC<{
  label?: string;
  placeholder: string;
  options: Maybe<User>[],
  value?: User,
  valueID?: string,
  onSelected: (user?: User) => void,
  isLoading?: boolean
}> = ({ label, placeholder, options: _options, value, valueID, onSelected, isLoading }) => {

  const options: Item[] = useMemo(() => _options.filter(d => d !== null).map(d => ({
    label: d!.displayName,
    value: d!.id,
  })), [ _options ]);

  const setUser = useCallback((id: number | string | undefined) => {
    onSelected(_options.find(d => d?.id == id) ?? undefined)
  }, [ onSelected, _options ])

  return <Select label={ label ?? 'User' }
                 placeholder={ placeholder }
                 optionsContainer="popover"
                 options={ options }
                 value={ value?.id ?? valueID }
                 onValueSelected={ setUser }
                 isLoading={ isLoading }/>
}
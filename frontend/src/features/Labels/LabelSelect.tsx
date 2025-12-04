import React, { useCallback, useMemo } from 'react';
import { Item, Select } from '@/components/form';
import { AnnotationLabelNode, Maybe } from '@/api';

type Label = Pick<AnnotationLabelNode, 'name'>;

export const LabelSelect: React.FC<{
  placeholder: string;
  options: Maybe<Label>[]
  value?: Label,
  valueName?: string,
  onSelected: (label?: Label) => void
  isLoading?: boolean;
}> = ({ placeholder, options: _options, value, valueName, onSelected, isLoading }) => {

  const options: Item[] = useMemo(() => _options.filter(l => l !== null).map(l => ({
    label: l!.name,
    value: l!.name,
  })), [ _options ]);

  const setLabel = useCallback((name: number | string | undefined) => {
    onSelected(_options.find(l => l?.name == name) ?? undefined)
  }, [ onSelected, _options ])

  return <Select label="Label"
                 placeholder={ placeholder }
                 optionsContainer="popover"
                 options={ options }
                 value={ value?.name ?? valueName }
                 isLoading={ isLoading }
                 onValueSelected={ setLabel }/>
}
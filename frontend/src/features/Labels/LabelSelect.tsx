import React, { useCallback, useMemo } from 'react';
import { Item, Select, type SelectProperties } from '@/components/form';
import { AnnotationLabelNode, Maybe } from '@/api';

type Label = Pick<AnnotationLabelNode, 'name'>;

export const LabelSelect: React.FC<{
  options: Maybe<Label>[]
  value?: Label,
  valueName?: string,
  onSelected: (label?: Label) => void
} & Omit<SelectProperties, 'optionsContainer' | 'onValueSelected' | 'options'>> = ({
                                                     options: _options,
                                                     value,
                                                     valueName,
                                                     onSelected,
                                                     ...params
                                                   }) => {

  const options: Item[] = useMemo(() => _options.filter(l => l !== null).map(l => ({
    label: l!.name,
    value: l!.name,
  })), [ _options ]);

  const setLabel = useCallback((name: number | string | undefined) => {
    onSelected(_options.find(l => l?.name == name) ?? undefined)
  }, [ onSelected, _options ])

  return <Select label="Label"
                 optionsContainer="popover"
                 options={ options }
                 value={ value?.name ?? valueName }
                 noneLabel="All"
                 onValueSelected={ setLabel }
                 { ...params }/>
}
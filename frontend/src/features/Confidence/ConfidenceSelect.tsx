import { Item, Select } from '@/components/form';
import React, { useCallback, useMemo } from 'react';
import { ConfidenceNode, Maybe } from '@/api';

type Confidence = Pick<ConfidenceNode, 'label'>

export const ConfidenceSelect: React.FC<{
  placeholder: string;
  options: Maybe<Confidence>[],
  value?: Confidence,
  valueLabel?: string,
  onSelected: (confidence?: Confidence) => void
}> = ({ placeholder, options: _options, value, valueLabel, onSelected }) => {

  const options: Item[] = useMemo(() => _options.filter(c => c !== null).map(c => ({
    label: c!.label,
    value: c!.label,
  })), [ _options ]);

  const setConfidence = useCallback((label: number | string | undefined) => {
    onSelected(_options.find(c => c?.label == label) ?? undefined)
  }, [ onSelected, _options ])

  return <Select label="Confidence"
                 placeholder={ placeholder }
                 optionsContainer="popover"
                 options={ options }
                 noneLabel='All'
                 value={ value?.label ?? valueLabel }
                 onValueSelected={ setConfidence }/>
}
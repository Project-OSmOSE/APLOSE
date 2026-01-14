import { Item, Select } from '@/components/form';
import React, { useCallback, useMemo } from 'react';
import { DetectorNode, Maybe } from '@/api';

type detector = Pick<DetectorNode, 'id' | 'name'>

export const DetectorSelect: React.FC<{
  placeholder: string;
  options: Maybe<detector>[],
  value?: detector,
  valueID?: string,
  onSelected: (detector?: detector) => void,
  isLoading?: boolean
}> = ({ placeholder, options: _options, value, valueID, onSelected, isLoading }) => {

  const options: Item[] = useMemo(() => _options.filter(d => d !== null).map(d => ({
    label: d!.name,
    value: d!.id,
  })), [ _options ]);

  const setDetector = useCallback((id: number | string | undefined) => {
    onSelected(_options.find(d => d?.id == id) ?? undefined)
  }, [ onSelected, _options ])

  return <Select label="Detector"
                 placeholder={ placeholder }
                 optionsContainer="popover"
                 options={ options }
                 value={ value?.id ?? valueID }
                 onValueSelected={ setDetector }
                 isLoading={ isLoading }/>
}
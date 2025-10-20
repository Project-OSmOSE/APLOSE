import React, { Fragment, useCallback, useMemo } from 'react';
import { IonNote } from '@ionic/react';
import { Select } from '@/components/form';
import { WarningText } from '@/components/ui';
import { useAllConfidenceSets } from '@/api';

export const ConfidenceSetSelect: React.FC<{
  placeholder: string;
  selected?: string;
  onSelected: (labelSet?: string) => void;
  error?: string;
}> = ({
        placeholder,
        selected: selectedID,
        onSelected,
        error,
      }) => {
  const { allConfidenceSets, isFetching, error: fetchingError } = useAllConfidenceSets()
  const selected = useMemo(() => allConfidenceSets?.find(s => s!.id === selectedID), [ allConfidenceSets, selectedID ]);
  const selectedIndicators = useMemo(() => selected?.confidenceIndicators?.filter(r => r !== null), [ selected ]);

  const select = useCallback((pk: string | number | undefined) => {
    if (typeof pk === 'number') pk = pk.toString()
    onSelected(pk)
  }, [ onSelected ])

  if (fetchingError) return <WarningText message="Failing loading confidence sets"
                                         error={ fetchingError }/>

  if (!allConfidenceSets) return <Fragment/>
  return <Select label="Confidence indicator set" placeholder={ placeholder }
                 options={ allConfidenceSets.map(s => ({ value: s!.id, label: s!.name })) ?? [] }
                 optionsContainer="alert"
                 disabled={ !allConfidenceSets.length }
                 value={ selectedID }
                 isLoading={ isFetching }
                 error={ error }
                 onValueSelected={ select }>
    { selected && (
      <Fragment>
        { selected.desc && selected.desc.split('\r\n').map(d => <p key={ d }>{ d }</p>) }
        { selectedIndicators?.map(i => (
          <p key={ i!.label }><b>{ i!.level }:</b> { i!.label }</p>
        )) }
      </Fragment>)
    }
    { allConfidenceSets.length === 0 &&
        <IonNote>You need to create a confidence set to use it in your campaign</IonNote> }
  </Select>
}
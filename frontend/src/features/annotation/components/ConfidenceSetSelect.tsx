import React, { Fragment, useCallback, useMemo } from "react";
import { IonNote } from "@ionic/react";
import { getErrorMessage } from "@/service/function.ts";
import { Select } from "@/components/form";
import { WarningText } from "@/components/ui";
import { useLabelsAndConfidenceSets } from '../api'

export const ConfidenceSetSelect: React.FC<{
  placeholder: string;
  selected?: number;
  onSelected: (labelSet?: number) => void;
  error?: string;
}> = ({
        placeholder,
        selected: selectedPk,
        onSelected,
        error,
      }) => {
  const { confidenceSets, isFetching, error: fetchingError } = useLabelsAndConfidenceSets()
  const selected = useMemo(() => confidenceSets?.find(s => s.pk === selectedPk), [ confidenceSets, selectedPk ]);
  const selectedIndicators = useMemo(() => selected?.confidenceIndicators?.results.filter(r => r !== null), [ selected ]);

  const select = useCallback((pk: string | number | undefined) => {
    if (typeof pk === 'string') pk = +pk
    if (!pk || isNaN(pk) || pk === 0) pk = undefined
    onSelected(pk)
  }, [ onSelected ])

  if (fetchingError) return <WarningText>Fail loading confidence sets:<br/>{ getErrorMessage(fetchingError) }
  </WarningText>

  if (!confidenceSets) return <Fragment/>
  return <Select label="Confidence indicator set" placeholder={ placeholder }
                 options={ confidenceSets?.map(s => ({ value: s.pk, label: s.name })) ?? [] }
                 optionsContainer="alert"
                 disabled={ !confidenceSets?.length }
                 value={ selectedPk }
                 isLoading={ isFetching }
                 error={ error }
                 onValueSelected={ select }>
    { selected && (
      <Fragment>
        { selected.desc && selected.desc.split('\r\n').map(d => <p key={ d }>{ d }</p>) }
        { selectedIndicators?.map(i => (
          <p key={ i.label }><b>{ i.level }:</b> { i.label }</p>
        )) }
      </Fragment>)
    }
    { confidenceSets.length === 0 &&
        <IonNote>You need to create a confidence set to use it in your campaign</IonNote> }
  </Select>
}
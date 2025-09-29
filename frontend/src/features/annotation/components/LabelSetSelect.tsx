import React, { Fragment, useCallback, useMemo } from "react";
import { IonNote } from "@ionic/react";
import { getErrorMessage } from "@/service/function.ts";
import { Select } from "@/components/form";
import { WarningText } from "@/components/ui";
import { useLabelsAndConfidenceSets } from '../api'
import { LabelSetFeaturesSelect } from "./LabelSetFeaturesSelect";

export const LabelSetSelect: React.FC<{
  placeholder: string;
  selected?: number;
  onSelected: (labelSet?: number) => void;
  labelsWithAcousticFeatures: string[];
  setLabelsWithAcousticFeatures: (labels: string[]) => void;
  error?: string;
}> = ({
        placeholder,
        selected: selectedPk,
        onSelected,
        error,
        labelsWithAcousticFeatures,
        setLabelsWithAcousticFeatures
      }) => {
  const { labelSets, isFetching, error: fetchingError } = useLabelsAndConfidenceSets()
  const selected = useMemo(() => labelSets?.find(s => s.pk === selectedPk), [ labelSets, selectedPk ]);
  const selectedLabels = useMemo(() => selected?.labels?.results.filter(r => r !== null).map(l => l.name) ?? [], [ selected ]);

  const select = useCallback((pk: string | number | undefined) => {
    if (typeof pk === 'string') pk = +pk
    if (!pk || isNaN(pk) || pk === 0) pk = undefined
    onSelected(pk)
  }, [ onSelected ])

  if (fetchingError) return <WarningText>Fail loading label sets:<br/>{ getErrorMessage(fetchingError) }</WarningText>

  if (!labelSets) return <Fragment/>
  return <Select label="Label set"
                 placeholder={ placeholder } error={ error }
                 options={ [ { value: 0, label: 'Empty' }, ...(labelSets?.map(s => ({
                   value: s.pk,
                   label: s.name
                 })) ?? []) ] }
                 optionsContainer="alert"
                 disabled={ !labelSets?.length }
                 value={ selectedPk ?? 0 }
                 onValueSelected={ select }
                 isLoading={ isFetching }
                 required>

    { selected && <LabelSetFeaturesSelect description={ selected.description ?? undefined }
                                          labels={ selectedLabels }
                                          labelsWithAcousticFeatures={ labelsWithAcousticFeatures }
                                          setLabelsWithAcousticFeatures={ setLabelsWithAcousticFeatures }/> }

    { labelSets.length === 0 &&
        <IonNote>You need to create a label set to use it in your campaign</IonNote> }
  </Select>
}
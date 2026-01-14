import React, { Fragment, useCallback } from 'react';
import { IonNote } from '@ionic/react';
import { Select } from '@/components/form';
import { WarningText } from '@/components/ui';
import { LabelSetFeaturesSelect } from './LabelSetFeaturesSelect';
import { AnnotationLabelNode, LabelSetNode, Maybe, useAllLabelSets } from '@/api';

type Label = Pick<AnnotationLabelNode, 'id' | 'name'>
type LabelSet = Pick<LabelSetNode, 'id' | 'description'> & {
  labels: Array<Maybe<Label>>;
}

export const LabelSetSelect: React.FC<{
  placeholder: string;
  selected?: LabelSet;
  onSelected: (labelSet?: LabelSet) => void;
  labelsWithAcousticFeatures: Label[];
  setLabelsWithAcousticFeatures: (labels: Label[]) => void;
  labelSetError?: string;
  labelsWithFeaturesError?: string;
}> = ({
        placeholder,
        selected,
        onSelected,
        labelSetError,
        labelsWithFeaturesError,
        labelsWithAcousticFeatures,
        setLabelsWithAcousticFeatures,
      }) => {
  const { allLabelSets, isFetching, error: fetchingError } = useAllLabelSets()

  const select = useCallback((pk: string | number | undefined) => {
    if (pk === 0) pk = undefined
    if (typeof pk === 'number') pk = pk.toString()
    onSelected(allLabelSets?.find(s => s?.id === pk) ?? undefined)
  }, [ onSelected, allLabelSets ])

  if (fetchingError) return <WarningText message="Fail loading label sets" error={ fetchingError }/>

  if (!allLabelSets) return <Fragment/>
  return <Select label="Label set"
                 placeholder={ placeholder }
                 error={ labelSetError }
                 options={ [ { value: 0, label: 'Empty' }, ...(allLabelSets?.filter(s => s !== null).map(s => ({
                   value: s!.id,
                   label: s!.name,
                 })) ?? []) ] }
                 optionsContainer="alert"
                 disabled={ !allLabelSets?.length }
                 value={ selected?.id ?? 0 }
                 onValueSelected={ select }
                 isLoading={ isFetching }
                 required>

    { selected && <LabelSetFeaturesSelect description={ selected.description ?? undefined }
                                          error={ labelsWithFeaturesError }
                                          labels={ (selected.labels ?? []).filter(l => l !== null) as Label[] }
                                          labelsWithAcousticFeatures={ labelsWithAcousticFeatures }
                                          setLabelsWithAcousticFeatures={ setLabelsWithAcousticFeatures }/> }

    { allLabelSets.length === 0 &&
        <IonNote>You need to create a label set to use it in your campaign</IonNote> }
  </Select>
}
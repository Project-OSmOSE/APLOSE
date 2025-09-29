import React, { FormEvent, Fragment } from "react";
import { Table, TableContent, TableDivider, TableHead } from "@/components/ui";
import { IonCheckbox } from "@ionic/react";

export const LabelSetFeaturesSelect: React.FC<{
  description?: string,
  labels: string[],
  labelsWithAcousticFeatures: string[];
  setLabelsWithAcousticFeatures: (value: string[]) => void
  disabled?: boolean;
  allDisabled?: boolean;
}> = ({
        description,
        labels,
        labelsWithAcousticFeatures,
        setLabelsWithAcousticFeatures,
        disabled = false,
        allDisabled = false
      }) => {

  const onLabelChecked = (event: FormEvent<HTMLIonCheckboxElement>, label: string) => {
    event.stopPropagation()
    event.preventDefault()
    if (labelsWithAcousticFeatures.includes(label)) {
      setLabelsWithAcousticFeatures(labelsWithAcousticFeatures.filter(l => l !== label))
    } else {
      setLabelsWithAcousticFeatures([ ...labelsWithAcousticFeatures, label ])
    }
  }

  return <Fragment>
    { description && <p className={ allDisabled ? 'disabled' : '' }>{ description }</p> }

    <Table columns={ 2 } className={ allDisabled ? 'disabled' : '' }>
      <TableHead isFirstColumn={ true }>Label</TableHead>
      <TableHead>Acoustic features</TableHead>
      <TableDivider/>

      { labels.map(label => <Fragment key={ label }>
        <TableContent isFirstColumn={ true }>{ label }</TableContent>
        <TableContent>
          <IonCheckbox checked={ labelsWithAcousticFeatures.includes(label) }
                       disabled={ disabled || allDisabled }
                       onClick={ event => onLabelChecked(event, label) }/></TableContent>
        <TableDivider/>
      </Fragment>) }
    </Table>
  </Fragment>
}
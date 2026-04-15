import React, { FormEvent, Fragment } from 'react';
import { Table, Tbody, Td, Th, Thead, Tr, WarningText } from '@/components/ui';
import { IonCheckbox } from '@ionic/react';
import { AnnotationLabelNode } from '@/api';

type Label = Pick<AnnotationLabelNode, 'name' | 'id'>

export const LabelSetFeaturesSelect: React.FC<{
    description?: string,
    labels: Label[],
    labelsWithAcousticFeatures: Label[];
    setLabelsWithAcousticFeatures: (value: Label[]) => void
    disabled?: boolean;
    allDisabled?: boolean;
    error?: string;
}> = ({
          description,
          labels,
          labelsWithAcousticFeatures,
          setLabelsWithAcousticFeatures,
          disabled = false,
          allDisabled = false,
          error,
      }) => {

    const onLabelChecked = (event: FormEvent<HTMLIonCheckboxElement>, label: Label) => {
        event.stopPropagation()
        event.preventDefault()
        if (labelsWithAcousticFeatures.find(l => l.id === label.id)) {
            setLabelsWithAcousticFeatures(labelsWithAcousticFeatures.filter(l => l.id !== label.id))
        } else {
            setLabelsWithAcousticFeatures([ ...labelsWithAcousticFeatures, label ])
        }
    }

    return <Fragment>
        { description && <p className={ allDisabled ? 'disabled' : '' }>{ description }</p> }

        { error && <WarningText error={ error }/> }

        <Table className={ allDisabled ? 'disabled' : '' }>
            <Thead>
                <Tr>
                    <Th scope="col">Label</Th>
                    <Th scope="col">Acoustic features</Th>
                </Tr>
            </Thead>
            <Tbody>
                { labels.map(label => <Tr key={ label.id }>
                    <Th scope="row">{ label.name }</Th>
                    <Td>
                        <IonCheckbox checked={ labelsWithAcousticFeatures.some(l => l.id === label.id) }
                                     disabled={ disabled || allDisabled }
                                     onClick={ event => onLabelChecked(event, label) }/></Td>
                </Tr>) }
            </Tbody>
        </Table>
    </Fragment>
}
import React, { MouseEvent, Fragment } from 'react';
import { Table as BaseTable, Tbody, Td, Th, Thead, Tr, WarningText } from '@/components/ui';
import { AnnotationLabelNode } from '@/api';
import { Checkbox } from '@/components/base/Checkbox';
import type { BaseUIEvent } from '@base-ui/react';

type Label = Pick<AnnotationLabelNode, 'name' | 'id'>

export const Table: React.FC<{
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

    const onLabelChecked = (event: BaseUIEvent<MouseEvent>, label: Label) => {
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

        <BaseTable className={ allDisabled ? 'disabled' : '' }>
            <Thead>
                <Tr>
                    <Th scope="col">Label</Th>
                    <Th scope="col">Acoustic features</Th>
                </Tr>
            </Thead>
            <Tbody>
                { labels.map(label => <Tr key={ label.id }>
                    <Th scope="row">{ label.name }</Th>
                    <Td center>
                        <Checkbox checked={ labelsWithAcousticFeatures.some(l => l.id === label.id) }
                                  disabled={ disabled || allDisabled }
                                  onClick={ event => onLabelChecked(event, label) }/></Td>
                </Tr>) }
            </Tbody>
        </BaseTable>
    </Fragment>
}
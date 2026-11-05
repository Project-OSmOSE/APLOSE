import React from 'react';
import { Field, Fieldset } from '@/components/base';
import { Table, Tbody, Td, Th, Thead, Tr } from '@/components/ui';
import { MxOntology } from "@/features/Mx";
import styles from './styles.module.scss'


export type LabelsTableProps = { labels: string[] }
export const LabelsTable: React.FC<LabelsTableProps> = ({ labels }) => {
    return <Fieldset.Root className={ styles.TableFieldSet }>
        <Fieldset.Legend>Labels</Fieldset.Legend>

        <Table>
            <Thead>
                <Tr>
                    <Th scope="col">In CSV</Th>
                    <Th scope="col">In the Ontology</Th>
                </Tr>
            </Thead>
            <Tbody>{ labels.map((label, key) => <Tr key={ key }>
                <Td top>{ label }</Td>
                <Td top>
                    <Field.Root name={ `label-${ label }` }>
                        <MxOntology.LabelCombobox defaultStringLabel={ label } required/>
                    </Field.Root>
                </Td>
            </Tr>) }</Tbody>
        </Table>
    </Fieldset.Root>
}

import React, { Fragment } from 'react';
import { Table, Tbody, Th, Thead, Tr } from '@/components/ui';
import { Field, Note, Select } from '@/components/base';

import styles from './styles.module.scss'

import { useImportShortAcquisitionContext } from './Root';
import { ChoosableTh } from './ChoosableTh';
import { DeploymentTd } from './Td';


export const FormTable: React.FC = () => {
    const {
        rows,

        header: {
            selectedRaws,
            availableRaws,
            selectRaw,
        },
    } = useImportShortAcquisitionContext()

    if (!rows) return <Fragment/>
    return <Table className={ styles.Table }>
        <Thead>
            <Tr>
                <Th scope="col"></Th>
                { selectedRaws.map((header: string, index: number) =>
                    <ChoosableTh header={ header } key={ index }/>) }
                { availableRaws.length > 0 && <Th>
                    <Field.Root>
                        <Field.Label>
                            <Note color="medium">Add a column</Note>
                        </Field.Label>
                        <Select itemName="column"
                                value={ null }
                                items={ availableRaws }
                                onValueChange={ raw => raw !== null ? selectRaw(raw) : null }
                                itemToStringValue={ (item: string) => item }
                                itemToElementLabel={ (item: string) => item }/>
                    </Field.Root>
                </Th> }
            </Tr>
        </Thead>
        <Tbody>
            { rows?.map((_, index) => <Tr key={ index }>
                <Th scope="row">{ index }</Th>
                { selectedRaws.map((header: string) =>
                    <DeploymentTd header={ header } key={ header } rowIndex={ index }/>) }
            </Tr>) }
        </Tbody>
    </Table>
}
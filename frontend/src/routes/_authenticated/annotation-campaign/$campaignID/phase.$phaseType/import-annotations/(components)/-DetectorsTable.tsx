import React, { Fragment, useCallback, useMemo, useState } from 'react';
import { Checkbox, ComboboxSelect, Field, Fieldset } from '@/components/base';
import { Table, Tbody, Td, Th, Thead, Tr } from '@/components/ui';
import { useQuery } from '@tanstack/react-query';
import { DetectorAPI } from '@/features/Detector';
import { cleanGqlList } from '@/api/utils';
import { NBSP } from '@/service/type';

type N<T> = NonNullable<T>;
type Detector = N<N<DetectorAPI.ListDetectorsQuery['allDetectors']>['results'][number]>
type DetectorConfiguration = N<N<Detector['configurations']>[number]>

export type DetectorsTableProps = { names: string[] }
export const DetectorsTable: React.FC<DetectorsTableProps> = ({ names }) => {
    return <Fieldset.Root>
        <Fieldset.Legend>Detectors</Fieldset.Legend>

        <Table>
            <Thead>
                <Tr>
                    <Th scope="col"></Th>
                    <Th scope="col">In CSV</Th>
                    <Th scope="col">In APLOSE</Th>
                    <Th scope="col">Configuration</Th>
                </Tr>
            </Thead>
            <Tbody>{ names.map((n, key) => <DetectorRow name={ n } key={ key }/>) }</Tbody>
        </Table>
    </Fieldset.Root>
}
const DetectorRow: React.FC<{
    name: string
}> = ({ name }) => {
    const { data: allDetectors } = useQuery(DetectorAPI.allQuery)
    const [ isSelected, setIsSelected ] = useState<boolean>(true);
    const [ detector, setDetector ] = useState<Detector | null>(null);
    const known = useMemo(() => allDetectors?.find(d => d.name === name), [ allDetectors, name ])

    return <Tr>
        <Th top scope="row">
            <Field.Root name={ `import-${ name }` }>
                <Field.Label>{ NBSP /* Required to have text line height for checkbox */ }
                    <Checkbox checked={ isSelected }
                              onCheckedChange={ setIsSelected }/>
                </Field.Label>
            </Field.Root>
        </Th>
        <Td top>{ name }</Td>
        <Td top>
            <Field.Root name={ `detector-${ name }` }>
                <DetectorSelect name={ name } known={ known } value={ detector } onValueChange={ setDetector }/>
            </Field.Root>
        </Td>
        <Td top>
            <Field.Root name={ `configuration-${ name }` }>
                <ConfigurationSelect name={ name } items={ cleanGqlList((known ?? detector)?.configurations) }/>
            </Field.Root>
        </Td>
    </Tr>
}


const DetectorSelect: React.FC<{
    name: string,
    known: Detector | undefined,
    value: Detector | null,
    onValueChange: (value: Detector | null) => void
}> = ({ name, value, onValueChange, known }) => {
    const { data: allDetectors } = useQuery(DetectorAPI.allQuery)

    if (known) {
        return <ComboboxSelect itemName="detector" disabled
                               data-testid={ `select-${ name }-detector` }
                               placeholder="Create detector"
                               itemToStringLabel={ item => item.name }
                               itemToStringValue={ item => item.name }
                               isItemEqualToValue={ (a, b) => a.name === b.name }
                               items={ allDetectors }
                               value={ known }/>
    }

    return <ComboboxSelect itemName="detector"
                           data-testid={ `select-${ name }-detector` }
                           placeholder="Create detector"
                           itemToStringLabel={ item => item.name }
                           itemToStringValue={ item => item.id }
                           isItemEqualToValue={ (a, b) => a.id === b.id }
                           items={ allDetectors }
                           value={ value }
                           onValueChange={ onValueChange }/>
}


const ConfigurationSelect: React.FC<{
    name: string,
    items?: DetectorConfiguration[],
}> = ({ name, items }) => {
    const [ selected, setSelected ] = useState<DetectorConfiguration | null>(null);
    const [ config, setConfig ] = useState<string>('');

    const onValueChange = useCallback((value: DetectorConfiguration | null) => {
        setSelected(value);
        setConfig(value?.configuration ?? '')
    }, [])

    const hasItems = useMemo(() => {
        return items && items.length > 0
    }, [ items ])

    return <Fragment>
        <ComboboxSelect itemName="detector configuration"
                        data-testid={ `select-${ name }-configuration` }
                        placeholder="Create configuration"
                        itemToStringLabel={ item => item.configuration }
                        itemToStringValue={ item => item.configuration }
                        isItemEqualToValue={ (a, b) => a.id === b.id }
                        items={ items }
                        value={ selected }
                        disabled={ !hasItems }
                        onValueChange={ onValueChange }/>

        <Field.Control type="textarea"
                       value={ config }
                       onValueChange={ setConfig }
                       disabled={ !!selected }/>
    </Fragment>
}
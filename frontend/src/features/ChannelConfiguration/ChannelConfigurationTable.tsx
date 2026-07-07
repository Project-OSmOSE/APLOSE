import React, { Fragment } from 'react';

import { Table, Tbody, Td, Th, Thead, Tr } from '@/components/ui';
import { useLoaderData } from '@tanstack/react-router';
import { Note } from '@/components/base/Note';

export const ChannelConfigurationTable: React.FC = () => {

    const { allChannelConfigurations } = useLoaderData({
        from: '/_authenticated/_admin/dataset/$datasetID',
        select: ({ allChannelConfigurations }) => ({ allChannelConfigurations }),
    })

    if (allChannelConfigurations.length === 0)
        return <Note color="medium">No acquisition information</Note>

    return <Table spacing="small">
        <Thead>
            <Tr>
                <Th scope="col">Project</Th>
                <Th scope="col">Deployment</Th>
                <Th scope="col">Site</Th>
                <Th scope="col">Campaign</Th>
                <Th scope="col">Recorder</Th>
                <Th scope="col">Hydrophone</Th>
                <Th scope="col">Detector</Th>
            </Tr>
        </Thead>
        <Tbody>
            { allChannelConfigurations.map((c, k) => <Tr key={ k }>
                <Th scope="row">{ c.deployment?.project?.name }</Th>
                <Td>{ c.deployment?.name }</Td>
                <Td>{ c.deployment?.site?.name }</Td>
                <Td>{ c.deployment?.campaign?.name }</Td>
                { c.recorderSpecification ? <Fragment>
                    <Td>{ c.recorderSpecification?.recorder.model.name }
                        <Note color="medium">#{ c.recorderSpecification?.recorder.serialNumber }</Note>
                    </Td>
                    <Td>{ c.recorderSpecification?.hydrophone.model.name }
                        <Note color="medium">#{ c.recorderSpecification?.hydrophone.serialNumber }</Note></Td>
                </Fragment> : <Fragment>
                    <Td>-</Td>
                    <Td>-</Td>
                </Fragment> }
                { c.detectorSpecification ? <Td>
                    { c.detectorSpecification?.detector.model.name }
                    <Note color="medium">#{ c.detectorSpecification?.detector.serialNumber }</Note>
                </Td> : <Td>-</Td> }
            </Tr>) }
        </Tbody>
    </Table>
}

import React, { Fragment } from 'react';
import { IonNote, IonSpinner } from '@ionic/react';

import { FadedText, GraphQLErrorText, Table, Tbody, Td, Th, Thead, Tr } from '@/components/ui';
import { useAllChannelConfigurations } from '@/api';
import styles from './styles.module.scss'

export const ChannelConfigurationTable: React.FC<{ datasetID: string }> = ({ datasetID }) => {

    const {
        allChannelConfigurations,
        isLoading,
        error,
        isFetching,
    } = useAllChannelConfigurations({ datasetID });

    if (isLoading) return <IonSpinner/>
    if (error) return <GraphQLErrorText error={ error }/>
    if (!allChannelConfigurations || allChannelConfigurations.length === 0)
        return <IonNote color="medium">No acquisition information</IonNote>

    return <Table spacing='small'>
        <Thead>
            <Tr>
                <Th scope="col">Project { isFetching && <IonSpinner className={ styles.gridSpinner }/> }</Th>
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
                        <FadedText>#{ c.recorderSpecification?.recorder.serialNumber }</FadedText>
                    </Td>
                    <Td>{ c.recorderSpecification?.hydrophone.model.name }
                        <FadedText>#{ c.recorderSpecification?.hydrophone.serialNumber }</FadedText></Td>
                </Fragment> : <Fragment>
                    <Td>-</Td>
                    <Td>-</Td>
                </Fragment> }
                { c.detectorSpecification ? <Td>
                    { c.detectorSpecification?.detector.model.name }
                    <FadedText>#{ c.detectorSpecification?.detector.serialNumber }</FadedText>
                </Td> : <Td>-</Td> }
            </Tr>) }
        </Tbody>
    </Table>
}

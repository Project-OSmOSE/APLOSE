import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/api/queryKeys';
import { graphqlClient } from '@/api/graphqlClient';
import { AllDeploymentsDocument, type AllDeploymentsQuery, type AllDeploymentsQueryVariables } from '../all.generated';
import { cleanGqlList } from '@/api/utils';
import { Center } from '@/components/layout/Display';
import { Note, Spinner } from '@/components/base';
import { Table, Tbody, Td, Th, Thead, Tr } from '@/components/ui';
import styles from './styles.module.scss'
import { DeploymentStatusBadge } from '../StatusBadge';

export const DeploymentTable: React.FC<AllDeploymentsQueryVariables> = (vars) => {
    const { data, isFetching } = useQuery({
        queryKey: queryKeys.mx.acquisition.deployments.all(vars),
        queryFn: () => graphqlClient.request<AllDeploymentsQuery>(AllDeploymentsDocument, vars)
            .then(data => cleanGqlList(data.projectById?.deployments.edges.map(e => e?.node))),
    })

    if (isFetching)
        return <Center><Spinner/></Center>
    return <Table>
        <Thead>
            <Tr>
                <Th scope="col">Name</Th>
                <Th scope="col">Deployment</Th>
                <Th scope="col">Recovery</Th>
                <Th scope="col">Status</Th>
                <Th scope="col">Actions</Th>
            </Tr>
        </Thead>
        <Tbody>
            { data?.map((d, index) => <Tr key={ index }>
                <Th scope="row">{ d.displayName }</Th>
                <Td>
                    <div className={ styles.ColumnData }>
                        { d.deploymentDate ? new Date(d.deploymentDate).toLocaleString() : d.deploymentDate }
                        <Note color="medium">{ d.deploymentVessel }</Note>
                    </div>
                </Td>
                <Td>
                    <div className={ styles.ColumnData }>
                        { d.recoveryDate ? new Date(d.recoveryDate).toLocaleString() : d.recoveryDate }
                        <Note color="medium">{ d.recoveryVessel }</Note>
                    </div>
                </Td>
                <Td>
                    <Center>
                        <DeploymentStatusBadge { ...d }/>
                    </Center>
                </Td>
            </Tr>) }
        </Tbody>
    </Table>
}

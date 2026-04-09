import React, { Fragment, useMemo } from 'react';
import { QueryStatus } from '@reduxjs/toolkit/query';
import { IonNote, IonSpinner } from '@ionic/react';
import { Button, GraphQLErrorText, Head, Table, TableContent, TableDivider, TableHead } from '@/components/ui';
import { api } from '../api'
import { use } from '../hook'
import { Indicator } from '../components/Indicator'

export const BackgroundTasksPage: React.FC = () => {
    const { data, status, error } = api.useAllBackgroundTasksQuery()
    const { request } = use()

    return useMemo(() => {
        switch (status) {
            case QueryStatus.uninitialized:
            case QueryStatus.pending:
                return <Fragment>
                    <Head title="Background tasks"/>
                    <IonSpinner/>
                </Fragment>
            case QueryStatus.rejected:
                return <Fragment>
                    <Head title="Background tasks"/>
                    <GraphQLErrorText error={ error }/>
                </Fragment>
            case QueryStatus.fulfilled:
                return <Fragment>
                    <Head title="Background tasks"/>

                    <Table columns={ 5 }>
                        <Fragment>
                            <TableHead topSticky isFirstColumn={ true }>
                                Identifier
                            </TableHead>
                            <TableHead topSticky>State</TableHead>
                            <TableHead topSticky>Path</TableHead>
                            <TableHead topSticky>Action</TableHead>
                            <TableDivider/>
                        </Fragment>

                        { data?.allImportAnalysisTasks?.map((t, k) => t && <Fragment key={ k }>
                            <TableContent isFirstColumn={ true }>{ t.identifier }</TableContent>
                            <TableContent>
                                <div style={ { display: 'grid ' } }>
                                    <IonNote>{ t.status }</IonNote>
                                    <Indicator identifier={ t.identifier }/>
                                </div>
                            </TableContent>
                            <TableContent>{ t.analysisPath }</TableContent>
                            <TableContent>
                                <Button fill="clear" onClick={ () => request({
                                    command: 'retry',
                                    identifier: t.identifier,
                                }) }>
                                    Relaunch
                                </Button>
                            </TableContent>
                        </Fragment>) }
                    </Table>
                </Fragment>

        }
    }, [ data, status, error ])
}

export default BackgroundTasksPage

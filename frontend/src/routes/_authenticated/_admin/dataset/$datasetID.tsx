import React, { Fragment } from 'react';
import { createFileRoute, type ErrorComponentProps, notFound } from '@tanstack/react-router'
import { useQuery } from "@tanstack/react-query";
import { DownloadLinearIcon, InfoSquareLinearIcon, WidgetAddLinearIcon } from '@solar-icons/react';

import { ensureValidQueryData } from '@/api/utils';
import { Head, WarningText } from '@/components/ui';
import { Badge, ButtonGroup, Dialog, Drawer, Link, Spinner } from '@/components/base';
import { Center, Content } from '@/components/layout';
import { datetimeToString, dateToString } from '@/service/function';

import { StorageModal } from '@/features/Storage';
import { ChannelConfigurationTable } from '@/features/ChannelConfiguration';
import { SpectrogramAnalysisTable } from '@/features/SpectrogramAnalysis';
import { Campaign } from '@/features/AnnotationCampaign';
import { Dataset } from '@/features/Dataset';
import styles from './styles.module.scss'

const DatasetDetail: React.FC = () => {
    const { datasetID } = Route.useParams()
    const { data } = useQuery(Dataset.byIdQuery({ id: datasetID }))

    if (!data) return <Fragment/>
    if (!data.dataset) return <Fragment/>
    return <Content oneContent>
        <Head title={ data.dataset.name } subtitle={ data.dataset.path } canGoBack>
            <ButtonGroup center>
                { data.dataset.archived && <Center><Badge color='medium'>Archived</Badge></Center> }
                <Drawer.Root>
                    <Drawer.Trigger color='medium'>
                        <InfoSquareLinearIcon/>
                    </Drawer.Trigger>
                    <Drawer.Content>
                        <Drawer.Close/>

                        {/* Description */ }
                        { data.dataset.description && <Drawer.ContentBloc>
                            <Drawer.ContentBlocLabel>Description</Drawer.ContentBlocLabel>
                            <Drawer.ContentBlocContent>{ data.dataset.description }</Drawer.ContentBlocContent>
                        </Drawer.ContentBloc> }

                        {/* Data start/end */ }
                        <Drawer.ContentBloc>
                            <Drawer.ContentBlocLabel>Dates</Drawer.ContentBlocLabel>
                            <Drawer.ContentBlocContent>
                                { datetimeToString(data.dataset.start) }
                                <br/>
                                { datetimeToString(data.dataset.end) }
                            </Drawer.ContentBlocContent>
                        </Drawer.ContentBloc>

                        {/* Import */ }
                        <Drawer.ContentBloc>
                            <Drawer.ContentBlocLabel>Import</Drawer.ContentBlocLabel>
                            <Drawer.ContentBlocContent>
                                Imported on { dateToString(data.dataset.createdAt) }
                                <br/>
                                by { data.dataset.owner.displayName }
                            </Drawer.ContentBlocContent>
                        </Drawer.ContentBloc>

                        {/* Archive */ }
                        <Drawer.ContentBloc>
                            <Drawer.ContentBlocLabel>Archive</Drawer.ContentBlocLabel>
                            { data.dataset.archived
                                ? <Drawer.ContentBlocContent>
                                    Archived on { dateToString(data.dataset.archivedAt) }
                                    <br/>
                                    by { data.dataset.archivedBy?.displayName }
                                </Drawer.ContentBlocContent>
                                : <Dataset.ArchiveButton dataset={ data.dataset }
                                                         annotationCampaigns={ data.campaigns }/> }
                        </Drawer.ContentBloc>
                    </Drawer.Content>
                </Drawer.Root>
            </ButtonGroup>
        </Head>

        <div style={ { overflow: 'auto' } }>

            <div className={ styles.InfoBloc }>
                <ButtonGroup spaceBetween>
                    <h4>Analysis</h4>

                    { !data.dataset.archived && <Dialog.Root>
                        <Dialog.Trigger color="primary">
                            <DownloadLinearIcon size={ 20 }/>
                            Import analysis
                        </Dialog.Trigger>
                        <Dialog.Portal>
                            <StorageModal.ImportAnalysis/>
                        </Dialog.Portal>
                    </Dialog.Root> }
                </ButtonGroup>

                <SpectrogramAnalysisTable analysis={ data.analysis }/>
            </div>

            <div className={ styles.InfoBloc }>
                <ButtonGroup spaceBetween>
                    <h4>Annotation campaigns</h4>

                    { !data.dataset.archived && <Link color="primary" to="/annotation-campaign/new"
                                                      search={ { dataset_id: data.dataset.id } }>
                        <WidgetAddLinearIcon size={ 20 }/>
                        New annotation campaign
                    </Link> }
                </ButtonGroup>
                <Campaign.Cards campaigns={ data.campaigns }/>
            </div>
            
            <div className={ styles.InfoBloc }>
                <h4>Channel configurations</h4>
                <ChannelConfigurationTable/>
            </div>

        </div>
    </Content>
}

const ErrorComponent: React.FC<ErrorComponentProps> = ({ error }) => {
    const { datasetID } = Route.useParams()
    return <Content oneContent>
        <Head title={ `Error on dataset ${ datasetID }` }/>
        <Center><WarningText error={ error }/></Center>
    </Content>
}

export const Route = createFileRoute(`/_authenticated/_admin/dataset/$datasetID`)({
    loader: async ({ params: { datasetID } }) => {
        const { dataset, ...data } = await ensureValidQueryData(Dataset.byIdQuery({ id: datasetID }))
        if (!dataset) throw notFound()
        return { dataset, ...data }
    },
    component: DatasetDetail,
    errorComponent: (props) => <ErrorComponent { ...props }/>,
    pendingComponent: () => <Content oneContent>
        <Head/>
        <Center><Spinner/></Center>
    </Content>,
})

import React from 'react';
import { createFileRoute, type ErrorComponentProps, notFound } from '@tanstack/react-router'

import { Head, WarningText } from '@/components/ui';

import { StorageModal } from '@/features/Storage';
import { ChannelConfigurationTable } from '@/features/ChannelConfiguration';
import { SpectrogramAnalysisTable } from '@/features/SpectrogramAnalysis';
import { Cards } from '@/features/AnnotationCampaign';
import { DatasetAPI } from '@/features/Dataset';
import { Calendar, Download, WidgetAdd } from '@solar-icons/react';
import { ButtonGroup, Link } from '@/components/base/Button';
import { Dialog } from '@/components/base/Dialog';
import { Content } from '@/components/layout/Content';
import { Note } from '@/components/base/Note';
import { datetimeToString, dateToString } from '@/service/function';
import { Center } from '@/components/layout/Display';
import { Spinner } from '@/components/base/Spinner';
import styles from './styles.module.scss'
import { ensureValidQueryData } from '@/api/utils';

const DatasetDetail: React.FC = () => {
    const { dataset, campaigns, analysis } = Route.useLoaderData()

    return <Content oneContent>
        <Head title={ dataset.name } subtitle={ dataset.path } canGoBack/>

        <div style={ { overflow: 'auto' } }>
            <div className={ styles.InfoBloc }>
                <h4>Details</h4>
                { dataset.description && <Note color="medium">{ dataset.description }</Note> }
                <Note color="medium">
                    <Calendar weight="Linear"
                              size={ 16 }/> { datetimeToString(dataset.start) } - { datetimeToString(dataset.end) }
                </Note>
                <Note color="medium">
                    Dataset imported on { dateToString(new Date(dataset.createdAt)) } by { dataset.owner.displayName }
                </Note>
            </div>


            <div className={ styles.InfoBloc }>
                <h4>Channel configurations</h4>
                <ChannelConfigurationTable/>
            </div>

            <div className={ styles.InfoBloc }>
                <ButtonGroup spaceBetween>
                    <h4>Analysis</h4>

                    <Dialog.Root>
                        <Dialog.Trigger color="primary">
                            <Download weight="Linear" size={ 20 }/>
                            Import analysis
                        </Dialog.Trigger>
                        <Dialog.Portal>
                            <StorageModal.ImportAnalysis/>
                        </Dialog.Portal>
                    </Dialog.Root>
                </ButtonGroup>

                <SpectrogramAnalysisTable analysis={ analysis }/>
            </div>

            <div className={ styles.InfoBloc }>
                <ButtonGroup spaceBetween>
                    <h4>Annotation campaigns</h4>

                    <Link color="primary" to="/annotation-campaign/new"
                          search={ { dataset_id: dataset.id } }>
                        <WidgetAdd weight="Linear" size={ 20 }/>
                        New annotation campaign
                    </Link>
                </ButtonGroup>
                <Cards campaigns={ campaigns }/>
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
        const { dataset, ...data } = await ensureValidQueryData(DatasetAPI.byIdQuery({ id: datasetID }))
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

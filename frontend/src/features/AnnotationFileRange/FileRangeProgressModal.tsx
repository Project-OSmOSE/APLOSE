import React, { Fragment, useEffect, useMemo, useState } from 'react';
import styles from './styles.module.scss';
import {
    Modal,
    ModalFooter,
    ModalHeader,
    type ModalProps,
    type Order,
    Progress,
    Table,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
    WarningText,
} from '@/components/ui';
import { Toast } from '@/components/base/Toast';
import { IonNote, IonSpinner } from '@ionic/react';
import { AnnotationFileRangeNode, AnnotationTaskNodeNodeConnection, Maybe, UserNode } from '@/api';
import { useDownloadAnnotations, useDownloadProgress } from '@/api/download';
import { NBSP } from '@/service/type';
import { useQuery } from '@tanstack/react-query';
import { AnnotationFileRange } from '@/features';
import { UserAPI } from '@/features/User';
import { useLoaderData } from '@tanstack/react-router';
import { Button, ButtonGroup } from '@/components/base/Button';
import { Download } from '@solar-icons/react';

type Progression = {
    user: Pick<UserNode, 'id' | 'displayName' | 'expertise' | 'username'>;
    ranges: Array<Pick<AnnotationFileRangeNode, 'id' | 'firstFileIndex' | 'lastFileIndex' | 'filesCount'> & {
        annotator: Pick<UserNode, 'id'>
        completedAnnotationTasks?: Maybe<Pick<AnnotationTaskNodeNodeConnection, 'totalCount'>>
    }>;
    progress: number; // [0-1]
}

type Sort = {
    entry: 'Annotator' | 'Progress';
    sort: Order;
}

export const FileRangeProgressModal: React.FC<ModalProps> = ({ onClose }) => {
    const { campaign } = useLoaderData({ from: '/_authenticated/annotation-campaign/$campaignID' })
    const { phase } = useLoaderData({ from: '/_authenticated/annotation-campaign/$campaignID/_detailLayout/phase/$phaseType' })
    const { data, isLoading: isLoadingUsers, error: userError } = useQuery(UserAPI.allQuery)
    const {
        data: allFileRanges,
        isFetching: isLoadingFileRanges,
        error: fileRangeError,
    } = useQuery(AnnotationFileRange.API.forPhaseQuery({
        campaignID: campaign.id, phaseType: phase.phase,
    }));
    const { downloadAnnotations, error: downloadAnnotationsError } = useDownloadAnnotations()
    const { downloadProgress, error: downloadProgressError } = useDownloadProgress()
    const toastManager = Toast.useToastManager()

    useEffect(() => {
        if (downloadAnnotationsError) toastManager.addError({ title: 'Result download failed', error: downloadAnnotationsError })
    }, [ downloadAnnotationsError ]);

    useEffect(() => {
        if (downloadProgressError) toastManager.addError({ title: 'Progression download failed',error: downloadProgressError })
    }, [ downloadProgressError ]);

    const [ sort, setSort ] = useState<Sort>({ entry: 'Progress', sort: 'desc' });

    const progress = useMemo(() => {
        if (!allFileRanges || !data || data.users.length === 0) return [];
        const progression = new Array<Progression>();
        for (const range of allFileRanges) {
            let progress: Progression | undefined = progression.find(p => p.user?.id === range!.annotator?.id);
            if (progress) {
                progress.ranges.push(range!);
            } else {
                const user = data.users.find(u => u!.id == range!.annotator?.id)!
                progress = {
                    user,
                    ranges: [ range! ],
                    progress: 0,
                }
                progression.push(progress)
            }
        }
        return progression.map(p => {
            const totalFinished = p.ranges.reduce((v, r) => v + (r.completedAnnotationTasks?.totalCount ?? 0), 0);
            const total = p.ranges.reduce((v, r) => v + (r.filesCount ?? 0), 0);
            return { ...p, progress: total > 0 ? Math.trunc(100 * totalFinished / total) : 0 }
        })
    }, [ allFileRanges, data ]);

    const sortedProgress = useMemo(() => {
        const collator = new Intl.Collator(undefined, {
            usage: 'sort',
            sensitivity: 'base',
        })
        return progress.sort((a, b) => {
            let comparison = 0;
            switch (sort.entry) {
                case 'Annotator':
                    comparison = collator.compare(a.user.displayName, b.user.displayName);
                    break;
                case 'Progress':
                    comparison = a.progress - b.progress;
            }
            if (sort.sort === 'asc') return comparison;
            return -comparison;
        })
    }, [ progress, sort ]);

    return (
        <Modal onClose={ onClose } className={ styles.modal }>
            <ModalHeader onClose={ onClose } title="Annotators progression"/>

            { (isLoadingUsers || isLoadingFileRanges) && <IonSpinner/> }

            { userError && <WarningText error={ userError }/> }
            { fileRangeError && <WarningText error={ fileRangeError }/> }

            { (!isLoadingUsers && !isLoadingFileRanges) && progress.length === 0 && <IonNote>No annotators</IonNote> }

            { progress.length > 0 && <Table>
                <Thead>
                    <Tr>
                        <Th scope="col" sortable
                            order={ sort.entry === 'Annotator' && sort.sort }
                            setOrder={ order => setSort({ entry: 'Annotator', sort: order }) }>
                            Annotator
                        </Th>
                        <Th scope="col" sortable
                            order={ sort.entry === 'Progress' && sort.sort }
                            setOrder={ order => setSort({ entry: 'Progress', sort: order }) }>
                            Progress
                        </Th>
                    </Tr>
                </Thead>
                <Tbody>
                    { sortedProgress.map(p => <Tr key={ p.user.id }>
                        <Th scope="row">
                            { p.user.displayName || p.user.username }{ NBSP }{ p.user.expertise &&
                            <Fragment>({ p.user.expertise })</Fragment> }
                        </Th>
                        <Td>
                            <div className={ styles.progressContent }>
                                { p.ranges.map(r => (
                                    <Fragment key={ r.id }>
                                        <p>{ r.firstFileIndex }</p>
                                        <Progress value={ r.completedAnnotationTasks?.totalCount ?? 0 }
                                                  total={ r.filesCount ?? 0 }
                                                  color={ r.completedAnnotationTasks?.totalCount === r.filesCount ? 'success' : 'medium' }/>
                                        <p>{ r.lastFileIndex }</p>
                                    </Fragment>
                                )) }
                                <p className={ styles.total }>{ p.progress }%</p>
                            </div>
                        </Td>
                    </Tr>) }
                </Tbody>
            </Table> }

            { phase?.isUserAllowedToManage && data && allFileRanges && (
                <ModalFooter className={ styles.footer }>
                    <ButtonGroup spaceBetween>
                        { progress.length > 0 && <Fragment>
                            <Button onClick={ downloadAnnotations }>
                                <Download weight="Linear" size={ 20 }/>
                                Results (csv)
                            </Button>

                            <Button onClick={ downloadProgress }>
                                <Download weight="Linear" size={ 20 }/>
                                Status (csv)
                            </Button>
                        </Fragment> }
                    </ButtonGroup>
                </ModalFooter>
            ) }
        </Modal>
    )
}

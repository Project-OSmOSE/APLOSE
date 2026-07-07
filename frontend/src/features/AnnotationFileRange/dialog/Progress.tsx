import React, { Fragment, type ReactNode, useEffect, useMemo, useState } from 'react';
import { type Order, Table, Tbody, Td, Th, Thead, Tr, WarningText } from '@/components/ui';
import { Toast } from '@/components/base/Toast';
import { Progress as BaseProgress } from '@/components/base/Progress';
import { AnnotationFileRangeNode, AnnotationTaskNodeNodeConnection, Maybe, UserNode } from '@/api';
import { useDownloadAnnotations, useDownloadProgress } from '@/api/download';
import { NBSP } from '@/service/type';
import { useQuery } from '@tanstack/react-query';
import { UserAPI } from '@/features/User';
import { useLoaderData } from '@tanstack/react-router';
import { Button, ButtonGroup } from '@/components/base/Button';
import { Download } from '@solar-icons/react';
import { Note } from '@/components/base/Note';
import { Dialog } from '@/components/base/Dialog';
import { Spinner } from '@/components/base/Spinner';
import { Center } from '@/components/layout/Display';
import styles from './styles.module.scss'
import * as FileRangeAPI from '../api';

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

const DialogSkeleton: React.FC<{ children: ReactNode }> = ({ children }) => (
    <Dialog.Content>
        <Dialog.Title>Annotators progression</Dialog.Title>
        <Dialog.CloseIcon/>
        { children }
    </Dialog.Content>
)

export const Progress: React.FC = () => {
    const { campaign } = useLoaderData({ from: '/_authenticated/annotation-campaign/$campaignID' })
    const { phase } = useLoaderData({ from: '/_authenticated/annotation-campaign/$campaignID/_detailLayout/phase/$phaseType' })
    const { data, isLoading: isLoadingUsers, error: userError } = useQuery(UserAPI.allQuery)
    const {
        data: allFileRanges,
        isFetching: isLoadingFileRanges,
        error: fileRangeError,
    } = useQuery(FileRangeAPI.forPhaseQuery({
        campaignID: campaign.id, phaseType: phase.phase,
    }));
    const { downloadAnnotations, error: downloadAnnotationsError } = useDownloadAnnotations()
    const { downloadProgress, error: downloadProgressError } = useDownloadProgress()
    const toastManager = Toast.useToastManager()

    useEffect(() => {
        if (downloadAnnotationsError) toastManager.addError({
            title: 'Result download failed',
            error: downloadAnnotationsError,
        })
    }, [ downloadAnnotationsError ]);

    useEffect(() => {
        if (downloadProgressError) toastManager.addError({
            title: 'Progression download failed',
            error: downloadProgressError,
        })
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

    if (isLoadingUsers || isLoadingFileRanges)
        return <DialogSkeleton><Center><Spinner/></Center></DialogSkeleton>
    if (userError)
        return <DialogSkeleton><Center><WarningText error={ userError }/></Center></DialogSkeleton>
    if (fileRangeError)
        return <DialogSkeleton><Center><WarningText error={ fileRangeError }/></Center></DialogSkeleton>
    if (progress.length === 0)
        return <DialogSkeleton><Note color="medium">No annotators</Note></DialogSkeleton>

    return (
        <DialogSkeleton>
            <Table>
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
                                    <BaseProgress key={ r.id }
                                                  value={ (r.completedAnnotationTasks?.totalCount ?? 0) / (r.filesCount ?? 1) * 100 }
                                                  color={ r.completedAnnotationTasks?.totalCount === r.filesCount ? 'success' : 'medium' }>
                                        { r.firstFileIndex } - { r.lastFileIndex }
                                    </BaseProgress>
                                )) }
                            </div>
                        </Td>
                    </Tr>) }
                </Tbody>
            </Table>

            { phase?.isUserAllowedToManage && data && allFileRanges && (
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
            ) }
        </DialogSkeleton>
    )
}

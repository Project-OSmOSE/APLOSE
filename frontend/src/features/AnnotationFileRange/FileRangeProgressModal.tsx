import React, { Fragment, useEffect, useMemo, useState } from 'react';
import styles from './styles.module.scss';
import {
    Button,
    GraphQLErrorText,
    Modal,
    ModalFooter,
    ModalHeader,
    type ModalProps,
    Table,
    type Order,
    Progress,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
    useToast,
} from '@/components/ui';
import { IonIcon, IonNote, IonSpinner } from '@ionic/react';
import { downloadOutline } from 'ionicons/icons/index.js';
import {
    AnnotationFileRangeNode,
    AnnotationTaskNodeNodeConnection,
    Maybe,
    useAllFileRanges,
    useAllUsers,
    useCurrentPhase,
    UserNode,
} from '@/api';
import { useDownloadAnnotations, useDownloadProgress } from '@/api/download';
import { NBSP } from '@/service/type';

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
    const { phase } = useCurrentPhase()
    const { users, isFetching: isLoadingUsers, error: userError } = useAllUsers();
    const { allFileRanges, isFetching: isLoadingFileRanges, error: fileRangeError } = useAllFileRanges();
    const { downloadAnnotations, error: downloadAnnotationsError } = useDownloadAnnotations()
    const { downloadProgress, error: downloadProgressError } = useDownloadProgress()
    const toast = useToast()

    useEffect(() => {
        if (downloadAnnotationsError) toast.raiseError({ error: downloadAnnotationsError })
    }, [ downloadAnnotationsError ]);

    useEffect(() => {
        if (downloadProgressError) toast.raiseError({ error: downloadProgressError })
    }, [ downloadProgressError ]);

    const [ sort, setSort ] = useState<Sort>({ entry: 'Progress', sort: 'desc' });

    const progress = useMemo(() => {
        if (!allFileRanges || !users || users.length === 0) return [];
        const progression = new Array<Progression>();
        for (const range of allFileRanges) {
            let progress: Progression | undefined = progression.find(p => p.user?.id === range!.annotator?.id);
            if (progress) {
                progress.ranges.push(range!);
            } else {
                const user = users.find(u => u!.id == range!.annotator?.id)!
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
    }, [allFileRanges, users]);

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

            { userError && <GraphQLErrorText error={ userError }/> }
            { fileRangeError && <GraphQLErrorText error={ fileRangeError }/> }

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
                    { sortedProgress.map(p => <Tr key={p.user.id}>
                        <Th scope="row">
                            { p.user.displayName || p.user.username }{ NBSP }{ p.user.expertise && <Fragment>({ p.user.expertise })</Fragment> }
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

      { phase?.isUserAllowedToManage && users && allFileRanges && (
                <ModalFooter className={ styles.footer }>
                    <div className={ styles.buttons }>
                        { progress.length > 0 && <Fragment>
                            <Button size="small" color="dark" fill="clear"
                                    onClick={ downloadAnnotations }>
                                <IonIcon icon={ downloadOutline } slot="start"/>
                                Results (csv)
                            </Button>

                            <Button size="small" color="dark" fill="clear"
                                    onClick={ downloadProgress }>
                                <IonIcon icon={ downloadOutline } slot="start"/>
                                Status (csv)
                            </Button>
                        </Fragment> }
                    </div>
                </ModalFooter>
            ) }
        </Modal>
    )
}

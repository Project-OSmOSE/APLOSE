import React, { Fragment, useCallback, useEffect, useState } from 'react';
import styles from './styles.module.scss';
import {
  Link,
  Modal,
  ModalFooter,
  ModalHeader,
  Progress,
  Table,
  TableContent,
  TableDivider,
  TableHead,
  TooltipOverlay,
  useModal,
  WarningText,
} from '@/components/ui';
import { IonButton, IonIcon, IonNote, IonSpinner } from '@ionic/react';
import { analytics, caretDown, caretUp, downloadOutline } from 'ionicons/icons/index.js';
import { createPortal } from 'react-dom';
import {
  AnnotationFileRangeNode,
  AnnotationTaskNodeNodeConnection,
  Maybe,
  SpectrogramNodeNodeConnection,
  useAllFileRanges,
  useAllUsers,
  useCurrentPhase,
  UserNode,
} from '@/api';
import { DOWNLOAD_ANNOTATIONS, DOWNLOAD_PROGRESS } from '@/consts/links';

type Progression = {
  user: Pick<UserNode, 'id' | 'displayName' | 'expertise'>;
  ranges: Array<Pick<AnnotationFileRangeNode, 'id' | 'firstFileIndex' | 'lastFileIndex'> & {
    annotator: Pick<UserNode, 'id'>
    spectrograms?: Maybe<Pick<SpectrogramNodeNodeConnection, 'totalCount'>>
    completedAnnotationTasks?: Maybe<Pick<AnnotationTaskNodeNodeConnection, 'totalCount'>>
  }>;
  progress: number; // [0-1]
}

type Sort = {
  entry: 'Annotator' | 'Progress';
  sort: 'ASC' | 'DESC';
}

export const FileRangeProgressModalButton: React.FC = () => {
  const modal = useModal()
  return <Fragment>
    <TooltipOverlay tooltipContent={ <p>Annotators progression</p> } anchor="right">
      <IonButton fill="clear" color="medium" onClick={ modal.toggle } aria-label="Progress">
        <IonIcon icon={ analytics } slot="icon-only"/>
      </IonButton>
    </TooltipOverlay>
    { modal.isOpen && createPortal(<FileRangeProgressModal onClose={ modal.toggle }/>, document.body) }
  </Fragment>
}

export const FileRangeProgressModal: React.FC<{
  onClose?(): void;
}> = ({ onClose }) => {
  const { phase } = useCurrentPhase()
  const { users, isFetching: isLoadingUsers, error: userError } = useAllUsers();
  const { allFileRanges, isFetching: isLoadingFileRanges, error: fileRangeError } = useAllFileRanges();

  const [ progress, setProgress ] = useState<Array<Progression>>([]);
  const [ sort, setSort ] = useState<Sort>({ entry: 'Progress', sort: 'DESC' });

  useEffect(() => {
    if (!allFileRanges || !users) return;
    const progression = new Array<Progression>();
    for (const range of allFileRanges) {
      let progress: Progression | undefined = progression.find(p => p.user.id === range!.annotator?.id);
      if (progress) {
        progress.ranges.push(range!);
      } else {
        const user = users.find(u => u!.id === range!.annotator?.id)!
        progress = {
          user,
          ranges: [ range! ],
          progress: 0,
        }
        progression.push(progress)
      }
    }
    setProgress(progression.map(p => {
      const totalFinished = p.ranges.reduce((v, r) => v + (r.completedAnnotationTasks?.totalCount ?? 0), 0);
      const total = p.ranges.reduce((v, r) => v + (r.spectrograms?.totalCount ?? 0), 0);
      return { ...p, progress: total > 0 ? Math.trunc(100 * totalFinished / total) : 0 }
    }));
  }, [ allFileRanges, users ]);

  function toggleAnnotatorSort() {
    if (!sort || sort.entry !== 'Annotator' || sort.sort === 'DESC') {
      setSort({ entry: 'Annotator', sort: 'ASC' })
    } else {
      setSort({ entry: 'Annotator', sort: 'DESC' })
    }
  }

  function toggleProgressSort() {
    if (!sort || sort.entry !== 'Progress' || sort.sort === 'ASC') {
      setSort({ entry: 'Progress', sort: 'DESC' })
    } else {
      setSort({ entry: 'Progress', sort: 'ASC' })
    }
  }

  const sortProgress = useCallback((a: Progression, b: Progression) => {
    let comparison = 0;
    switch (sort.entry) {
      case 'Annotator':
        comparison = a.user.displayName.toLowerCase().localeCompare(b.user.displayName.toLowerCase());
        break;
      case 'Progress':
        comparison = a.progress - b.progress;
    }
    if (sort.sort === 'ASC') return comparison;
    return -comparison;
  }, [ sort ])

  return (
    <Modal onClose={ onClose } className={ styles.modal }>
      <ModalHeader onClose={ onClose } title="Annotators progression"/>

      { (isLoadingUsers || isLoadingFileRanges) && <IonSpinner/> }

      { userError && <WarningText error={ userError }/> }
      { fileRangeError && <WarningText error={ fileRangeError }/> }

      { (!isLoadingUsers && !isLoadingFileRanges) && progress.length === 0 && <IonNote>No annotators</IonNote> }

      { progress.length > 0 &&
          <Table columns={ 2 } className={ styles.table }>
              <TableHead isFirstColumn={ true } className={ [ styles.sortedHead, styles.stickyHead ].join(' ') }
                         onClick={ toggleAnnotatorSort }>
                  <p>Annotator</p>
                  <IonIcon
                      className={ [ styles.up, sort?.entry === 'Annotator' && sort.sort === 'ASC' ? styles.active : '' ].join(' ') }
                      icon={ caretUp }/>
                  <IonIcon
                      className={ [ styles.down, sort?.entry === 'Annotator' && sort.sort === 'DESC' ? styles.active : '' ].join(' ') }
                      icon={ caretDown }/>
              </TableHead>
              <TableHead className={ [ styles.sortedHead, styles.stickyHead ].join(' ') }
                         onClick={ toggleProgressSort }>
                  <p>Progress</p>
                  <IonIcon
                      className={ [ styles.up, sort?.entry === 'Progress' && sort.sort === 'ASC' ? styles.active : '' ].join(' ') }
                      icon={ caretUp }/>
                  <IonIcon
                      className={ [ styles.down, sort?.entry === 'Progress' && sort.sort === 'DESC' ? styles.active : '' ].join(' ') }
                      icon={ caretDown }/>
              </TableHead>

            { progress.sort(sortProgress).map(p => {
              return (
                <Fragment key={ p.user.displayName }>
                  <TableDivider/>
                  <TableContent
                    isFirstColumn={ true }>{ p.user.displayName }&nbsp;{ p.user.expertise &&
                      <Fragment>( { p.user.expertise } )</Fragment> }</TableContent>
                  <TableContent className={ styles.progressContent }>
                    <div>
                      { p.ranges.map(r => (
                        <Fragment key={ r.id }>
                          <p>{ r.firstFileIndex }</p>
                          <Progress value={ r.completedAnnotationTasks?.totalCount ?? 0 }
                                    total={ r.spectrograms?.totalCount ?? 0 }
                                    color={ r.completedAnnotationTasks?.totalCount === r.spectrograms?.totalCount ? 'success' : 'medium' }/>
                          <p>{ r.lastFileIndex }</p>
                        </Fragment>
                      )) }
                      <p className={ styles.total }>{ p.progress }%</p>
                    </div>
                  </TableContent>
                </Fragment>
              );
            }) }
          </Table> }

      { phase?.canManage && users && allFileRanges && (
        <ModalFooter className={ styles.footer }>
          <div className={ styles.buttons }>
            { progress.length > 0 && <Fragment>
                <Link href={ DOWNLOAD_ANNOTATIONS(phase.id) }>
                    <IonIcon icon={ downloadOutline } slot="start"/>
                    Results (csv)
                </Link>

                <Link href={ DOWNLOAD_PROGRESS(phase.id) }>
                    <IonIcon icon={ downloadOutline } slot="start"/>
                    Status (csv)
                </Link>
            </Fragment> }
          </div>
        </ModalFooter>
      ) }
    </Modal>
  )
}

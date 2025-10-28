import React, { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import styles from './styles.module.scss';
import { Head, Table, TableDivider, TableHead, useToast, WarningText } from '@/components/ui';
import { IonButton, IonNote, IonSkeletonText, IonSpinner } from '@ionic/react';
import { getNewItemID } from '@/service/function';
import { FormBloc, type Item, ListSearchbar } from '@/components/form';
import {
  AnnotationFileRangeInput,
  useAllFileRanges,
  useAllUsers,
  useCurrentCampaign,
  useCurrentPhase,
  useUpdateFileRanges,
} from '@/api';
import { useNavigate } from 'react-router-dom';
import { QueryStatus } from '@reduxjs/toolkit/query';
import { FileRangeInputRow } from '@/features/AnnotationFileRange';
import { useNavParams } from '@/features/UX';

type SearchItem = {
  type: 'user' | 'group';
  id: string;
  display: string;
}

type FileRange = Omit<AnnotationFileRangeInput, 'id'> & {
  id: string;
  started?: boolean;
}

export const EditAnnotators: React.FC = () => {
  const { campaignID, phaseType } = useNavParams();
  const {
    campaign,
    isFetching: isFetchingCampaign,
    error: errorLoadingCampaign,
  } = useCurrentCampaign();
  const { phase } = useCurrentPhase()
  const navigate = useNavigate();
  const toast = useToast();
  const {
    users, groups,
    isFetching: isFetchingUsers,
    error: errorLoadingUsers,
  } = useAllUsers()
  const {
    allFileRanges,
    isFetching: isFetchingFileRanges,
    error: errorLoadingFileRanges,
  } = useAllFileRanges()
  const {
    updateFileRanges,
    isLoading: isSubmitting,
    error: errorSubmitting,
    formErrors,
    status: submissionStatus,
  } = useUpdateFileRanges()
  const [force, setForce] = useState<boolean>()

  // File ranges
  const [fileRanges, setFileRanges] = useState<FileRange[]>([]);
  const availableUsers: SearchItem[] = useMemo(() => {
    const items: SearchItem[] = [];
    if (users) {
      items.push(...users.filter(u => {
        if (!campaign?.spectrograms) return true;
        const count = fileRanges
            .filter(f => f.annotatorId === u!.id)
            .reduce((count, range) => {
              const last_index = range.lastFileIndex ?? campaign.spectrograms!.totalCount ?? 0;
              const first_index = range.firstFileIndex ?? 0;
              return count + (last_index - first_index)
            }, 0) + 1
        return count < campaign.spectrograms.totalCount
      }).map(u => ({ id: u!.id, display: u!.displayName, type: 'user' } as SearchItem)));
    }
    if (groups) {
      items.push(...groups.map(g => ({ id: g!.id, display: g!.name, type: 'group' } as SearchItem)))
    }
    return items;
  }, [users, campaign, fileRanges, groups]);
  useEffect(() => {
    if (allFileRanges) setFileRanges(allFileRanges.map(r => ({
      id: r!.id,
      annotatorId: r!.annotator.id,
      firstFileIndex: r!.firstFileIndex,
      lastFileIndex: r!.lastFileIndex,
      started: !!r!.completedAnnotationTasks?.totalCount,
    })));
  }, [allFileRanges]);
  const addFileRange = useCallback((item: Item) => {
    if (!groups || !campaign?.spectrograms) return;
    const [type, id] = (item.value as string).split('-');
    const users = []
    switch (type!) {
      case 'user':
        users.push(availableUsers.find(a => a.type === 'user' && a.id === id)!);
        break;
      case 'group':
        users.push(...groups.find(g => g!.id === id)!.users!.filter(u => availableUsers.find(a => a.type === 'user' && a.id === u?.id)));
        break
    }
    for (const newUser of users) {
      setFileRanges(prev => [...prev, {
        id: getNewItemID(prev)?.toString(),
        annotator: newUser!.id,
        firstFileIndex: 0,
        lastFileIndex: campaign.spectrograms!.totalCount - 1,
      }])
    }
  }, [groups, availableUsers, setFileRanges, campaign])
  const updateFileRange = useCallback((fileRange: FileRange) => {
    setFileRanges(prev => prev.map(f => {
      if (f.id !== fileRange.id) return f;
      return { ...f, ...fileRange }
    }))
  }, [])
  const removeFileRange = useCallback((fileRange: FileRange) => {
    setFileRanges(prev => prev.filter(f => f.id !== fileRange.id))
  }, [])

  // Navigation
  const back = useCallback(() => navigate(-1), [])

  // Submit
  const submit = useCallback(() => {
    if (!phaseType || !campaignID) return;
    updateFileRanges({ campaignID, phaseType, fileRanges, force })
  }, [fileRanges, campaignID, phaseType, updateFileRanges, force])
  useEffect(() => {
    if (errorSubmitting) toast.raiseError({ error: errorSubmitting })
  }, [errorSubmitting]);
  useEffect(() => {
    if (submissionStatus === QueryStatus.fulfilled) back()
  }, [submissionStatus]);

  return <Fragment>

    <Head title="Manage annotators"
          subtitle={ campaign ? `${ campaign.name } - ${ phaseType }` :
              <IonSkeletonText animated style={ { width: 128 } }/> }/>

    <FormBloc className={ styles.annotators }>

      <ListSearchbar placeholder="Search annotator..."
                     values={ availableUsers.map(a => ({ value: `${ a.type }-${ a.id }`, label: a.display })) }
                     onValueSelected={ addFileRange }/>

      {/* Loading */ }
      { (isFetchingCampaign || isFetchingUsers || isFetchingFileRanges) && <IonSpinner/> }
      { errorLoadingCampaign &&
          <WarningText message="Fail loading campaign" error={ errorLoadingCampaign }/> }
      { errorLoadingUsers &&
          <WarningText message="Fail loading users" error={ errorLoadingUsers }/> }
      { errorLoadingFileRanges &&
          <WarningText message="Fail loading file ranges" error={ errorLoadingFileRanges }/> }

      { fileRanges && campaign?.spectrograms && users && groups &&
          <Table columns={ 3 } className={ styles.table }>
              <TableHead isFirstColumn={ true } topSticky>Annotator</TableHead>
              <TableHead className={ styles.fileRangeHead } topSticky>
                  File range
                  <small>(between 1 and { campaign.spectrograms.totalCount })</small>
                  <small className="disabled"><i>Start and end limits are included</i></small>
              </TableHead>
              <TableHead topSticky/>
              <TableDivider/>
            { fileRanges.map((range, k) => <FileRangeInputRow key={ k }
                                                              range={ range }
                                                              errors={ formErrors[k] ?? undefined }
                                                              annotator={ users.find(u => u?.id === range.annotatorId)! }
                                                              onUpdate={ change => {
                                                                updateFileRange({
                                                                  ...range,
                                                                  ...change,
                                                                })
                                                              } }
                                                              setForced={ () => setForce(true) }
                                                              onDelete={ removeFileRange }/>) }

            { fileRanges.length === 0 && <IonNote color="medium">No annotators</IonNote> }
          </Table>
      }

      { phase?.phase === 'Verification' &&
          <IonNote>To fully verify your annotations, you should have a verification user that is not an annotator or
              at
              least two verification users</IonNote> }

      <div className={ styles.buttons }>
        <IonButton color="medium" fill="outline" onClick={ back }>
          Back to campaign
        </IonButton>
        { isSubmitting && <IonSpinner/> }
        <IonButton disabled={ isSubmitting } onClick={ submit }>
          Update annotators
        </IonButton>
      </div>

    </FormBloc>
  </Fragment>
}

import React, { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import styles from './styles.module.scss';
import { useNavigate } from "react-router-dom";
import { useAlert, useToast } from "@/service/ui";
import { IonButton, IonIcon, IonNote, IonSkeletonText, IonSpinner } from "@ionic/react";
import { getErrorMessage, getNewItemID } from "@/service/function.ts";
import { QueryStatus } from "@reduxjs/toolkit/query";
import { Table, TableContent, TableDivider, TableHead, WarningText } from "@/components/ui";
import { FormBloc, Input, Searchbar } from "@/components/form";
import { lockClosedOutline, trashBinOutline } from "ionicons/icons";
import { Item } from "@/types/item.ts";
import { useRetrieveCurrentCampaign } from "@/service/api/campaign.ts";
import {
  AnnotationFileRangeAPI,
  PostAnnotationFileRange,
  useListFileRangesForCurrentPhase
} from "@/service/api/annotation-file-range.ts";
import { useRetrieveCurrentPhase } from "@/service/api/campaign-phase.ts";
import { Head } from "@/components/ui/Page.tsx";
import { useUsers } from "@/features/auth/api";
import { UserNode } from "@/features/_utils_";

type SearchItem = {
  type: 'user' | 'group';
  pk: number;
  display: string;
}

export const EditAnnotators: React.FC = () => {
  const {
    campaignID,
    campaign,
    isFetching: isFetchingCampaign,
    error: errorLoadingCampaign,
  } = useRetrieveCurrentCampaign();
  const { phaseType, phase } = useRetrieveCurrentPhase()
  const navigate = useNavigate();
  const toast = useToast();
  const {
    users,
    groups,
    isFetching: isFetchingUsers,
    error: errorLoadingUsers
  } = useUsers()
  const {
    fileRanges: initialFileRanges,
    isFetching: isFetchingFileRanges,
    error: errorLoadingFileRanges
  } = useListFileRangesForCurrentPhase()
  const [ postFileRanges, {
    isLoading: isSubmitting,
    error: errorSubmitting,
    status: submissionStatus
  } ] = AnnotationFileRangeAPI.endpoints.postFileRange.useMutation()

  // File ranges
  const [ fileRanges, setFileRanges ] = useState<Array<PostAnnotationFileRange & {
    finished_tasks_count?: number
  }>>([]);
  const availableUsers: SearchItem[] = useMemo(() => {
    const items: SearchItem[] = [];
    if (users) {
      items.push(...users.filter(u => {
        if (!campaign) return true;
        const count = fileRanges
          .filter(f => f.annotator === u.pk)
          .reduce((count, range) => {
            const last_index = range.last_file_index ?? campaign?.files_count ?? 0;
            const first_index = range.first_file_index ?? 0;
            return count + (last_index - first_index)
          }, 0) + 1
        return count < campaign.files_count
      }).map(u => ({ pk: u.pk, display: u.displayName, type: 'user' } satisfies SearchItem)));
    }
    if (groups) {
      items.push(...groups.map(g => ({ pk: g.pk, display: g.name, type: 'group' } satisfies SearchItem)))
    }
    return items;
  }, [ users, campaign, fileRanges, groups ]);
  const [ isForced, setIsForced ] = useState<boolean | undefined>();
  useEffect(() => {
    if (initialFileRanges) setFileRanges(initialFileRanges);
  }, [ initialFileRanges ]);
  const addFileRange = useCallback((item: Item) => {
    if (!groups) return;
    const [ type, id ] = (item.value as string).split('-');
    const users = []
    switch (type!) {
      case 'user':
        users.push(availableUsers.find(a => a.type === 'user' && a.pk === +id)!);
        break;
      case 'group':
        users.push(...groups.find(g => g.pk === +id)!.annotators.edges.filter(e => availableUsers.find(a => a.type === 'user' && a.pk === e?.node?.pk)).map(e => e!.node!));
        break
    }
    for (const newUser of users) {
      setFileRanges(prev => [ ...prev, { id: getNewItemID(prev), annotator: newUser.pk, } ])
    }
  }, [ groups, availableUsers, setFileRanges ])
  const updateFileRange = useCallback((fileRange: PostAnnotationFileRange) => {
    setFileRanges(prev => prev.map(f => {
      if (f.id !== fileRange.id) return f;
      return { ...f, ...fileRange }
    }))
  }, [])
  const removeFileRange = useCallback((fileRange: PostAnnotationFileRange) => {
    setFileRanges(prev => prev.filter(f => f.id !== fileRange.id))
  }, [])

  // Navigation
  const back = useCallback(() => navigate(-1), [])

  // Submit
  const submit = useCallback(() => {
    if (!phaseType || !campaign || !campaignID) return;
    postFileRanges({
      campaignID,
      phaseType,
      filesCount: campaign.files_count,
      data: fileRanges,
      force: isForced
    })
  }, [ fileRanges, campaignID, phaseType, campaign, isForced ])
  useEffect(() => {
    if (errorSubmitting) toast.presentError(errorSubmitting)
  }, [ errorSubmitting ]);
  useEffect(() => {
    if (submissionStatus === QueryStatus.fulfilled) back()
  }, [ submissionStatus ]);

  return <Fragment>

    <Head title='Manage annotators'
          subtitle={ campaign ? `${ campaign.name } - ${ phaseType }` :
            <IonSkeletonText animated style={ { width: 128 } }/> }/>

    <FormBloc className={ styles.annotators }>

      <Searchbar placeholder="Search annotator..."
                 values={ availableUsers.map(a => ({ value: `${ a.type }-${ a.pk }`, label: a.display })) }
                 onValueSelected={ addFileRange }/>

      {/* Loading */ }
      { (isFetchingCampaign || isFetchingUsers || isFetchingFileRanges) && <IonSpinner/> }
      { errorLoadingCampaign &&
          <WarningText>Fail loading campaign:<br/>{ getErrorMessage(errorLoadingCampaign) }</WarningText> }
      { errorLoadingUsers &&
          <WarningText>Fail loading users:<br/>{ getErrorMessage(errorLoadingUsers) }</WarningText> }
      { errorLoadingFileRanges &&
          <WarningText>Fail loading file ranges:<br/>{ getErrorMessage(errorLoadingFileRanges) }</WarningText> }

      { fileRanges && campaign && users && groups &&
          <Table columns={ 3 } className={ styles.table }>
              <TableHead isFirstColumn={ true } topSticky>Annotator</TableHead>
              <TableHead className={ styles.fileRangeHead } topSticky>
                  File range
                  <small>(between 1 and { campaign.files_count })</small>
                  <small className="disabled"><i>Start and end limits are included</i></small>
              </TableHead>
              <TableHead topSticky/>
              <TableDivider/>
            { fileRanges.map(range => <AnnotatorRangeLine key={ range.id }
                                                          range={ range }
                                                          setIsForced={ setIsForced }
                                                          annotator={ users.find(u => u.pk === range.annotator)! }
                                                          filesCount={ campaign.files_count }
                                                          onFirstIndexChange={ first_file_index => updateFileRange({
                                                            id: range.id,
                                                            first_file_index,
                                                            annotator: range.annotator
                                                          }) }
                                                          onLastIndexChange={ last_file_index => updateFileRange({
                                                            id: range.id,
                                                            last_file_index,
                                                            annotator: range.annotator
                                                          }) }
                                                          onDelete={ () => removeFileRange(range) }
            />) }
            { fileRanges.length === 0 && <IonNote color='medium'>No annotators</IonNote> }
          </Table>
      }

      { phase?.phase === 'Verification' &&
          <IonNote>To fully verify your annotations, you should have a verification user that is not an annotator or
              at
              least two verification users</IonNote> }

      <div className={ styles.buttons }>
        <IonButton color='medium' fill='outline' onClick={ back }>
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

const AnnotatorRangeLine: React.FC<{
  range: PostAnnotationFileRange & { finished_tasks_count?: number },
  annotator: Pick<UserNode, 'displayName' | 'expertise'>,
  filesCount: number,
  onFirstIndexChange: (index: number) => void,
  onLastIndexChange: (index: number) => void,
  onDelete: () => void,
  setIsForced?: (value: true) => void
}> = ({ range, annotator, filesCount, onFirstIndexChange, onLastIndexChange, onDelete, setIsForced }) => {
  const [ isLocked, setIsLocked ] = useState<boolean>(!!range.finished_tasks_count);
  const alert = useAlert();

  function unlock() {
    alert.showAlert({
      type: 'Warning',
      message: `This annotator has already started to annotated. By updating its file range you could remove some annotations he/she made. Are you sure?`,
      actions: [
        {
          label: `Update file range`,
          callback: () => {
            setIsLocked(false)
            if (setIsForced) setIsForced(true)
          }
        },
      ]
    })
  }

  return (
    <Fragment key={ range.id }>
      <TableContent isFirstColumn={ true }>
        { annotator.displayName }&nbsp;{ annotator.expertise && <Fragment>( { annotator.expertise } )</Fragment> }
      </TableContent>
      <TableContent>
        <div className={ styles.fileRangeCell }>
          <Input type="number"
                 value={ range.first_file_index ?? '' }
                 onChange={ e => onFirstIndexChange(+e.target.value) }
                 placeholder="1"
                 min={ 1 } max={ filesCount }
                 disabled={ filesCount === undefined || isLocked }/>
          -
          <Input type="number"
                 value={ range.last_file_index ?? '' }
                 onChange={ e => onLastIndexChange(+e.target.value) }
                 placeholder={ filesCount?.toString() }
                 min={ 1 } max={ filesCount }
                 disabled={ filesCount === undefined || isLocked }/>
        </div>
      </TableContent>
      <TableContent>
        { isLocked ? <IonButton color='medium' fill='outline'
                                data-tooltip={ 'This user as already started to annotate' }
                                className={ [ styles.annotatorButton, 'tooltip-right' ].join(' ') }
                                onClick={ unlock }>
          <IonIcon icon={ lockClosedOutline }/>
        </IonButton> : <IonButton color="danger"
                                  className={ styles.annotatorButton }
                                  onClick={ onDelete }>
          <IonIcon icon={ trashBinOutline }/>
        </IonButton> }
      </TableContent>
      <TableDivider/>
    </Fragment>
  )
}

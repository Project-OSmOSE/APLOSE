import React, { ChangeEvent, Fragment, useMemo, useState } from 'react';
import { TableContent, TableDivider, useAlert } from '@/components/ui';
import styles from '@/view/annotation-campaign/[campaignID]/phase/[phaseType]/edit-annotators/styles.module.scss';
import { Input } from '@/components/form';
import { IonButton, IonIcon } from '@ionic/react';
import { lockClosedOutline, trashBinOutline } from 'ionicons/icons/index.js';
import { AnnotationFileRangeInput, ErrorType, useCurrentCampaign, UserNode } from '@/api';

type FileRange = Omit<AnnotationFileRangeInput, 'id'> & {
  id: string;
  started?: boolean;
}
type Annotator = Pick<UserNode, 'id' | 'displayName' | 'expertise'>

export const FileRangeInputRow: React.FC<{
  range: FileRange,
  annotator: Annotator,
  onUpdate: (range: Partial<Pick<FileRange, 'firstFileIndex' | 'lastFileIndex'>>) => void;
  onDelete: (range: FileRange) => void;
  setForced?: () => void;
  errors?: Array<ErrorType>
}> = ({ range, annotator, onUpdate, onDelete, setForced, errors }) => {
  const { campaign } = useCurrentCampaign();
  const [isLocked, setIsLocked] = useState<boolean>(range.started ?? false);
  const alert = useAlert();
  const filesCount = useMemo(() => campaign?.spectrograms?.totalCount, [campaign])

  function unlock() {
    alert.showAlert({
      type: 'Warning',
      message: `This annotator has already started to annotated. By updating its file range you could remove some annotations he/she made. Are you sure?`,
      actions: [
        {
          label: `Update file range`,
          callback: () => {
            setIsLocked(false)
            if (setForced) setForced()
          },
        },
      ],
    })
  }

  return (
      <Fragment key={ range.id }>
        <TableContent isFirstColumn={ true }>
          { annotator.displayName }&nbsp;{ annotator.expertise &&
            <Fragment>( { annotator.expertise } )</Fragment> }
        </TableContent>
        <TableContent>
          <div className={ styles.fileRangeCell }>
            <Input type="number"
                   value={ range.firstFileIndex ?? '' }
                   error={ errors?.find(e => e.field === 'firstFileIndex')?.messages.join(' ') }
                   onChange={ (e: ChangeEvent<HTMLInputElement>) => onUpdate({ firstFileIndex: e.target.valueAsNumber }) }
                   placeholder="1"
                   min={ 1 } max={ filesCount }
                   disabled={ filesCount === undefined || isLocked }/>
            -
            <Input type="number"
                   value={ range.lastFileIndex ?? '' }
                   error={ errors?.find(e => e.field === 'lastFileIndex')?.messages.join(' ') }
                   onChange={ (e: ChangeEvent<HTMLInputElement>) => onUpdate({ lastFileIndex: e.target.valueAsNumber }) }
                   placeholder={ filesCount?.toString() }
                   min={ 1 } max={ filesCount }
                   disabled={ filesCount === undefined || isLocked }/>
          </div>
        </TableContent>
        <TableContent>
          { isLocked ? <IonButton color="medium" fill="outline"
                                  data-tooltip={ 'This user as already started to annotate' }
                                  className={ [styles.annotatorButton, 'tooltip-right'].join(' ') }
                                  onClick={ unlock }>
            <IonIcon icon={ lockClosedOutline }/>
          </IonButton> : <IonButton color="danger"
                                    className={ styles.annotatorButton }
                                    onClick={ () => onDelete(range) }>
            <IonIcon icon={ trashBinOutline }/>
          </IonButton> }
        </TableContent>
        <TableDivider/>
      </Fragment>
  )
}
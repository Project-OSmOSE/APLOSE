import {
  AnnotationNodeNodeConnection,
  AnnotationTaskNode,
  AnnotationTaskStatus,
  SpectrogramNode,
  useCurrentPhase,
} from '@/api';
import React, { Fragment, useMemo } from 'react';
import { Button, TableContent, TableDivider } from '@/components/ui';
import { IonIcon } from '@ionic/react';
import { checkmarkCircle, chevronForwardOutline, ellipseOutline } from 'ionicons/icons';
import styles from '@/view/annotation-campaign/[campaignID]/phase/[phaseType]/styles.module.scss';
import { useAnnotatorCanNavigate } from '@/features/Annotator';

export const TaskRow: React.FC<{
  task: Pick<AnnotationTaskNode, 'status'>
  spectrogram: Pick<SpectrogramNode, 'id' | 'filename' | 'start' | 'duration'>
  annotations: Pick<AnnotationNodeNodeConnection, 'totalCount'>;
  validatedAnnotations: Pick<AnnotationNodeNodeConnection, 'totalCount'>;
}> = ({ task, spectrogram, annotations, validatedAnnotations }) => {
  const { phase } = useCurrentPhase()
  const { openAnnotator } = useAnnotatorNavigation()

  const submitted = useMemo(() => task.status === AnnotationTaskStatus.Finished, [ task ])
  const start = useMemo(() => new Date(spectrogram.start), [ spectrogram ])
  const duration = useMemo(() => new Date(spectrogram.duration), [ spectrogram ])

  return <Fragment>
    <TableContent isFirstColumn={ true } disabled={ submitted }>{ spectrogram.filename }</TableContent>
    <TableContent disabled={ submitted }>{ start.toUTCString() }</TableContent>
    <TableContent disabled={ submitted }>{ duration.toUTCString().split(' ')[4] }</TableContent>
    <TableContent disabled={ submitted }>{ annotations.totalCount }</TableContent>
    { phase?.phase == 'Verification' &&
        <TableContent disabled={ submitted }>{ validatedAnnotations.totalCount }</TableContent> }
    <TableContent disabled={ submitted }>
      { submitted &&
          <IonIcon icon={ checkmarkCircle } className={ styles.statusIcon } color="primary"/> }
      { !submitted &&
          <IonIcon icon={ ellipseOutline } className={ styles.statusIcon } color="medium"/> }
    </TableContent>
    <TableContent disabled={ submitted }>
      <Button color="dark" fill="clear" size="small" className={ styles.submit }
              onClick={ () => openAnnotator(spectrogram.id) }>
        <IonIcon icon={ chevronForwardOutline } color="primary" slot="icon-only"/>
      </Button>
    </TableContent>
    <TableDivider/>
  </Fragment>
}
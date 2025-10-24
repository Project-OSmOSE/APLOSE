import {
  AnnotationNodeNodeConnection,
  type AnnotationSpectrogramNode,
  AnnotationTaskNode,
  AnnotationTaskStatus,
  useCurrentPhase,
} from '@/api';
import React, { Fragment, useMemo } from 'react';
import { Button, TableContent, TableDivider } from '@/components/ui';
import { IonIcon } from '@ionic/react';
import { checkmarkCircle, chevronForwardOutline, ellipseOutline } from 'ionicons/icons/index.js';
import { useOpenAnnotator } from '@/features/Annotator/Navigation';

export const SpectrogramRow: React.FC<{
  spectrogram: Pick<AnnotationSpectrogramNode, 'id' | 'filename' | 'duration' | 'start'>,
  task: Pick<AnnotationTaskNode, 'status'>,
  annotations: Pick<AnnotationNodeNodeConnection, 'totalCount'>;
  validatedAnnotations: Pick<AnnotationNodeNodeConnection, 'totalCount'>;
}> = ({ spectrogram, task, annotations, validatedAnnotations }) => {
  const { phase } = useCurrentPhase()
  const { openAnnotator } = useOpenAnnotator()

  const submitted = useMemo(() => task.status === AnnotationTaskStatus.Finished, [task])
  const start = useMemo(() => new Date(spectrogram.start), [spectrogram])
  const duration = useMemo(() => new Date(spectrogram.duration), [spectrogram])

  return <Fragment>
    <TableContent isFirstColumn={ true } disabled={ submitted }>{ spectrogram.filename }</TableContent>
    <TableContent disabled={ submitted }>{ start.toUTCString() }</TableContent>
    <TableContent disabled={ submitted }>{ duration.toUTCString().split(' ')[4] }</TableContent>
    <TableContent disabled={ submitted }>{ annotations.totalCount }</TableContent>
    { phase?.phase == 'Verification' &&
        <TableContent disabled={ submitted }>{ validatedAnnotations.totalCount }</TableContent> }
    <TableContent disabled={ submitted }>
      { submitted &&
          <IonIcon icon={ checkmarkCircle } color="primary"/> }
      { !submitted &&
          <IonIcon icon={ ellipseOutline } color="medium"/> }
    </TableContent>
    <TableContent disabled={ submitted }>
      <Button color="dark" fill="clear" size="small"
              data-testid="access-button"
              onClick={ () => openAnnotator(spectrogram.id) }>
        <IonIcon icon={ chevronForwardOutline } color="primary" slot="icon-only"/>
      </Button>
    </TableContent>
    <TableDivider/>
  </Fragment>
}
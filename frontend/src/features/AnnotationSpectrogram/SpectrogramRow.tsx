import {
  AnnotationNodeNodeConnection,
  type AnnotationSpectrogramNode,
  AnnotationTaskNode,
  AnnotationTaskStatus,
  type Maybe,
  useCurrentPhase,
} from '@/api';
import React, { Fragment, useMemo } from 'react';
import { Button, TableContent, TableDivider } from '@/components/ui';
import { IonIcon } from '@ionic/react';
import { checkmarkCircle, chevronForwardOutline, ellipseOutline } from 'ionicons/icons/index.js';
import { useOpenAnnotator } from '@/features/Annotator/Navigation';
import { formatTime } from '@/service/function';

export const SpectrogramRow: React.FC<{
  spectrogram: Pick<AnnotationSpectrogramNode, 'id' | 'filename' | 'duration' | 'start'>,
  task?: Maybe<Pick<AnnotationTaskNode, 'status'>>,
  userAnnotations?: Maybe<Pick<AnnotationNodeNodeConnection, 'totalCount'>>;
  annotationsToCheck?: Maybe<Pick<AnnotationNodeNodeConnection, 'totalCount'>>;
  validAnnotationsToCheck?: Maybe<Pick<AnnotationNodeNodeConnection, 'totalCount'>>;
}> = ({ spectrogram, task, userAnnotations, annotationsToCheck, validAnnotationsToCheck }) => {
  const { phase } = useCurrentPhase()
  const openAnnotator = useOpenAnnotator()

  const submitted = useMemo(() => task?.status === AnnotationTaskStatus.Finished, [ task ])
  const start = useMemo(() => new Date(spectrogram.start), [ spectrogram ])

  const allAnnotationsCount = useMemo(() => {
    return (userAnnotations?.totalCount ?? 0) + (annotationsToCheck?.totalCount ?? 0)
  }, [userAnnotations, annotationsToCheck])

  const validAnnotationsCount = useMemo(() => {
    return (userAnnotations?.totalCount ?? 0) + (validAnnotationsToCheck?.totalCount ?? 0)
  }, [userAnnotations, validAnnotationsToCheck])

  return <Fragment>
    <TableContent isFirstColumn={ true } disabled={ submitted }>{ spectrogram.filename }</TableContent>
    <TableContent disabled={ submitted }>{ start.toUTCString() }</TableContent>
    <TableContent disabled={ submitted }>{ formatTime(spectrogram.duration) }</TableContent>
    <TableContent disabled={ submitted }>{ allAnnotationsCount }</TableContent>
    { phase?.phase == 'Verification' &&
        <TableContent disabled={ submitted }>{ validAnnotationsCount }</TableContent> }
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
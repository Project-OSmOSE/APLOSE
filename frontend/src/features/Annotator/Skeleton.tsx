import React, { Fragment, ReactNode, useCallback } from 'react';
import { Footer, Header } from '@/components/layout';
import { Link, Progress } from '@/components/ui';
import { IonIcon, IonNote } from '@ionic/react';
import { helpBuoyOutline } from 'ionicons/icons/index.js';
import styles from './styles.module.scss';
import { IoCheckmarkCircleOutline, IoChevronForwardOutline } from 'react-icons/io5';
import { AnnotationTaskStatus, useAnnotationTask, useCurrentCampaign, useCurrentPhase } from '@/api';
import { gqlAPI } from '@/api/baseGqlApi';
import { useAppDispatch } from '@/features/App';
import { useAnnotatorCanNavigate } from '@/features/Annotator/Navigation';
import { AnnotatorCanvasContextProvider } from '@/features/Annotator/Canvas';
import { useNavParams } from '@/features/UX';

export const AnnotatorSkeleton: React.FC<{ children?: ReactNode }> = ({ children }) => {
  const { campaignID, phaseType } = useNavParams();
  const { campaign } = useCurrentCampaign()
  const { phase } = useCurrentPhase()
  const { spectrogram, isEditionAuthorized, navigationInfo } = useAnnotationTask();
  const { canNavigate } = useAnnotatorCanNavigate()
  const dispatch = useAppDispatch()

  const onBack = useCallback(() => {
    dispatch(gqlAPI.util.invalidateTags([{
      type: 'AnnotationPhase',
      id: phase?.id,
    }]))
  }, [phase])

  // 'page' class is for playwright tests
  return <AnnotatorCanvasContextProvider>
    <div className={ [styles.page, 'page'].join(' ') }>
      <Header size="small"
              canNavigate={ canNavigate }
              buttons={ <Fragment>

                { campaign?.instructionsUrl &&
                    <Link color="medium" target="_blank"
                          href={ campaign?.instructionsUrl }>
                        <IonIcon icon={ helpBuoyOutline }
                                 slot="start"/>
                        Campaign instructions
                    </Link>
                }

                <Link color="medium" fill="outline"
                      size="small"
                      onClick={ onBack }
                      appPath={ `/annotation-campaign/${ campaignID }/phase/${ phaseType }` }>
                  Back to campaign
                </Link>
              </Fragment> }>

        { spectrogram && campaign && <div className={ styles.info }>
            <p>
              { campaign.name }
                <IoChevronForwardOutline/> { spectrogram.filename } { spectrogram.task?.status === AnnotationTaskStatus.Finished &&
                <IoCheckmarkCircleOutline/> }
            </p>
          { isEditionAuthorized && navigationInfo?.totalCount &&
              <Progress label="Position"
                        className={ styles.progress }
                        value={ (navigationInfo.currentIndex ?? 0) + 1 }
                        total={ navigationInfo.totalCount }/> }
          { campaign?.archive ? <IonNote>You cannot annotate an archived campaign.</IonNote> :
              phase?.endedAt ? <IonNote>You cannot annotate an ended phase.</IonNote> :
                  !spectrogram.isAssigned ? <IonNote>You are not assigned to annotate this file.</IonNote> :
                      <Fragment/>
          }
        </div> }

      </Header>

      { children }

      <Footer/>
    </div>
  </AnnotatorCanvasContextProvider>
}

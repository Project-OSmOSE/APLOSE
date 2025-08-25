import React, { useCallback, useMemo, useState } from "react";
import styles from "./styles.module.scss";
import { useFileFilters } from "@/service/slices/filter.ts";

import { IonButton, IonIcon } from "@ionic/react";
import { ActionBar } from "@/components/layout";
import { refreshOutline } from "ionicons/icons";
import {
  ImportAnnotationsButton,
  ManageAnnotatorsButton,
  PhaseGlobalProgress,
  PhaseUserProgress,
  ProgressModalButton,
  ResumeButton
} from "@/components/AnnotationCampaign/Phase";
import { Pagination, WarningText } from "@/components/ui";
import { SpectrogramTable } from "./Table.tsx";
import { usePhaseFileRanges } from "./hook.ts";
import { useParams } from "react-router-dom";
import { PhaseType } from "@/features/gql/api";

export const AnnotationCampaignPhaseDetail: React.FC = () => {
  const {
    campaignID,
    phaseType
  } = useParams<{ campaignID: string; phaseType: PhaseType }>();
  const [ page, setPage ] = useState<number>(1);
  const {
    pageCount,
    spectrograms,
    phase,
    error
  } = usePhaseFileRanges({ page, phaseType, campaignID })


  const { params, updateParams, clearParams } = useFileFilters(true)

  const isEmpty = useMemo(() => error || (spectrograms.length === 0) || phase?.annotationCampaign?.archive, [ error, spectrograms, phase ])

  const hasFilters = useMemo(() => Object.values(params).filter(v => v !== undefined).length > 0, [ params ]);
  const isResumeEnabled = useMemo(() => {
    return params.with_user_annotations === undefined && params.filename__icontains === undefined && params.is_submitted === undefined
  }, [ params ]);

  const updateSearch = useCallback((search: string) => {
    updateParams({ filename__icontains: search })
    setPage(1)
  }, [ updateParams ])

  const resetFilters = useCallback(() => {
    clearParams()
    setPage(1)
  }, [])

  return <div className={ styles.phase }>

    <div className={ [ styles.tasks, isEmpty ? styles.empty : '' ].join(' ') }>

      <ActionBar search={ params.filename__icontains }
                 searchPlaceholder="Search filename"
                 onSearchChange={ updateSearch }
                 actionButton={ <div className={ styles.filterButtons }>

                   { hasFilters && <IonButton fill='clear' color='medium' size='small' onClick={ resetFilters }>
                       <IonIcon icon={ refreshOutline } slot='start'/>
                       Reset
                   </IonButton> }

                   <div className={ styles.progress }>
                     <PhaseUserProgress phase={ phase }/>
                     <PhaseGlobalProgress phase={ phase }/>
                     <ProgressModalButton/>
                   </div>

                   <ManageAnnotatorsButton/>
                   <ImportAnnotationsButton/>

                   { !error && <ResumeButton files={ files } disabled={ !isResumeEnabled }/> }
                 </div> }/>

      { phase?.phase === 'Verification' && !phase.hasAnnotations &&
          <WarningText>
              Your campaign doesn't have any annotations to check
              <ImportAnnotationsButton/>
          </WarningText> }

      <SpectrogramTable page={ page } setPage={ setPage }/>

      <Pagination currentPage={ page } totalPages={ pageCount } setCurrentPage={ setPage }/>

      { spectrograms.length === 0 && <p>You have no files to annotate.</p> }
      { phase?.annotationCampaign.archive ? <p>The campaign is archived. No more annotation can be done.</p> :
        (phase?.endedAt && <p>The phase is ended. No more annotation can be done.</p>) }

    </div>
  </div>
}

import React, { Fragment, useCallback, useMemo } from "react";
import styles from "./styles.module.scss";
import { IonButton, IonIcon } from "@ionic/react";
import { peopleOutline, playOutline, refreshOutline } from "ionicons/icons";
import { ProgressModalButton } from "./ProgressModal";
import { ActionBar } from "@/components/layout";
import { useSpectrogramFilters } from "@/service/slices/filter.ts";
import { useRetrieveCurrentPhase } from "@/service/api/campaign-phase.ts";
import { Button, Link, Progress, TooltipOverlay } from "@/components/ui";
import { AnnotationFileRangeAPI } from "@/service/api/annotation-file-range.ts";
import { useRetrieveCurrentCampaign } from "@/service/api/campaign.ts";
import { useOpenAnnotator } from "@/service/annotator/hooks.ts";
import { ImportAnnotationsButton } from "./ImportAnnotationsButton";

export const SpectrogramActionBar: React.FC = () => {
  const { params, updateParams, clearParams } = useSpectrogramFilters(true)
  const { campaign, campaignID } = useRetrieveCurrentCampaign()
  const { phase, isEditable, phaseType } = useRetrieveCurrentPhase()
  const { currentData: files } = AnnotationFileRangeAPI.endpoints.listFilesWithPagination.useQuery({
    phaseID: phase?.id ?? -1,
    ...params
  }, { skip: !phase || !!campaign?.archive });
  const openAnnotator = useOpenAnnotator()

  const updateSearch = useCallback((search: string) => {
    updateParams({ filename__icontains: search })
  }, [ updateParams ])

  const hasFilters = useMemo(() => Object.entries(params).filter(([ k, v ]) => k !== 'page' && v !== undefined).length > 0, [ params ]);

  const resumeBtnTooltip: string = useMemo(() => {
    if (hasFilters) return 'Cannot resume if filters are activated'
    if (!files || files.count === 0) return 'No files to annotate'
    return 'Resume annotation'
  }, [ hasFilters, files ])

  const resume = useCallback(() => {
    if (!files?.resume) return;
    openAnnotator(files.resume)
  }, [ files, openAnnotator ])

  return <ActionBar search={ params.filename__icontains }
                    searchPlaceholder="Search filename"
                    onSearchChange={ updateSearch }
                    actionButton={ <div className={ styles.filterButtons }>

                      { hasFilters && <IonButton fill='clear' color='medium' size='small' onClick={ clearParams }>
                          <IonIcon icon={ refreshOutline } slot='start'/>
                          Reset
                      </IonButton> }

                      <div className={ styles.progress }>
                        { phase && phase.user_total > 0 && <Progress label='My progress'
                                                                     color='primary'
                                                                     value={ phase.user_progress }
                                                                     total={ phase.user_total }/> }
                        { phase && phase.global_total > 0 && <Progress label='Global progress'
                                                                       value={ phase.global_progress }
                                                                       total={ phase.global_total }/> }
                        <ProgressModalButton/>
                      </div>

                      { isEditable && <Fragment>
                        {/* Manage annotators */ }
                          <TooltipOverlay tooltipContent={ <p>Manage annotators</p> } anchor='right'>
                              <Link fill='outline' color='medium' aria-label='Manage'
                                    appPath={ `/annotation-campaign/${ campaignID }/phase/${ phaseType }/edit-annotators` }>
                                  <IonIcon icon={ peopleOutline } slot='icon-only'/>
                              </Link>
                          </TooltipOverlay>

                        {/* Import annotations */ }
                          <ImportAnnotationsButton/>
                      </Fragment> }

                      {/* Resume */ }
                      <TooltipOverlay tooltipContent={ <p>{ resumeBtnTooltip }</p> } anchor='right'>
                        <Button color="primary" fill='outline' aria-label='Resume'
                                disabled={ hasFilters || !(files && files.count > 0) || !files?.resume }
                                style={ { pointerEvents: 'unset' } }
                                onClick={ resume }>
                          <IonIcon icon={ playOutline } slot="icon-only"/>
                        </Button>
                      </TooltipOverlay>
                    </div> }/>
}
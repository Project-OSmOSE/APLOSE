import React, { Fragment } from "react";
import { PhaseType } from "@/features/annotation/annotationCampaign";
import { IonNote } from "@ionic/react";
import { Progress } from "@/components/ui";

export const AnnotationPhaseProgress: React.FC<{
  phase?: PhaseType | null
  finishedTasksCount?: number | null,
  tasksCount?: number | null,
  labeled?: true,
  className?: string;
}> = ({ phase, tasksCount, finishedTasksCount, className, labeled }) => {
  if (!tasksCount) return <Fragment/>;
  return <Fragment>
    { labeled && <IonNote color='medium'>{ phase } progress</IonNote> }
    <Progress className={ className }
              value={ finishedTasksCount ?? 0 }
              total={ tasksCount }/>
  </Fragment>
}
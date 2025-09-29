import React, { useMemo } from "react";
import styles from './styles.module.scss';
import { IonChip, IonIcon } from "@ionic/react";
import { checkmarkOutline } from "ionicons/icons";
import { TooltipOverlay } from "@/components/ui";
import { useAnnotatorConfidence, useAnnotatorQuery } from "@/features/Annotator";
import { ConfidenceNode } from "@/features/_utils_/gql/types.generated.ts";


export const ConfidenceIndicator: React.FC = () => {
  const { data } = useAnnotatorQuery();
  const indicators = useMemo(() => {
    return data?.annotationCampaignConfidenceSet?.confidenceIndicators?.results.filter(c => c !== null) ?? []
  }, [ data ]);

  if (!data?.annotationCampaignConfidenceSet) return <div/>;
  return (
    <TooltipOverlay title='Description' tooltipContent={ <p>{ data.annotationCampaignConfidenceSet.desc }</p> }>
      <div className={ [ styles.bloc, styles.confidence ].join(' ') }>
        <h6 className={ styles.header }>Confidence indicator</h6>
        <div className={ [ styles.body, styles.center ].join(' ') }>
          { indicators.map(confidence => (
            <Indicator key={ confidence.label } { ...confidence }/>
          )) }
        </div>
      </div>
    </TooltipOverlay>
  )
}

const Indicator: React.FC<Pick<ConfidenceNode, 'label'>> = ({ label }) => {
  const { selected, select } = useAnnotatorConfidence()
  const active = useMemo<boolean>(() => selected === label, [ selected, label ]);

  return <IonChip color="primary"
                  onClick={ () => select({ label }) }
                  className={ active ? styles.active : 'void' }> {/* 'void' className need to be sure the className change when item is not active anymore */ }
    { label }
    { active && <IonIcon src={ checkmarkOutline } color="light"/> }
  </IonChip>
}

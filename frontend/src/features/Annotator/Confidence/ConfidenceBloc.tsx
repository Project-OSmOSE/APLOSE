import React, { Fragment } from 'react';
import { Bloc, TooltipOverlay } from '@/components/ui';
import { useCurrentCampaign } from '@/api';
import { useAnnotatorConfidence } from './hooks';
import { ConfidenceChip } from './ConfidenceChip';

export const ConfidenceBloc: React.FC = () => {
  const { campaign } = useCurrentCampaign()
  const { allConfidences } = useAnnotatorConfidence()

  if (!campaign?.confidenceSet) return <Fragment/>
  return <TooltipOverlay title="Description"
                         tooltipContent={ campaign.confidenceSet.desc }>
    <Bloc header="Confidence indicator"
          centerBody>
      { allConfidences.map(c => <ConfidenceChip confidence={ c } key={ c }/>) }
    </Bloc>
  </TooltipOverlay>
}

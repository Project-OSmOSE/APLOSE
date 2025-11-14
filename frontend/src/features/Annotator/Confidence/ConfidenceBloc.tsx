import React, { Fragment } from 'react';
import { Bloc, TooltipOverlay } from '@/components/ui';
import { ConfidenceChip } from './ConfidenceChip';
import { useAppSelector } from '@/features/App';
import { selectAllConfidences, selectConfidenceSet } from '@/features/Annotator/Confidence/selectors';

export const ConfidenceBloc: React.FC = () => {
  const confidenceSet = useAppSelector(selectConfidenceSet)
  const allConfidences = useAppSelector(selectAllConfidences)

  if (!confidenceSet) return <Fragment/>
  return <TooltipOverlay title="Description"
                         tooltipContent={ confidenceSet.desc }>
    <Bloc header="Confidence indicator"
          centerBody>
      { allConfidences.map(c => <ConfidenceChip confidence={ c.label } key={ c.label }/>) }
    </Bloc>
  </TooltipOverlay>
}

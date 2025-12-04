import React, { Fragment } from 'react';
import { useCurrentCampaign } from '@/api';
import { useImportAnnotationsContext } from '@/features/ImportAnnotations/context';
import { type Item, Select } from '@/components/form';
import { IonNote } from '@ionic/react';

export const AnalysisSelect: React.FC = () => {
  const { allAnalysis } = useCurrentCampaign();
  const {
    analysisID,
    analysis,
    setAnalysisID,
  } = useImportAnnotationsContext()

  if (!allAnalysis) return <Fragment/>
  if (allAnalysis.length === 1) return <IonNote>Annotations belong to analysis { analysis?.name }</IonNote>
  return <Select value={ analysisID }
                 label="Spectrogram analysis"
                 data-testid="select-analysis"
                 options={ allAnalysis?.map(a => ({
                   value: a.id,
                   label: a.name,
                 } as Item)) ?? [] }
                 onValueSelected={ v => setAnalysisID(v as string) }
                 optionsContainer="popover"
                 required
                 placeholder="Select a spectrogram analysis"
                 note="Select the analysis on which the annotations were made"/>
}

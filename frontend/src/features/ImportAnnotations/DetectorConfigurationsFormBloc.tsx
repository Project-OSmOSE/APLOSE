import React, { Fragment } from 'react';
import { useImportAnnotationsContext } from '@/features/ImportAnnotations/context';
import { FormBloc } from '@/components/form';
import { DetectorConfigurationEntry } from './DetectorConfigurationEntry';

export const DetectorConfigurationsFormBloc: React.FC = () => {
  const { selectedDetectorsForImport, ...state } = useImportAnnotationsContext()

  if (state.fileState !== 'loaded') return <Fragment/>
  if (selectedDetectorsForImport.length === 0) return <Fragment/>
  return <FormBloc label="Detectors configurations">
    { selectedDetectorsForImport.map(initialName => <DetectorConfigurationEntry key={ initialName }
                                                                                initialName={ initialName }/>) }
  </FormBloc>
}

import React, { Fragment } from 'react';
import { useImportAnnotationsContext } from '@/features/ImportAnnotations/context';
import { FormBloc } from '@/components/form';
import { IonSpinner } from '@ionic/react';
import { WarningText } from '@/components/ui';
import { useAllDetectors } from '@/api/detector';
import { DetectorEntry } from './DetectorEntry';

export const DetectorsFormBloc: React.FC = () => {
  const { ...state } = useImportAnnotationsContext()
  const { isFetching, error } = useAllDetectors({
    skip: state.fileState !== 'loaded',
  })

  if (state.fileState !== 'loaded') return <Fragment/>
  if (isFetching) return <FormBloc label="Detectors"><IonSpinner/></FormBloc>
  if (error) return <FormBloc label="Detectors"><WarningText message="Fail loading known detectors"
                                                             error={ error }/></FormBloc>
  return <FormBloc label="Detectors">

    { state.fileDetectorNames.map(initialName => <DetectorEntry key={ initialName }
                                                                initialName={ initialName }/>) }
  </FormBloc>
}

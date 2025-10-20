import React, { Fragment } from 'react';
import { Progress } from '@/components/ui';
import { useImportAnnotationsContext } from './context';
import { UploadButtons } from './UploadButtons';
import { UploadTimeEstimation } from './UploadTimeEstimation';
import { UploadError } from './UploadError';

export const Upload: React.FC = () => {
  const { uploadedCount, annotations, ...state } = useImportAnnotationsContext()

  if (state.fileState === 'initial') return <UploadButtons/>
  return <Fragment>
    <Progress label="Upload" value={ uploadedCount } total={ annotations.length }/>

    <UploadTimeEstimation/>

    <UploadError/>

    <UploadButtons/>
  </Fragment>
}

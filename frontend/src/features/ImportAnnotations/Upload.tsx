import React, { Fragment } from 'react';
import { Progress } from '@/components/ui';
import { useImportAnnotationsContext } from './context';
import { UploadButtons } from './UploadButtons';
import { UploadTimeEstimation } from './UploadTimeEstimation';
import { UploadError } from './UploadError';

export const Upload: React.FC = () => {
  const { uploadedCount, filteredUploadAnnotations, fileState } = useImportAnnotationsContext()

  if (fileState === 'initial') return <UploadButtons/>
  return <Fragment>
    <Progress label="Upload" value={ uploadedCount } total={ filteredUploadAnnotations.length }/>

    <UploadTimeEstimation/>

    <UploadError/>

    <UploadButtons/>
  </Fragment>
}

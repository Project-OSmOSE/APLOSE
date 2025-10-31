import React, { Fragment, useMemo } from 'react';
import { Progress } from '@/components/ui';
import { useImportAnnotationsContext } from './context';
import { UploadButtons } from './UploadButtons';
import { UploadTimeEstimation } from './UploadTimeEstimation';
import { UploadError } from './UploadError';

export const Upload: React.FC = () => {
  const { uploadedCount, annotations, fileState, selectedDetectorsForImport } = useImportAnnotationsContext()

  const totalUploadCount = useMemo(() => {
    return annotations.filter(a => selectedDetectorsForImport.includes(a.initial__detector__name)).length
  }, [ annotations, selectedDetectorsForImport ])

  if (fileState === 'initial') return <UploadButtons/>
  return <Fragment>
    <Progress label="Upload" value={ uploadedCount } total={ totalUploadCount }/>

    <UploadTimeEstimation/>

    <UploadError/>

    <UploadButtons/>
  </Fragment>
}

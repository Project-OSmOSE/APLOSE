import React, { useEffect, useMemo } from 'react';
import { ImportAnalysisNode, ImportDatasetNode, useImportSpectrogramAnalysis } from '@/api';
import { ImportRow, useToast } from '@/components/ui';
import { FileCheck, FileRight } from '@solar-icons/react';

export const ImportAnalysisRow: React.FC<{
  analysis: ImportAnalysisNode,
  dataset: Omit<ImportDatasetNode, 'analysis' | '__typename'>,
  imported?: boolean
  onImported?: (analysis: ImportAnalysisNode) => void
}> = ({ analysis, dataset, imported, onImported }) => {

  const {
    importSpectrogramAnalysis,
    isLoading,
    isSuccess,
    error,
  } = useImportSpectrogramAnalysis()
  const toast = useToast()

  const isDownloaded = useMemo(() => isSuccess || imported, [ isSuccess, imported ])

  useEffect(() => {
    if (error) toast.raiseError({ error })
  }, [ error ]);

  useEffect(() => {
    if (isSuccess && onImported) onImported(analysis)
  }, [ isSuccess ]);

  useEffect(() => {
    return () => {
      toast.dismiss();
    }
  }, []);

  return <ImportRow downloadedIcon={ <FileCheck size={ 24 } weight="BoldDuotone"/> }
                    downloadIcon={ <FileRight data-testid="download-analysis" size={ 24 }/> }
                    isLoading={ isLoading }
                    isDownloaded={ isDownloaded }
                    name={ analysis.name }
                    path={ analysis.path }
                    doImport={ () => importSpectrogramAnalysis({
                      datasetName: dataset.name,
                      datasetPath: dataset.path,
                      legacy: dataset.legacy ?? false,
                      ...analysis,
                    }) }/>
}

import React, { useEffect, useMemo } from 'react';
import { ImportAnalysisNode, ImportDatasetNode, useImportDataset } from '@/api';
import { ImportRow, useToast } from '@/components/ui';
import { FolderCheck, MoveToFolder } from '@solar-icons/react';
import { ImportAnalysisRow } from '@/features/SpectrogramAnalysis';
import { useFilter, useSort } from '@/features/UX';

export const ImportDatasetRow: React.FC<{
  dataset: ImportDatasetNode,
  importedAnalysis?: string[]
  search?: string;
  onImported: (dataset: ImportDatasetNode) => void
}> = ({ dataset, search, importedAnalysis, onImported }) => {

  const {
    isLoading,
    isSuccess,
    error,
    importDataset,
  } = useImportDataset()
  const toast = useToast()

  const isDownloaded = useMemo(() => {
    const datasetAnalysis = dataset.analysis?.filter(a => a !== null) ?? []
    return isSuccess || (importedAnalysis && importedAnalysis.length === datasetAnalysis.length)
  }, [ isSuccess, importedAnalysis, dataset ])

  useEffect(() => {
    if (error) toast.raiseError({ error })
  }, [ error ]);

  useEffect(() => {
    if (isSuccess) onImported(dataset)
  }, [ isSuccess ]);

  useEffect(() => {
    return () => {
      toast.dismiss();
    }
  }, []);

  const filteredAnalysis = useFilter({
    items: dataset.analysis?.filter(a => a !== null).map(a => a!) ?? [],
    search,
    itemToStringArray: (analysis: ImportAnalysisNode) => [ dataset.name, dataset.path, analysis.name, analysis.path ],
  })
  const searchAnalysis = useSort({
    items: filteredAnalysis,
    itemToSortString: (analysis: ImportAnalysisNode) => analysis.name,
  })

  return <ImportRow downloadedIcon={ <FolderCheck size={ 24 } weight="BoldDuotone"/> }
                    downloadIcon={ <MoveToFolder data-testid="download-dataset" size={ 24 }/> }
                    isDownloaded={ isDownloaded }
                    isLoading={ isLoading }
                    name={ dataset.name }
                    path={ dataset.path }
                    doImport={ () => importDataset(dataset) }>

    { searchAnalysis.map(a => <ImportAnalysisRow key={ a.name }
                                                 analysis={ a } dataset={ dataset }
                                                 imported={ importedAnalysis?.includes(a.name) }
                                                 onImported={ () => onImported({ ...dataset, analysis: [ a ] }) }/>) }

  </ImportRow>
}

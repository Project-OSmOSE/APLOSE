import React, { useEffect, useMemo } from "react";
import { DatasetAPI, ImportAnalysis, ImportDataset } from '@/features/data/dataset'
import { useSearchedData } from "@/service/ui/search.ts";
import { FolderCheck, MoveToFolder } from "@solar-icons/react";
import { useToast } from "@/service/ui";
import { ImportRow } from "@/components/ui/ImportRow.tsx";
import { AnalysisImportRow } from "@/features/data/spectrogramAnalysis/import";

export const DatasetImportRow: React.FC<{
  dataset: ImportDataset,
  importedAnalysis?: string[]
  search?: string;
  onImported: (dataset: ImportDataset) => void
}> = ({ dataset, search, importedAnalysis, onImported }) => {

  const [ doImport, {
    isLoading,
    isSuccess,
    error
  } ] = DatasetAPI.endpoints.postDatasetForImport.useMutation()
  const toast = useToast()

  const isDownloaded = useMemo(() => {
    return isSuccess || (importedAnalysis && importedAnalysis.length === dataset.analysis.length)
  }, [ isSuccess, importedAnalysis, dataset ])

  useEffect(() => {
    if (error) toast.presentError(error)
  }, [ error ]);

  useEffect(() => {
    if (isSuccess) onImported(dataset)
  }, [ isSuccess ]);

  useEffect(() => {
    return () => {
      toast.dismiss();
    }
  }, []);

  const searchAnalysis = useSearchedData({
    items: dataset.analysis,
    search,
    sortField: 'name',
    mapping: (analysis: ImportAnalysis) => [ analysis.name, analysis.path ]
  })

  return <ImportRow downloadedIcon={ <FolderCheck size={ 24 } weight="BoldDuotone"/> }
                    downloadIcon={ <MoveToFolder className='download-dataset' size={ 24 }/> }
                    isDownloaded={ isDownloaded }
                    isLoading={ isLoading }
                    name={ dataset.name }
                    path={ dataset.path }
                    doImport={ () => doImport(dataset) }>

    { searchAnalysis.map(a => <AnalysisImportRow key={ a.name }
                                                 analysis={ a } dataset={ dataset }
                                                 imported={ importedAnalysis?.includes(a.name) }
                                                 onImported={ () => onImported({ ...dataset, analysis: [ a ] }) }/>) }

  </ImportRow>
}
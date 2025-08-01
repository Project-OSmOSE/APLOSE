import React, { useEffect, useMemo } from "react";
import { ImportDataset } from "@/features/data/dataset/api";
import { useToast } from "@/service/ui";
import { FileCheck, FileRight } from "@solar-icons/react";
import { ImportSpectrogramAnalysis, SpectrogramAnalysisAPI } from "@/features/data/spectrogramAnalysis/api";
import { ImportRow } from "@/components/ui/ImportRow.tsx";

export const AnalysisImportRow: React.FC<{
  analysis: ImportSpectrogramAnalysis,
  dataset: Omit<ImportDataset, 'analysis' | '__typename'>,
  imported?: boolean
  onImported?: (analysis: ImportSpectrogramAnalysis) => void
}> = ({ analysis, dataset, imported, onImported }) => {

  const [ doImport, {
    isLoading,
    isSuccess,
    error
  } ] = SpectrogramAnalysisAPI.endpoints.postAnalysisForImport.useMutation()
  const toast = useToast()

  const isDownloaded = useMemo(() => isSuccess || imported, [ isSuccess, imported ])

  useEffect(() => {
    if (error) toast.presentError(error)
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
                    downloadIcon={ <FileRight className='download-analysis' size={ 24 }/> }
                    isLoading={ isLoading }
                    isDownloaded={ isDownloaded }
                    name={ analysis.name }
                    path={ analysis.path }
                    doImport={ () => doImport({
                      datasetName: dataset.name,
                      datasetPath: dataset.path,
                      legacy: dataset.legacy ?? false,
                      ...analysis
                    }) }/>
}
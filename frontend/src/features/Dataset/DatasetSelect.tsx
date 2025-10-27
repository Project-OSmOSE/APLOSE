import React, { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { IonSpinner } from '@ionic/react';
import { WarningText } from '@/components/ui';
import { ChipsInput, Select } from '@/components/form';

import { ImportAnalysisModalButton } from '@/features/SpectrogramAnalysis';
import { ImportDatasetModalButton } from '@/features/Dataset/index';
import { useAllDatasetsAndAnalysis } from '@/api';

export const DatasetSelect: React.FC<{
  datasetError?: string,
  analysisError?: string,
  onDatasetSelected: (id?: string) => void,
  selectAnalysis?: true,
  onAnalysisSelected?: (selection: string[]) => void,
  onAnalysisColormapsChanged?: (colormaps: string[]) => void
}> = ({
        datasetError,
        analysisError,
        onDatasetSelected,
        selectAnalysis,
        onAnalysisSelected,
        onAnalysisColormapsChanged,
      }) => {
  const { allDatasets, isFetching, error } = useAllDatasetsAndAnalysis()

  const datasetOptions = useMemo(() => {
    return allDatasets?.map(d => ({
      value: d.id,
      label: d.name,
    })) ?? []
  }, [allDatasets])

  const [selectedDatasetID, setSelectedDatasetID] = useState<string | undefined>();

  const analysisItems = useMemo(() => {
    return allDatasets?.find(d => d?.id === selectedDatasetID)
        ?.spectrogramAnalysis?.results.filter(r => !!r).map(a => ({
          value: a!.id,
          label: `${ a!.name } (${ a!.colormap.name })`,
        })) ?? []
  }, [allDatasets, selectedDatasetID])
  const [selectedAnalysis, setSelectedAnalysis] = useState<string[]>([]);

  const updateAnalysisSelection = useCallback((selection: Array<string>) => {
    setSelectedAnalysis(selection)
    if (onAnalysisSelected) onAnalysisSelected(selection)
  }, [setSelectedAnalysis, onAnalysisSelected]);

  const selectDataset = useCallback((value?: string | number) => {
    if (typeof value === 'number') value = value.toString()
    setSelectedDatasetID(value);
    onDatasetSelected(value);
    updateAnalysisSelection(allDatasets?.find(d => d?.id == value)?.spectrogramAnalysis?.results.filter(r => !!r).map(a => a!.id) ?? [])
  }, [setSelectedDatasetID, updateAnalysisSelection, allDatasets]);

  useEffect(() => {
    if (!onAnalysisColormapsChanged) return;
    onAnalysisColormapsChanged(
        allDatasets?.find(d => d?.id === selectedDatasetID)
            ?.spectrogramAnalysis?.results.filter(r => !!r)
            .filter(a => selectedAnalysis.includes(a!.id))
            .map(a => a!.colormap.name) ?? [],
    )
  }, [selectedDatasetID, selectedAnalysis]);


  if (isFetching)
    return <IonSpinner/>
  if (error)
    return <WarningText message="Fail loading datasets" error={ error }/>
  if (!allDatasets || allDatasets.length === 0)
    return <WarningText message="No datasets"
                        children={ <ImportDatasetModalButton/> }/>

  return <Fragment>
    <Select label="Dataset"
            placeholder="Select a dataset"
            error={ datasetError }
            options={ datasetOptions }
            optionsContainer="alert"
            value={ selectedDatasetID }
            onValueSelected={ value => selectDataset(value) }
            required/>

    { selectAnalysis && <Fragment>
        <ChipsInput label="Analysis"
                    error={ analysisError }
                    disabled={ analysisItems.length === 0 }
                    items={ analysisItems }
                    activeItemsValues={ selectedAnalysis }
                    setActiveItemsValues={ items => updateAnalysisSelection(items.map(i => typeof (i) === 'number' ? i.toString() : i)) }
                    required/>

      { selectedDatasetID && analysisItems.length === 0 &&
          <WarningText message="This dataset does't contain any analysis"
                       children={ <ImportAnalysisModalButton/> }/> }
    </Fragment> }
  </Fragment>
}

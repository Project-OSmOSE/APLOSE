import React, { useCallback, useState } from 'react';
import { useLoaderData } from '@tanstack/react-router';
import { CloudUpload } from '@solar-icons/react';

import { IMPORT_ANNOTATIONS_COLUMNS } from '@/consts/csv';
import { getErrorMessage } from '@/service/function';

import { Fieldset, InputFile, Note, Toast, useSpreadsheetHandler } from '@/components/base';

import { type Annotation } from './-type';

type CsvHeader =
    typeof IMPORT_ANNOTATIONS_COLUMNS.required[number] |
    typeof IMPORT_ANNOTATIONS_COLUMNS.optional[number];

export type ImportFileFormBlocProps = {
    onLoaded: (file: File, annotations: Annotation[]) => void;
    onReset: () => void;
}
export const ImportFileFormBloc: React.FC<ImportFileFormBlocProps> = ({
                                                                          onLoaded,
                                                                          onReset,
                                                                      }) => {
    const { campaign } = useLoaderData({ from: '/_authenticated/annotation-campaign/$campaignID' })
    const toastManager = Toast.useToastManager()

    const spreadsheetHandler = useSpreadsheetHandler<Record<CsvHeader, string>, CsvHeader>(
        [ ...IMPORT_ANNOTATIONS_COLUMNS.required, ...IMPORT_ANNOTATIONS_COLUMNS.optional ],
        [],
    )

    const [ isLoading, setIsLoading ] = useState<boolean>(false);


    const handleInput = useCallback(async (file: File) => {
        setIsLoading(true)
        let rows, headers;

        try {
            const data = await spreadsheetHandler.loadFile(file)
            rows = data.rows;
            headers = data.headers;
        } catch (error) {
            toastManager.add({
                type: 'danger', title: 'Fail reading file',
                description: getErrorMessage(error),
            })
            setIsLoading(false)
            return
        }

        const missingColumns = [];
        for (const column of IMPORT_ANNOTATIONS_COLUMNS.required) {
            if (!headers.includes(column)) missingColumns.push(column);
        }
        if (missingColumns.length > 0) {
            toastManager.add({
                type: 'danger', title: 'Fail reading file',
                description: `Missing columns: ${ missingColumns.join(', ') }`,
            })
            setIsLoading(false)
            return
        }
        onLoaded(
            file,
            rows.map(r => {
                const confidence_indicator: string | undefined = r.confidence_indicator_level
                const confidence__level = confidence_indicator?.split('/') ?? []
                return {
                    ...r,
                    start_frequency: r.start_frequency !== undefined ? +r.start_frequency : undefined,
                    end_frequency: r.end_frequency !== undefined ? +r.end_frequency : undefined,
                    label__name: r.annotation,
                    confidence__label: r.confidence_indicator_label,
                    confidence__level: confidence__level.length > 0 ? +confidence__level[0] : undefined,
                    initial__detector__name: r.annotator,
                } as Annotation
            }))
        setIsLoading(false)
    }, [ toastManager, onLoaded, spreadsheetHandler ])

    return <Fieldset.Root>

        {/* Information */ }
        <Note color="medium">
            The imported CSV should only contain annotations related to the campaign
            dataset: { campaign.dataset?.name }
        </Note>

        <InputFile onFileChange={ handleInput }
                   onReset={ onReset }
                   accept={ [ 'csv' ] }
                   forceLoadingState={ isLoading }>
            <CloudUpload weight="Linear" size={ 20 }/> Import annotations (csv)
        </InputFile>
    </Fieldset.Root>
}
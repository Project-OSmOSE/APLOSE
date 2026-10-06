import React, { useCallback, useState } from 'react';
import { useLoaderData } from '@tanstack/react-router';
import { CloudUploadLinearIcon } from '@solar-icons/react';

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
                return {
                    ...r,
                    min_frequency: r.min_frequency !== undefined ? +r.min_frequency : undefined,
                    max_frequency: r.max_frequency !== undefined ? +r.max_frequency : undefined,
                    confidence_indicator_label: r.confidence_indicator_label,
                    confidence_indicator_level: r.confidence_indicator_level !== undefined ? +r.confidence_indicator_level : undefined,
                    initial__detector: r.detector,
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
            <CloudUploadLinearIcon size={ 20 }/> Import annotations (csv)
        </InputFile>
    </Fieldset.Root>
}
import React, { useCallback, useState } from 'react';
import { useLoaderData } from '@tanstack/react-router';
import { CloudUpload } from '@solar-icons/react';

import { ACCEPT_CSV_MIME_TYPE, ACCEPT_CSV_SEPARATOR, IMPORT_ANNOTATIONS_COLUMNS } from '@/consts/csv';
import { getErrorMessage } from '@/service/function';

import { Fieldset, InputFile, Note, Toast } from '@/components/base';

import { type Annotation } from './-type';

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

    const [ isLoading, setIsLoading ] = useState<boolean>(false);


    const handleInput = useCallback(async (file: File | null) => {
        if (!file) return;
        setIsLoading(true);
        if (!ACCEPT_CSV_MIME_TYPE.includes(file.type)) {
            setIsLoading(false)
            toastManager.add({
                type: 'danger', title: 'Invalid file type',
                description: `Wrong MIME Type, found : ${ file.type } ; but accepted types are: ${ ACCEPT_CSV_MIME_TYPE }`,
            })
            return;
        }

        let rows: string[][] = []
        try {
            rows = await new Promise<string[][]>((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsText(file, 'UTF-8');
                reader.onerror = () => reject('Error reading file, check the file isn\'t corrupted')
                reader.onload = (event) => {
                    const result = event.target?.result;
                    if (!result || typeof result !== 'string') {
                        reject('The file is empty or it does not contain a string content.')
                        return;
                    }

                    let lines = result.replaceAll('\r', '').split('\n').map(l => [ l ]);
                    lines = lines.map(l => l.flatMap(l => l.split(ACCEPT_CSV_SEPARATOR))).filter(d => d.length > 1);
                    if (lines.length === 0) reject('The CSV is empty')

                    const missingColumns = [];
                    const headers = lines[0]
                    for (const column of IMPORT_ANNOTATIONS_COLUMNS.required) {
                        if (!headers.includes(column)) missingColumns.push(column);
                    }
                    if (missingColumns.length > 0)
                        reject(`Missing columns: ${ missingColumns.join(', ') }`);
                    resolve(lines)
                }
            })
        } catch (error) {
            toastManager.add({
                type: 'danger', title: 'Fail reading file',
                description: getErrorMessage(error),
            })
            setIsLoading(false)
            return
        }

        const contentRows = rows
        contentRows.reverse()
        const header = contentRows.pop()!
        contentRows.reverse()
        onLoaded(
            file,
            contentRows.map(r => {
                const confidence_indicator: string | undefined = r[header.indexOf('confidence_indicator_level')]
                const confidence__level = confidence_indicator?.split('/') ?? []
                return {
                    start_datetime: r[header.indexOf('start_datetime')],
                    end_datetime: r[header.indexOf('end_datetime')],
                    start_frequency: +r[header.indexOf('start_frequency')],
                    end_frequency: +r[header.indexOf('end_frequency')],
                    label__name: r[header.indexOf('annotation')],
                    confidence__label: r[header.indexOf('confidence_indicator_label')],
                    confidence__level: confidence__level.length > 0 ? +confidence__level[0] : undefined,
                    initial__detector__name: r[header.indexOf('annotator')],
                } as Annotation
            }))
        setIsLoading(false)
    }, [ toastManager, onLoaded ])

    return <Fieldset.Root>

        {/* Information */ }
        <Note color="medium">
            The imported CSV should only contain annotations related to the campaign
            dataset: { campaign.dataset?.name }

        </Note>

        <InputFile onFileChange={ handleInput }
                   onReset={ onReset }
                   forceLoadingState={ isLoading }>
            <CloudUpload weight="Linear" size={ 20 }/> Import annotations (csv)
        </InputFile>
    </Fieldset.Root>
}
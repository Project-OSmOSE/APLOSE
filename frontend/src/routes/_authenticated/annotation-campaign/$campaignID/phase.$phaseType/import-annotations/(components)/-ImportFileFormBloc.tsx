import React, { DragEvent, Fragment, useCallback, useMemo, useState } from 'react';
import { useLoaderData } from '@tanstack/react-router';
import { CloudUpload, Restart } from '@solar-icons/react';

import { ACCEPT_CSV_MIME_TYPE, ACCEPT_CSV_SEPARATOR, IMPORT_ANNOTATIONS_COLUMNS } from '@/consts/csv';
import { getErrorMessage } from '@/service/function';

import { Button, Fieldset, Note, Spinner, Toast } from '@/components/base';

import { type Annotation } from './-type';
import styles from '../styles.module.scss'

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
    const [ isDraggingHover, setIsDraggingHover ] = useState<boolean>(false);

    const [ isLoading, setIsLoading ] = useState<boolean>(false);
    const [ file, setFile ] = useState<File | undefined>();

    const dragNDropClassName = useMemo(() => {
        const l = [ styles.dragNDropZone ]
        if (isDraggingHover) l.push(styles.dragging)
        if (isLoading) {
            l.push(styles.loading)
        } else if (file) {
            l.push(styles.loaded)
        } else {
            l.push(styles.initial)
        }
        return l.join(' ')
    }, [ isLoading, file, isDraggingHover ])

    const handleInput = useCallback(async (files?: FileList) => {
        const _file = files?.item(0);
        if (!_file) return;
        setIsLoading(true);
        if (!ACCEPT_CSV_MIME_TYPE.includes(_file.type)) {
            setIsLoading(false)
            toastManager.add({
                type: 'danger', title: 'Invalid file type',
                description: `Wrong MIME Type, found : ${ _file.type } ; but accepted types are: ${ ACCEPT_CSV_MIME_TYPE }`,
            })
            return;
        }

        let rows: string[][] = []
        try {
            rows = await new Promise<string[][]>((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsText(_file, 'UTF-8');
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
            _file,
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
        setFile(_file)
        setIsLoading(false)
    }, [ toastManager, onLoaded ])

    const reset = useCallback(() => {
        setIsLoading(false)
        setFile(undefined)
        onReset()
    }, [ onReset ])

    const onDragZoneClick = useCallback(() => {
        if (isLoading || !!file) return;
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = ACCEPT_CSV_MIME_TYPE;
        input.click();
        input.oninput = () => handleInput(input.files ?? undefined)
    }, [ isLoading, file, handleInput ])

    const onDragZoneDrop = useCallback((event: DragEvent) => {
        event.preventDefault();
        event.stopPropagation();
        if (isLoading || !!file) return;
        setIsDraggingHover(false);
        handleInput(event.dataTransfer.files)
    }, [ isLoading, file, handleInput ])

    const onDragStart = useCallback((event: DragEvent) => {
        setIsDraggingHover(true)
        event.preventDefault();
    }, [])

    const onDragEnd = useCallback((event: DragEvent) => {
        setIsDraggingHover(false)
        event.preventDefault();
    }, [])


    return <Fieldset.Root>

        {/* Information */ }
        <Note color="medium">
            The imported CSV should only contain annotations related to the campaign
            dataset: { campaign.dataset?.name }

        </Note>

        {/* Drag N Drop zone */ }
        <div className={ dragNDropClassName }
             onClick={ onDragZoneClick }
             onDrop={ onDragZoneDrop }
             onDragOver={ onDragStart }
             onDragEnter={ onDragStart }
             onDragLeave={ onDragEnd }
             onDragEnd={ onDragEnd }>

            { !isLoading && !file && <Fragment>
                <CloudUpload weight="Linear" size={ 20 }/> Import annotations (csv)
            </Fragment> }
            { isLoading && <Spinner/> }
            { file && <Fragment>
                <p>{ file.name }</p>
                <Button onClick={ reset } className="ion-text-wrap">
                    Reset
                    <Restart weight="Linear" size={ 20 }/>
                </Button>
            </Fragment> }
        </div>
    </Fieldset.Root>
}
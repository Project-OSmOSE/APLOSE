import React, { DragEvent, useCallback, useImperativeHandle, useMemo, useState } from 'react';
import { Restart } from '@solar-icons/react';
import { Button, Spinner, Toast } from '@/components/base';
import styles from './InputFile.module.scss';
import { type FileType, MIME_TYPES } from '@/consts/csv';

export * from './SpreadsheetHandler'

export type InputFileRef = {
    reset: () => void;
}
export type InputFileProps = {
    onFileChange: (file: File) => void;
    onReset: () => void;
    children?: React.ReactNode;
    forceLoadingState?: boolean;
    accept: FileType[];
}
export const InputFile = React.forwardRef<InputFileRef, InputFileProps>(({
                                                        onFileChange,
                                                        onReset,
                                                        children,
                                                        forceLoadingState,
                                                        accept,
                                                    }, ref) => {
    const [ isDraggingHover, setIsDraggingHover ] = useState<boolean>(false);
    const [ _isLoading, setIsLoading ] = useState<boolean>(false);
    const isLoading = useMemo(() => _isLoading || forceLoadingState, [ _isLoading, forceLoadingState ]);
    const [ file, setFile ] = useState<File | null>(null);
    const toastManager = Toast.useToastManager()
    const mimeTypes = useMemo(() => {
        return accept.map(a => MIME_TYPES[a]).join(', ')
    }, [ accept ])

    const dragNDropClassName = useMemo(() => {
        const l = [ styles.InputFile ]
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

    const onFilesInput = useCallback((files?: FileList | null) => {
        const _file = files?.item(0) ?? null
        if (!_file) return
        if (!mimeTypes.includes(_file.type)) {
            setIsLoading(false)
            toastManager.add({
                type: 'danger', title: 'Invalid file type',
                description: `Wrong MIME Type, found : ${ _file.type } ; but accepted types are: ${ accept.join(', ') }`,
            })
            return;
        }

        setFile(_file)
        onFileChange(_file)
    }, [ onFileChange, toastManager, accept, mimeTypes ])

    const reset = useCallback(() => {
        setIsLoading(false)
        setFile(null)
        onReset()
    }, [ onReset ])

    useImperativeHandle(ref, () => ({
        reset: () => {
            setIsLoading(false)
            setFile(null)
        }
    }), [])

    const onDragZoneClick = useCallback(() => {
        if (isLoading || !!file) return;
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = mimeTypes;
        input.click();
        input.oninput = () => onFilesInput(input.files)
    }, [ isLoading, file, onFilesInput, mimeTypes ])

    const onDragZoneDrop = useCallback((event: DragEvent) => {
        event.preventDefault();
        event.stopPropagation();
        if (isLoading || !!file) return;
        setIsDraggingHover(false);
        onFilesInput(event.dataTransfer.files)
    }, [ isLoading, file, onFilesInput ])

    const onDragStart = useCallback((event: DragEvent) => {
        setIsDraggingHover(true)
        event.preventDefault();
    }, [])

    const onDragEnd = useCallback((event: DragEvent) => {
        setIsDraggingHover(false)
        event.preventDefault();
    }, [])

    if (isLoading)
        return <div className={ dragNDropClassName }><Spinner/></div>
    if (file)
        return <div className={ dragNDropClassName }>
            <p>{ file.name }</p>
            <Button onClick={ reset } className="ion-text-wrap">
                Reset
                <Restart weight="Linear" size={ 20 }/>
            </Button>
        </div>
    return <div className={ dragNDropClassName }
                onClick={ onDragZoneClick }
                onDrop={ onDragZoneDrop }
                onDragOver={ onDragStart }
                onDragEnter={ onDragStart }
                onDragLeave={ onDragEnd }
                onDragEnd={ onDragEnd }>
        { children }
    </div>
})

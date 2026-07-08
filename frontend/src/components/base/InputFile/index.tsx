import React, { DragEvent, Fragment, useCallback, useMemo, useState } from 'react';
import { Restart } from '@solar-icons/react';
import { Button, Spinner } from '@/components/base';
import styles from './InputFile.module.scss';
import { ACCEPT_CSV_MIME_TYPE } from '@/consts/csv';

export type InputFileProps = {
    onFileChange: (file: File | null) => void;
    onReset: () => void;
    children?: React.ReactNode;
    forceLoadingState?: boolean
}
export const InputFile: React.FC<InputFileProps> = ({
                                                        onFileChange,
                                                        onReset,
                                                        children,
                                                        forceLoadingState,
                                                    }) => {
    const [ isDraggingHover, setIsDraggingHover ] = useState<boolean>(false);
    const [ _isLoading, setIsLoading ] = useState<boolean>(false);
    const isLoading = useMemo(() => _isLoading || forceLoadingState, [ _isLoading, forceLoadingState ]);
    const [ file, setFile ] = useState<File | null>(null);

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


    const reset = useCallback(() => {
        setIsLoading(false)
        setFile(null)
        onReset()
    }, [ onReset ])

    const onDragZoneClick = useCallback(() => {
        if (isLoading || !!file) return;
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = ACCEPT_CSV_MIME_TYPE;
        input.click();
        input.oninput = () => {
            const _file = input.files?.item(0) ?? null
            setFile(_file)
            onFileChange(_file)
        }
    }, [ isLoading, file, onFileChange ])

    const onDragZoneDrop = useCallback((event: DragEvent) => {
        event.preventDefault();
        event.stopPropagation();
        if (isLoading || !!file) return;
        setIsDraggingHover(false);
        const _file = event.dataTransfer.files?.item(0) ?? null
        setFile(_file)
        onFileChange(_file)
    }, [ isLoading, file, onFileChange ])

    const onDragStart = useCallback((event: DragEvent) => {
        setIsDraggingHover(true)
        event.preventDefault();
    }, [])

    const onDragEnd = useCallback((event: DragEvent) => {
        setIsDraggingHover(false)
        event.preventDefault();
    }, [])

    return <div className={ dragNDropClassName }
                onClick={ onDragZoneClick }
                onDrop={ onDragZoneDrop }
                onDragOver={ onDragStart }
                onDragEnter={ onDragStart }
                onDragLeave={ onDragEnd }
                onDragEnd={ onDragEnd }>

        { !isLoading && !file && children }
        { isLoading && <Spinner/> }
        { file && <Fragment>
            <p>{ file.name }</p>
            <Button onClick={ reset } className="ion-text-wrap">
                Reset
                <Restart weight="Linear" size={ 20 }/>
            </Button>
        </Fragment> }
    </div>
}

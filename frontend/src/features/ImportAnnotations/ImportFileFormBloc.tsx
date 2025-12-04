import React, { DragEvent, Fragment, useCallback, useMemo, useState } from 'react';
import { IonButton, IonIcon, IonNote, IonSpinner } from '@ionic/react';
import { FormBloc } from '@/components/form';
import { useImportAnnotationsContext } from './context';
import styles from './styles.module.scss'
import { ACCEPT_CSV_MIME_TYPE, ACCEPT_CSV_SEPARATOR, IMPORT_ANNOTATIONS_COLUMNS } from '@/consts/csv';
import { useCurrentCampaign } from '@/api';
import { WarningText } from '@/components/ui';
import { cloudUploadOutline, refreshOutline } from 'ionicons/icons/index.js';
import { AnalysisSelect } from './AnalysisSelect';

export const ImportAnnotationsFormBloc: React.FC = () => {
  const { campaign } = useCurrentCampaign()
  const { load, reset, ...state } = useImportAnnotationsContext()
  const [ isDraggingHover, setIsDraggingHover ] = useState<boolean>(false);

  const dragNDropClassName = useMemo(() => {
    const l = [ styles.dragNDropZone, styles[state.fileState] ]
    if (isDraggingHover) l.push(styles.dragging)
    return l.join(' ')
  }, [ state, isDraggingHover ])

  const handleInput = useCallback((files?: FileList) => {
    const _file = files?.item(0);
    if (!_file) return;
    load(_file)
  }, [ load ])

  const onDragZoneClick = useCallback(() => {
    if (state.fileState !== 'initial') return;
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = ACCEPT_CSV_MIME_TYPE;
    input.click();
    input.oninput = () => handleInput(input.files ?? undefined)
  }, [ state ])

  const onDragZoneDrop = useCallback((event: DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (state.fileState !== 'initial') return;
    setIsDraggingHover(false);
    handleInput(event.dataTransfer.files)
  }, [ handleInput ])

  const onDragStart = useCallback((event: DragEvent) => {
    setIsDraggingHover(true)
    event.preventDefault();
  }, [])

  const onDragEnd = useCallback((event: DragEvent) => {
    setIsDraggingHover(false)
    event.preventDefault();
  }, [])

  return <FormBloc className={ styles.importBloc }>

    {/* Information */ }
    <IonNote color="medium"
             children={ `The imported CSV should only contain annotations related to this campaign dataset: ${ campaign?.dataset?.name }` }/>
    <AnalysisSelect/>

    {/* Drag N Drop zone */ }
    <div className={ dragNDropClassName }
         onClick={ onDragZoneClick }
         onDrop={ onDragZoneDrop }
         onDragOver={ onDragStart }
         onDragEnter={ onDragStart }
         onDragLeave={ onDragEnd }
         onDragEnd={ onDragEnd }>

      { state.fileState === 'initial' && <Fragment>
          <IonIcon icon={ cloudUploadOutline }/> Import annotations (csv)
      </Fragment> }
      { state.fileState === 'loading' && <IonSpinner color="primary"/> }
      { state.fileState === 'loaded' && <Fragment>
          <p>{ state.file.name }</p>
          <IonButton onClick={ reset } className="ion-text-wrap">
              Reset
              <IonIcon icon={ refreshOutline } slot="end"/>
          </IonButton>
      </Fragment> }
    </div>

    {/* Error */ }
    { state.fileState === 'error' && <Fragment>
        <WarningText message="Unrecognized file" error={ state.error }/>

        <p>The file should have the following columns: { IMPORT_ANNOTATIONS_COLUMNS.required.map(c => (
          <Fragment key={ c }><b>{ c }</b><span className={ styles.separator }>, </span></Fragment>
        )) }</p>

        <p>The file can have additional optional columns: { IMPORT_ANNOTATIONS_COLUMNS.optional.map(c => (
          <Fragment key={ c }><b>{ c }</b><span className={ styles.separator }>, </span></Fragment>)) }</p>

        <p>The accepted separator is: <b>{ ACCEPT_CSV_SEPARATOR }</b></p>
    </Fragment> }
  </FormBloc>
}
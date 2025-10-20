import React, { Fragment, useCallback, useEffect, useMemo } from 'react';
import { useImportAnnotationsContext } from '@/features/ImportAnnotations/context';
import { useAllDetectors } from '@/api/detector';
import styles from './styles.module.scss';
import { CheckboxChangeEventDetail, IonCheckbox, IonIcon, IonNote } from '@ionic/react';
import { alertOutline } from 'ionicons/icons';
import { Select } from '@/components/form';

export const DetectorEntry: React.FC<{
  initialName: string;
}> = ({ initialName }) => {
  const {
    selectedDetectorsForImport,
    selectDetectorForImport,
    unselectDetectorForImport,
    unknownToKnownDetectors,
    createUnknownDetector,
    assignUnknownToKnownDetector,
    ...state
  } = useImportAnnotationsContext()
  const { allDetectors } = useAllDetectors({
    skip: state.fileState !== 'loaded',
  })
  const isKnown = useMemo(() => allDetectors?.some(d => d.name === initialName), [ allDetectors ]);
  const isSelected = useMemo(() => !!selectedDetectorsForImport.find(d => d === initialName), [ selectedDetectorsForImport ]);
  const isUpdated = useMemo(() => initialName in Object.keys(unknownToKnownDetectors), [ unknownToKnownDetectors ]);

  useEffect(() => {
    if (isKnown) // By default, select detector if it already matches to a known one
      selectDetectorForImport(initialName)
  }, [ allDetectors ]);

  const onCheckboxChange = useCallback((e: CustomEvent<CheckboxChangeEventDetail>) => {
    if (e.detail.checked) {
      selectDetectorForImport(initialName);
    } else {
      unselectDetectorForImport(initialName);
    }
  }, [ initialName, selectDetectorForImport, unselectDetectorForImport ])

  const onDetectorChange = useCallback((id: string | number | undefined) => {
    if (typeof id === 'undefined' || (typeof id === 'string' && isNaN(+id)) || (typeof id === 'number' && id === -9)) {
      createUnknownDetector(initialName)
    } else {
      assignUnknownToKnownDetector(initialName, typeof id === 'string' ? id : id?.toString())
    }
  }, [ initialName, createUnknownDetector, assignUnknownToKnownDetector ])

  if (state.fileState !== 'loaded') return <Fragment/>
  return <div className={ [ styles.detectorEntry, isKnown ? '' : styles.unknown ].join(' ') }>
    <IonCheckbox labelPlacement="end" justify="start"
                 color={ !isKnown && !isUpdated ? 'danger' : undefined }
                 checked={ isSelected }
                 disabled={ (!isKnown && !isUpdated) }
                 onIonChange={ onCheckboxChange }/>
    { !isKnown && !isUpdated && <IonIcon className={ styles.exclamation } icon={ alertOutline } color="danger"/> }

    { initialName }

    { isKnown && <IonNote color="medium">Already in database</IonNote> }

    { !isKnown && <div className={ styles.unknown }>
        <IonNote color={ !isKnown && !isUpdated ? 'danger' : 'medium' }>Unknown detector</IonNote>

        <Select value={ unknownToKnownDetectors[initialName] }
                options={ allDetectors?.map(d => ({ value: d.id, label: d.name })) ?? [] }
                onValueSelected={ onDetectorChange }
                optionsContainer="popover"
                noneLabel={ `Create "${ initialName }"` }
                placeholder="Assign to detector"/>
    </div> }

    <div className={ styles.line }/>
  </div>
}

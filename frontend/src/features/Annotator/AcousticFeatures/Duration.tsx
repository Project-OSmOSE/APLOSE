import React, { useCallback, useMemo } from 'react';
import { type Annotation, useUpdateAnnotation } from '@/features/Annotator/Annotation';
import { Td, Th, Tr } from '@/components/ui';
import { useAnnotationTask, useCurrentPhase } from '@/api';
import { Input } from '@/components/form';
import styles from './styles.module.scss';
import { IonNote } from '@ionic/react';

export const Duration: React.FC<{ annotation: Annotation }> = ({ annotation }) => {
    const { spectrogram } = useAnnotationTask()
    const { phase } = useCurrentPhase()

    const updateAnnotation = useUpdateAnnotation()
    const onDurationUpdate = useCallback((value: number) => {
        updateAnnotation(annotation, {
            endTime: annotation.startTime! + Math.max(value, 0),
        })
    }, [ updateAnnotation, annotation ])

    const duration = useMemo(() => {
        const minTime = Math.min(annotation.startTime!, annotation.endTime!)
        const maxTime = Math.max(annotation.startTime!, annotation.endTime!)
        return +(maxTime - minTime).toFixed(3)
    }, [ annotation?.startTime, annotation?.endTime ]);

    return <Tr>
        <Th scope="col">Duration</Th>
        <Td colSpan={ 2 }>
            <div className={ [styles.inputCell, styles.duration].join(' ') }>
                <Input className={styles.input} value={ duration } type="number"
                       step={ 0.001 }
                       min={ 0.01 } max={ spectrogram?.duration ?? 0 }
                       disabled={ phase?.phase === 'Verification' }
                       onChange={ e => onDurationUpdate(+e.currentTarget.value) }/>
                <IonNote>s</IonNote>
            </div>
        </Td>
    </Tr>
}
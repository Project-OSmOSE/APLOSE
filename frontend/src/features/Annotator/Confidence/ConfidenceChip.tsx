import React, { useCallback, useMemo } from 'react';
import { selectAnnotation, useUpdateAnnotation } from '@/features/Annotator/Annotation';
import { useAppDispatch, useAppSelector } from '@/features/App';
import { selectFocusConfidence } from '@/features/Annotator/Confidence/selectors';
import { focusConfidence } from '@/features/Annotator/Confidence/slice';
import { Unread } from '@solar-icons/react';
import { Chip } from '@/components/base';
import styles from './styles.module.scss'

export const ConfidenceChip: React.FC<{ confidence: string }> = ({ confidence }) => {
    const focusedAnnotation = useAppSelector(selectAnnotation)
    const updateAnnotation = useUpdateAnnotation()
    const focusedConfidence = useAppSelector(selectFocusConfidence)
    const isActive = useMemo<boolean>(() => focusedConfidence === confidence, [ focusedConfidence, confidence ]);
    const dispatch = useAppDispatch();

    const select = useCallback(() => {
        if (focusedAnnotation) return updateAnnotation(focusedAnnotation, { confidence })
        dispatch(focusConfidence(confidence))
    }, [ focusedAnnotation, updateAnnotation, confidence, dispatch ])

    return <Chip color={ isActive ? 'primary' : 'medium' }
                 className={ styles.chip }
                 onClick={ select }
                 data-testid="confidence-chip">
        { isActive && <Unread weight="Linear" size={ 20 }/> }
        { confidence }
    </Chip>
}

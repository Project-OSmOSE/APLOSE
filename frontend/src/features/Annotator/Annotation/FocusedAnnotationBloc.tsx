import React, { Fragment } from 'react';
import { Bloc } from '@/components/ui';
import styles from './styles.module.scss'
import { AnnotationLabelInfo } from './AnnotationLabelInfo';
import { AnnotationConfidenceInfo } from './AnnotationConfidenceInfo';
import { AnnotationTimeInfo } from './AnnotationTimeInfo';
import { AnnotationFrequencyInfo } from './AnnotationFrequencyInfo';
import { useAppSelector } from '@/features/App';
import { selectAnnotation } from '@/features/Annotator/Annotation/selectors';
import { Note } from '@/components/base';

export const FocusedAnnotationBloc: React.FC = () => {
    const focusedAnnotation = useAppSelector(selectAnnotation)

    return <Bloc.Root className={ styles.focusedBloc }>
        <Bloc.Title>Selected annotation</Bloc.Title>
        <Bloc.Content center={ !!focusedAnnotation }
                      smallSpaces
                      vertical
                      className={ styles.content }>
            { focusedAnnotation ? <Fragment>
                <AnnotationLabelInfo annotation={ focusedAnnotation }/>
                <AnnotationConfidenceInfo annotation={ focusedAnnotation }/>
                <AnnotationTimeInfo annotation={ focusedAnnotation }/>
                <AnnotationFrequencyInfo annotation={ focusedAnnotation }/>
            </Fragment> : <Note color='medium'>-</Note> }
        </Bloc.Content>
    </Bloc.Root>
}

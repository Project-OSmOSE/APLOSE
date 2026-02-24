import React, { Fragment, useCallback, useMemo } from 'react';
import { type Annotation, type Features, useUpdateAnnotation } from '@/features/Annotator/Annotation';
import { TableContent, TableDivider } from '@/components/ui';
import styles from '@/features/Annotator/AcousticFeatures/styles.module.scss';
import { BooleanRow, InputRow, NoteRow } from '@/features/Annotator/AcousticFeatures/Rows';
import { useAppSelector } from '@/features/App';
import { selectAnalysis } from '@/features/Annotator/Analysis';
import { useUpdateAnnotationFeatures } from '@/features/Annotator/AcousticFeatures/hooks';
import { useCurrentPhase } from '@/api';

export const Frequency: React.FC<{ annotation: Annotation }> = ({ annotation }) => {
    const { phase } = useCurrentPhase()
    const analysis = useAppSelector(selectAnalysis)
    const maxFrequency = useMemo(() => (analysis?.fft.samplingFrequency ?? 0) / 2, [ analysis ])

    const updateAnnotation = useUpdateAnnotation()
    const onMinUpdate = useCallback((value: number) => {
        updateAnnotation(annotation, {
            startFrequency: value,
            endFrequency: Math.max(annotation.endFrequency ?? 0, value),
        })
    }, [ updateAnnotation, annotation ])
    const onMaxUpdate = useCallback((value: number) => {
        updateAnnotation(annotation, {
            startFrequency: Math.min(annotation.startFrequency ?? 0, value),
            endFrequency: value,
        })
    }, [ updateAnnotation, annotation ])

    const updateFeatures = useUpdateAnnotationFeatures()
    const onFeatureUpdate = useCallback((field: keyof Features, value: number) => {
        updateFeatures(annotation, { [field]: value })
    }, [ updateFeatures, annotation ])
    const onFeatureToggle = useCallback((field: keyof Features) => {
        updateFeatures(annotation, { [field]: !annotation.acousticFeatures![field] })
    }, [ updateFeatures, annotation ])

    return <Fragment>
        <TableContent isFirstColumn={ true } className={ styles.frequencyCell }>Frequency</TableContent>

        {/* Min */ }
        <InputRow label="Min" value={ annotation.startFrequency! } max={ maxFrequency } unit="Hz"
                  disabled={ phase?.phase === 'Verification' }
                  onUpdate={ onMinUpdate }/>
        <TableDivider className={ styles.span2ColsEnd }/>

        {/* Max */ }
        <InputRow label="Max" value={ annotation.endFrequency! } max={ maxFrequency } unit="Hz"
                  disabled={ phase?.phase === 'Verification' }
                  onUpdate={ onMaxUpdate }/>
        <TableDivider className={ styles.span2ColsEnd }/>

        {/* Range */}
        <NoteRow label="Range" note={ `${(annotation.endFrequency ?? 0)
            - (annotation.startFrequency ?? 0)}Hz` }/>
        <TableDivider className={ styles.span2ColsEnd }/>

        {/* Start */ }
        <InputRow label="Start" value={ annotation.acousticFeatures?.startFrequency } max={ maxFrequency } unit="Hz"
                  onUpdate={ value => onFeatureUpdate('startFrequency', value) }
                  clickable annotation={ annotation }/>
        <TableDivider className={ styles.span2ColsEnd }/>

        {/* End */ }
        <InputRow label="End" value={ annotation.acousticFeatures?.endFrequency } max={ maxFrequency } unit="Hz"
                  onUpdate={ value => onFeatureUpdate('endFrequency', value) }
                  clickable annotation={ annotation }/>
        <TableDivider className={ styles.span2ColsEnd }/>

        {/* Relative min count */ }
        <InputRow label="Relative min count" value={ annotation.acousticFeatures?.relativeMinFrequencyCount }
                  onUpdate={ value => onFeatureUpdate('relativeMinFrequencyCount', value) }/>
        <TableDivider className={ styles.span2ColsEnd }/>

        {/* Relative max count */ }
        <InputRow label="Relative max count" value={ annotation.acousticFeatures?.relativeMaxFrequencyCount }
                  onUpdate={ value => onFeatureUpdate('relativeMaxFrequencyCount', value) }/>
        <TableDivider className={ styles.span2ColsEnd }/>

        {/* Inflection points */ }
        <NoteRow label="Inflection points" note={ (annotation.acousticFeatures!.relativeMinFrequencyCount ?? 0)
            + (annotation.acousticFeatures!.relativeMaxFrequencyCount ?? 0) }/>
        <TableDivider className={ styles.span2ColsEnd }/>

        {/* Step count */ }
        <InputRow label="Steps count" value={ annotation.acousticFeatures?.stepsCount }
                  onUpdate={ value => onFeatureUpdate('stepsCount', value) }/>
        <TableDivider className={ styles.span2ColsEnd }/>

        {/* Has harmonics */ }
        <BooleanRow label="Has harmonics"
                    checked={ annotation.acousticFeatures?.hasHarmonics }
                    toggle={ () => onFeatureToggle('hasHarmonics') }/>

        <TableDivider/>
    </Fragment>
}
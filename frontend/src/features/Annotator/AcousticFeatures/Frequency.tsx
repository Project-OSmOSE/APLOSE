import React, { Fragment, useCallback, useMemo } from 'react';
import { type Annotation, type Features, useUpdateAnnotation } from '@/features/Annotator/Annotation';
import { Th, Tr } from '@/components/ui';
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
        <Tr>
            <Th scope="row" rowSpan={ 10 }>Frequency</Th>

            {/* Min */ }
            <InputRow label="Min" value={ annotation.startFrequency! } max={ maxFrequency } unit="Hz"
                      disabled={ phase?.phase === 'Verification' }
                      onUpdate={ onMinUpdate }/>
        </Tr>

        {/* Max */ }
        <Tr>
            <InputRow label="Max" value={ annotation.endFrequency! } max={ maxFrequency } unit="Hz"
                      disabled={ phase?.phase === 'Verification' }
                      onUpdate={ onMaxUpdate }/>
        </Tr>

        {/* Range */ }
        <Tr>
            <NoteRow label="Range"
                     note={ `${ (annotation.endFrequency ?? 0) - (annotation.startFrequency ?? 0) }Hz` }/>
        </Tr>

        {/* Start */ }
        <Tr>
            <InputRow label="Start" value={ annotation.acousticFeatures?.startFrequency } max={ maxFrequency } unit="Hz"
                      onUpdate={ value => onFeatureUpdate('startFrequency', value) }
                      clickable annotation={ annotation }/>
        </Tr>

        {/* End */ }
        <Tr>
            <InputRow label="End" value={ annotation.acousticFeatures?.endFrequency } max={ maxFrequency } unit="Hz"
                      onUpdate={ value => onFeatureUpdate('endFrequency', value) }
                      clickable annotation={ annotation }/>
        </Tr>

        {/* Relative min count */ }
        <Tr>
            <InputRow label="Relative min count" value={ annotation.acousticFeatures?.relativeMinFrequencyCount }
                      onUpdate={ value => onFeatureUpdate('relativeMinFrequencyCount', value) }/>
        </Tr>

        {/* Relative max count */ }
        <Tr>
            <InputRow label="Relative max count" value={ annotation.acousticFeatures?.relativeMaxFrequencyCount }
                      onUpdate={ value => onFeatureUpdate('relativeMaxFrequencyCount', value) }/>
        </Tr>

        {/* Inflection points */ }
        <Tr>
            <NoteRow label="Inflection points" note={ (annotation.acousticFeatures!.relativeMinFrequencyCount ?? 0)
                + (annotation.acousticFeatures!.relativeMaxFrequencyCount ?? 0) }/>
        </Tr>

        {/* Step count */ }
        <Tr>
            <InputRow label="Steps count" value={ annotation.acousticFeatures?.stepsCount }
                      onUpdate={ value => onFeatureUpdate('stepsCount', value) }/>
        </Tr>

        {/* Has harmonics */ }
        <Tr>
            <BooleanRow
                label="Has harmonics"
                checked={ annotation.acousticFeatures?.hasHarmonics }
                toggle={ () => onFeatureToggle('hasHarmonics') }/>
        </Tr>
    </Fragment>
}
import React, { Fragment, useCallback } from 'react';
import { type Annotation, type Features } from '@/features/Annotator/Annotation';
import { Th, Tr } from '@/components/ui';
import { BooleanRow } from '@/features/Annotator/AcousticFeatures/Rows';
import { useUpdateAnnotationFeatures } from '@/features/Annotator/AcousticFeatures/hooks';

export const NonLinearPhenomena: React.FC<{ annotation: Annotation }> = ({ annotation }) => {

    const updateFeatures = useUpdateAnnotationFeatures()
    const onFeatureUpdate = useCallback((field: keyof Features, value: number) => {
        updateFeatures(annotation, { [field]: value })
    }, [ updateFeatures, annotation ])
    const onFeatureToggle = useCallback((field: keyof Features) => {
        const update: Partial<Features> = { [field]: !annotation.acousticFeatures![field] }
        if (field == 'hasFrequencyJumps' && !update.hasFrequencyJumps) update.frequencyJumpsCount = undefined
        updateFeatures(annotation, update)
    }, [ updateFeatures, annotation ])

    return <Fragment>
        <Tr>
            <Th scope="row" rowSpan={ 8 }>Non-linear phenomena</Th>

            {/* Sidebands */ }
            <BooleanRow label="Sidebands" checked={ annotation.acousticFeatures!.hasSidebands }
                        toggle={ () => onFeatureToggle('hasSidebands') }/>
        </Tr>

        {/* Subharmonics */ }
        <Tr>
            <BooleanRow label="Subharmonics" checked={ annotation.acousticFeatures!.hasSubharmonics }
                        toggle={ () => onFeatureToggle('hasSubharmonics') }/>
        </Tr>

        {/* Frequency jumps */ }
        <Tr>
            <BooleanRow label="Frequency jumps"
                        checked={ annotation.acousticFeatures!.hasFrequencyJumps }
                        toggle={ () => onFeatureToggle('hasFrequencyJumps') }
                        value={ annotation.acousticFeatures!.frequencyJumpsCount }
                        onValueChange={ value => onFeatureUpdate('frequencyJumpsCount', value) }/>
        </Tr>

        {/* Deterministic chaos */ }
        <Tr>
            <BooleanRow label="Deterministic chaos" checked={ annotation.acousticFeatures!.hasDeterministicChaos }
                        toggle={ () => onFeatureToggle('hasDeterministicChaos') }/>
        </Tr>

    </Fragment>
}
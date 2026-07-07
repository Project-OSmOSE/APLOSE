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
    const onFeatureToggle = useCallback((field: keyof Features, checked: boolean) => {
        const update: Partial<Features> = { [field]: checked }
        if (field == 'hasFrequencyJumps' && !update.hasFrequencyJumps) update.frequencyJumpsCount = undefined
        updateFeatures(annotation, update)
    }, [ updateFeatures, annotation ])

    return <Fragment>
        <Tr>
            <Th scope="row" rowSpan={ 8 }>Non-linear phenomena</Th>

            {/* Sidebands */ }
            <BooleanRow label="Sidebands"
                        checked={ annotation.acousticFeatures!.hasSidebands }
                        onCheckedChange={ (checked) => onFeatureToggle('hasSidebands', checked) }/>
        </Tr>

        {/* Subharmonics */ }
        <Tr>
            <BooleanRow label="Subharmonics"
                        checked={ annotation.acousticFeatures!.hasSubharmonics }
                        onCheckedChange={ (checked) => onFeatureToggle('hasSubharmonics', checked) }/>
        </Tr>

        {/* Frequency jumps */ }
        <Tr>
            <BooleanRow label="Frequency jumps"
                        checked={ annotation.acousticFeatures!.hasFrequencyJumps }
                        onCheckedChange={ (checked) => onFeatureToggle('hasFrequencyJumps', checked) }
                        value={ annotation.acousticFeatures!.frequencyJumpsCount }
                        onValueChange={ value => onFeatureUpdate('frequencyJumpsCount', value) }/>
        </Tr>

        {/* Deterministic chaos */ }
        <Tr>
            <BooleanRow label="Deterministic chaos"
                        checked={ annotation.acousticFeatures!.hasDeterministicChaos }
                        onCheckedChange={ (checked) => onFeatureToggle('hasDeterministicChaos', checked) }/>
        </Tr>

    </Fragment>
}
import React, { Fragment, useCallback } from 'react';
import { type Annotation, type Features } from '@/features/Annotator/Annotation';
import { TableContent, TableDivider } from '@/components/ui';
import styles from '@/features/Annotator/AcousticFeatures/styles.module.scss';
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
        <TableContent isFirstColumn={ true } className={ styles.phenomenaCell }>Non-linear phenomena</TableContent>

        {/* Sidebands */ }
        <BooleanRow label="Sidebands" checked={ annotation.acousticFeatures!.hasSidebands }
                    toggle={ () => onFeatureToggle('hasSidebands') }/>
        <TableDivider className={ styles.span2ColsEnd }/>

        {/* Subharmonics */ }
        <BooleanRow label="Subharmonics" checked={ annotation.acousticFeatures!.hasSubharmonics }
                    toggle={ () => onFeatureToggle('hasSubharmonics') }/>
        <TableDivider className={ styles.span2ColsEnd }/>

        {/* Frequency jumps */ }
        <BooleanRow label="Frequency jumps"
                    checked={ annotation.acousticFeatures!.hasFrequencyJumps }
                    toggle={ () => onFeatureToggle('hasFrequencyJumps') }
                    value={ annotation.acousticFeatures!.frequencyJumpsCount }
                    onValueChange={ value => onFeatureUpdate('frequencyJumpsCount', value) }/>
        <TableDivider className={ styles.span2ColsEnd }/>

        {/* Deterministic chaos */ }
        <BooleanRow label="Deterministic chaos" checked={ annotation.acousticFeatures!.hasDeterministicChaos }
                    toggle={ () => onFeatureToggle('hasDeterministicChaos') }/>

    </Fragment>
}
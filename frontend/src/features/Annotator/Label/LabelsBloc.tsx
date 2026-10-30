import React, { useCallback } from 'react';
import { useParams } from '@tanstack/react-router';
import { useHotkey } from '@tanstack/react-hotkeys';
import { useQuery } from "@tanstack/react-query";
import { Bloc } from '@/components/ui';
import { Button } from '@/components/base';
import { useAppDispatch, useAppSelector } from '@/features/App';
import { blur } from '@/features/Annotator/Annotation';
import { Campaign } from "@/features";
import { setHiddenLabelIds } from './slice';
import { selectHiddenLabelIds } from './selectors';
import { LabelChip } from './LabelChip';
import styles from './styles.module.scss';

export const LabelsBloc: React.FC = () => {
    const { campaignID } = useParams({ from: '/_authenticated/annotation-campaign/$campaignID/phase/$phaseType/spectrogram/$spectrogramID' })
    const { data: labels } = useQuery(Campaign.labelsByIdQuery({ id: campaignID }))
    const hiddenLabelIds = useAppSelector(selectHiddenLabelIds)
    const dispatch = useAppDispatch()

    const showAllLabels = useCallback(() => {
        dispatch(setHiddenLabelIds([]))
    }, [ dispatch ])

    const escape = useCallback(() => dispatch(blur()), [ dispatch ])
    useHotkey('Escape', escape)

    return <Bloc.Root className={ styles.labels }>
        <Bloc.Title>
            Labels
            { hiddenLabelIds.length > 0 && <Button onClick={ showAllLabels }
                                                   className={ styles.showButton }>Show all</Button> }
        </Bloc.Title>
        <Bloc.Content>
            { labels?.map((label) => <LabelChip label={ label.label } key={ label.label.id }/>) }
        </Bloc.Content>
    </Bloc.Root>
}

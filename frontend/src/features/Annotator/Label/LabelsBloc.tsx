import React, { useCallback, useMemo } from 'react';
import styles from './styles.module.scss';
import { Bloc } from '@/components/ui';
import { LabelChip } from './LabelChip';
import { useAppDispatch, useAppSelector } from '@/features/App';
import { selectHiddenLabelIds } from './selectors';
import { blur } from '@/features/Annotator/Annotation';
import { setHiddenLabelIds } from './slice';
import { useLoaderData } from '@tanstack/react-router';
import { Button } from '@/components/base/Button';
import { useHotkey } from '@tanstack/react-hotkeys';

export const LabelsBloc: React.FC = () => {
    const { labels } = useLoaderData({ from: '/_authenticated/annotation-campaign/$campaignID' })
    const hiddenLabelIds = useAppSelector(selectHiddenLabelIds)
    const dispatch = useAppDispatch()

    const showAllLabels = useCallback(() => {
        dispatch(setHiddenLabelIds([]))
    }, [ dispatch ])

    const sortedLabels = useMemo(() => {
        return labels.sort((a, b) => {
            return a.source.englishName.localeCompare(b.source.englishName)
        })
    }, [labels])

    const escape = useCallback(() => dispatch(blur()), [ dispatch ])
    useHotkey('Escape', escape)

    return <Bloc.Root className={ styles.labels }>
        <Bloc.Title>
            Labels
            { hiddenLabelIds.length > 0 && <Button onClick={ showAllLabels }
                                                   className={ styles.showButton }>Show all</Button> }
        </Bloc.Title>
        <Bloc.Content>
            { sortedLabels.map((label) => <LabelChip label={ label } key={ label.id }/>) }
        </Bloc.Content>
    </Bloc.Root>
}

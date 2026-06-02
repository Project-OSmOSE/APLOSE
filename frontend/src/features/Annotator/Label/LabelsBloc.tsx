import React, { Fragment, useCallback } from 'react';
import styles from './styles.module.scss';
import { Bloc, Button } from '@/components/ui';
import { LabelChip } from './LabelChip';
import { useAppDispatch, useAppSelector } from '@/features/App';
import { selectHiddenLabels } from './selectors';
import { setHiddenLabels } from './slice';
import { useLoaderData } from '@tanstack/react-router';

export const LabelsBloc: React.FC = () => {
    const { labels } = useLoaderData({ from: '/_authenticated/annotation-campaign/$campaignID' })
    const hiddenLabels = useAppSelector(selectHiddenLabels)
    const dispatch = useAppDispatch()

    const showAllLabels = useCallback(() => {
        dispatch(setHiddenLabels([]))
    }, [ dispatch ])

    return <Bloc className={ styles.labels }
                 header={ <Fragment>
                     Labels
                     { hiddenLabels.length > 0 && <Button onClick={ showAllLabels }
                                                          fill="clear"
                                                          className={ styles.showButton }>Show all</Button> }
                 </Fragment> }>
        { labels.map((label) => <LabelChip label={ label.name } key={ label.id }/>) }
    </Bloc>
}

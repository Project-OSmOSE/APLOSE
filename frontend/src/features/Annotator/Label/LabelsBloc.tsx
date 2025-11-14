import React, { Fragment, useCallback } from 'react';
import styles from './styles.module.scss';
import { Bloc, Button } from '@/components/ui';
import { LabelChip } from './LabelChip';
import { useAppDispatch, useAppSelector } from '@/features/App';
import { selectAllLabels, selectHiddenLabels } from './selectors';
import { setHiddenLabels } from './slice';

export const LabelsBloc: React.FC = () => {
  const allLabels = useAppSelector(selectAllLabels)
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
    { allLabels.map((label, key) => <LabelChip label={ label } key={ key }/>) }
  </Bloc>
}

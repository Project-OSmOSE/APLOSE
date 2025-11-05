import React, { Fragment } from 'react';
import styles from './styles.module.scss';
import { Bloc, Button } from '@/components/ui';
import { useAnnotatorLabel } from './hooks';
import { LabelChip } from './LabelChip';

export const LabelsBloc: React.FC = () => {
  const {
    allLabels,
    hiddenLabels,
    showAllLabels,
  } = useAnnotatorLabel()

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

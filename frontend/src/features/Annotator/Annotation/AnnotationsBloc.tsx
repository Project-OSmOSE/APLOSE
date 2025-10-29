import React, { Fragment, useMemo } from 'react';
import { Bloc, Table, TableDivider } from '@/components/ui';
import styles from './styles.module.scss'
import { useAnnotatorAnnotation } from './hooks';
import { IonNote } from '@ionic/react';
import { AnnotationRow } from './AnnotationRow';

export const AnnotationsBloc: React.FC = () => {
  const { allAnnotations } = useAnnotatorAnnotation()

  const sortedAnnotations = useMemo(() => {
    // Need the spread to sort this readonly array
    return [ ...(allAnnotations ?? []) ].sort((a, b) => {
      if (a.label !== b.label) {
        return a.label.localeCompare(b.label);
      }
      return (a.startTime ?? 0) - (b.startTime ?? 0);
    })
  }, [ allAnnotations ])

  return <Bloc className={ styles.results }
               header="Annotations"
               vertical>
    { allAnnotations.length === 0 ?
        <IonNote color="medium">No results</IonNote> :
        <Table columns={ 10 }>
          { sortedAnnotations.map((a, index) => <Fragment key={ index }>
            { index > 0 && <TableDivider/> }
            <AnnotationRow annotation={ a }/>
          </Fragment>) }
        </Table>
    }
  </Bloc>
}

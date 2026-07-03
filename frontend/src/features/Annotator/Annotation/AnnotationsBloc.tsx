import React, { useMemo } from 'react';
import { Bloc, Table, Tbody } from '@/components/ui';
import styles from './styles.module.scss'
import { AnnotationRow } from './AnnotationRow';
import { useAppSelector } from '@/features/App';
import { selectAllAnnotations } from '@/features/Annotator/Annotation/selectors';
import { Note } from '@/components/base/Note';

export const AnnotationsBloc: React.FC = () => {
    const allAnnotations = useAppSelector(selectAllAnnotations)

    const sortedAnnotations = useMemo(() => {
        // Need the spread to sort this readonly array
        return [ ...(allAnnotations ?? []) ].sort((a, b) => {
            if (a.label !== b.label) {
                return a.label.localeCompare(b.label);
            }
            return (a.startTime ?? 0) - (b.startTime ?? 0);
        })
    }, [ allAnnotations ])

    return <Bloc.Root className={ styles.results }
                      data-testid="annotation-bloc">
        <Bloc.Title>Annotations</Bloc.Title>
        <Bloc.Content vertical>
            { allAnnotations.length === 0 ?
                <Note color="medium">No results</Note> :
                <Table>
                    <Tbody>
                        { sortedAnnotations.map((a, index) => <AnnotationRow annotation={ a } key={ index }/>) }
                    </Tbody>
                </Table>
            }
        </Bloc.Content>
    </Bloc.Root>
}

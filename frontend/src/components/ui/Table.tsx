import React, { type HTMLAttributes, ReactNode, useMemo } from 'react';
import styles from './ui.module.scss'
import { AltArrowDown, AltArrowUp, Filter } from '@solar-icons/react';

export const Table: React.FC<Pick<HTMLAttributes<HTMLTableRowElement>, 'children' | 'className'> & {
    spacing?: 'small' | 'regular'
}> = ({ children, spacing, className }) => {
    return useMemo(() => {
        const classes = [ styles.table ]
        if (className) classes.push(className)
        if (spacing == 'small') classes.push(styles.spacingSmall)
        return <div className={ classes.join(' ') }>
            <table>
                { children }
            </table>
        </div>
    }, [ children, spacing, className ])
}

export const Thead: React.FC<{ children: ReactNode }> = ({ children }) =>
    useMemo(() => <thead>{ children }</thead>, [ children ])

export const Tbody: React.FC<{ children?: ReactNode }> = ({ children }) =>
    useMemo(() => <tbody>{ children }</tbody>, [ children ])

export const Tr: React.FC<Pick<HTMLAttributes<HTMLTableRowElement>, 'children' | 'className' | 'onClick'>> =
    (props) => useMemo(() => <tr { ...props }/>, [ props ])

export type Order = 'asc' | 'desc';

export const Th: React.FC<{
    children?: ReactNode;
} & Partial<Pick<HTMLTableCellElement, 'scope' | 'colSpan' | 'rowSpan'>> &
    ({ center?: false, start?: false } | { center: true, start?: false } | { center?: false, start: true }) &
    ({ sortable?: false, order?: never, setOrder?: never } | {
        sortable: true,
        order?: Order | false,
        setOrder: (order: Order) => void
    }) & ({ filterable?: false, isFiltered?: never, onFilterClick?: never } | {
    filterable: true,
    isFiltered?: boolean,
    onFilterClick: () => void
})> =
    ({ children, center, start, sortable, order, setOrder, filterable, onFilterClick, isFiltered, ...props }) =>
        useMemo(() => {
            const classes = []
            if (center) classes.push(styles.center)
            if (start) classes.push(styles.start)
            if (sortable) classes.push(styles.sortable)
            if (filterable) classes.push(styles.filterable)

            return <th { ...props } className={ classes.join(' ') }>
                <div>
                    { children }

                    { filterable && <div className={ styles.btn }>
                        { isFiltered ?
                            <Filter size={ 16 } weight="Bold" onClick={ onFilterClick }/> :
                            <Filter size={ 16 } onClick={ onFilterClick }/> }
                    </div> }

                    { sortable && <div className={ styles.btn }>
                        <AltArrowUp size={ 16 }
                                    className={ order === 'asc' ? styles.active : '' }
                                    onClick={ () => setOrder('asc') }/>
                        <AltArrowDown size={ 16 }
                                      className={ order === 'desc' ? styles.active : '' }
                                      onClick={ () => setOrder('desc') }/>
                    </div> }
                </div>
            </th>
        }, [ children, center, start, setOrder, order, sortable, filterable, onFilterClick, isFiltered, props ])

export const Td: React.FC<Partial<Pick<HTMLTableDataCellElement, 'colSpan' | 'rowSpan'>> &
    { children: ReactNode, center?: boolean, className?: string }> = ({
                                                                                                center,
                                                                                                className,
                                                                                                ...props
                                                                                            }) =>
    useMemo(() => <td
        className={ [ className, center ? styles.center : '' ].join(' ') } { ...props }/>, [ props, center, className ])

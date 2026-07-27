import React, { createElement, type FunctionComponent, type HTMLAttributes } from 'react';
import { Link, type LinkComponentProps } from '@tanstack/react-router';
import styles from './styles.module.scss'
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { Center } from '@/components/layout/Display';
import { Note, Spinner } from '@/components/base';

const Root: React.FC<LinkComponentProps> = ({ className, ...props }) => (
    <Link className={ [ className, styles.Root ].join(' ') }
          { ...props }/>
)

const Head: React.FC<HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
    <div className={ [ className, styles.Head ].join(' ') }
         { ...props }/>
)

const Info: React.FC<HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
    <div className={ [ className, styles.Info ].join(' ') }
         { ...props }/>
)

type GroupProps<Data> = Pick<HTMLAttributes<HTMLDivElement>, 'className'> & {
    queryOptions: UseQueryOptions<Data[]>,
    card: FunctionComponent<Data>
}

function Grid<Data extends object>({ className, queryOptions, card }: GroupProps<Data>) {
    const { data, isFetching } = useQuery(queryOptions)

    if (isFetching)
        return <Center><Spinner/></Center>

    if (!data || data.length === 0)
        return <Center><Note color="medium">Empty</Note></Center>

    return <div className={ [ className, styles.Grid ].join(' ') }>
        { data?.map((d, key) => createElement(card, { ...d, key })) }
    </div>
}

export const Card = {
    Root,
    Head,
    Info,
    Grid,
}
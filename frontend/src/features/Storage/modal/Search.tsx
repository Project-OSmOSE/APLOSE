import React, { useCallback, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MagnifierLinearIcon } from '@solar-icons/react';
import type { BaseUIEvent } from '@base-ui/react';
import { gqlAPI } from '@/api/baseGqlApi';
import { WarningText } from '@/components/ui';
import { Button, Dialog, Field, Form, HelpButton, Note, Spinner } from '@/components/base';
import { Center } from "@/components/layout";
import { useAppDispatch } from '@/features/App';
import { Item } from '@/features/Storage';
import * as API from '../api'
import styles from './styles.module.scss'

export const Search: React.FC = () => {
    const [ searchQuery, setSearchQuery ] = useState<string | undefined>();

    const { isLoading, error, data: item } = useQuery({
        ...API.searchQuery({ path: searchQuery ?? '' }),
        enabled: !!searchQuery,
    })

    const dispatch = useAppDispatch();

    const invalidateStorage = useCallback(() => {
        dispatch(gqlAPI.util.invalidateTags([ 'Folders' ]))
    }, [ dispatch ])

    const submit = useCallback(async (event: BaseUIEvent<React.FormEvent<HTMLFormElement>>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        setSearchQuery(formData.get('search') as string)
    }, [ setSearchQuery ])

    const content = useMemo(() => {
        if (isLoading) return <Center><Spinner/></Center>
        if (error) return <WarningText error={ error }/>
        if (!searchQuery) return <Note color="medium">
            You can search for the exact path of:
            <ul>
                <li>a common folder</li>
                <li>a dataset folder</li>
                <li>an OSEkit dataset.json file describing a dataset</li>
            </ul>
        </Note>
        if (!item) return <Note color="warning">Not found</Note>
        return <Item path={ item.path } forceOpen onUpdated={ invalidateStorage }/>
    }, [ isLoading, error, item, searchQuery, invalidateStorage ])

    return (
        <Dialog.Content>
            <Dialog.Title>Search path</Dialog.Title>
            <Dialog.CloseIcon/>

            <Form className={styles.SearchForm}
                  onSubmit={ submit }>
                <Field.Root name="search">
                    <Field.Control required
                                   startIcon={ MagnifierLinearIcon }
                                   placeholder="Enter exact path"
                                   type="search"/>
                    <Field.Error/>
                </Field.Root>

                <Button color="primary" type="submit">Search</Button>
            </Form>

            <div className={ styles.SearchContent }>
                { content }
            </div>

            <HelpButton url="/doc/user/data/generate">
                How to generate a dataset
            </HelpButton>
        </Dialog.Content>
    )
}
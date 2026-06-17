import React, { useCallback, useMemo, useState } from 'react';
import { useAppDispatch } from '@/features/App';
import { gqlAPI } from '@/api/baseGqlApi';
import { WarningText } from '@/components/ui';
import { Item } from '@/features/Storage';
import { useQuery } from '@tanstack/react-query';
import * as API from '../api'
import { Button, HelpButton } from '@/components/base/Button';
import { Dialog } from '@/components/base/Dialog';
import { Form } from '@/components/base/Form';
import { Field } from '@/components/base/Field';
import { Spinner } from '@/components/base/Spinner';
import { Note } from '@/components/base/Note';
import { Magnifer } from '@solar-icons/react';
import type { BaseUIEvent } from '@base-ui/react';

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
        if (isLoading) return <Spinner/>
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
            <Dialog.Close/>

            <Form horizontal onSubmit={ submit }>
                <Field.Root name="search">
                    <Field.Control required
                                   startIcon={ Magnifer }
                                   placeholder="Enter exact path"
                                   type="text"/>
                    <Field.Error/>
                </Field.Root>

                <Button color="primary" type="submit">Search</Button>
            </Form>

            { content }

            <HelpButton url="/doc/user/data/generate">
                How to generate a dataset
            </HelpButton>
        </Dialog.Content>
    )
}
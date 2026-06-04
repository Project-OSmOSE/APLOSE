import React, { useCallback, useMemo, useState } from 'react';
import { useAppDispatch } from '@/features/App';
import { gqlAPI } from '@/api/baseGqlApi';
import { Modal, ModalFooter, ModalHeader, type ModalProps, WarningText } from '@/components/ui';
import { Item } from '@/features/Storage';
import { Searchbar } from '@/components/form';
import { IonNote, IonSpinner } from '@ionic/react';
import { useKeyDownEvent } from '@/features/UX';
import { useQuery } from '@tanstack/react-query';
import * as API from '../api'
import { Button, HelpButton } from '@/components/base/Button';

export const ImportFromPath: React.FC<ModalProps> = ({ onClose }) => {
    const [ searchQuery, setSearchQuery ] = useState<string | undefined>();
    const [ search, setSearch ] = useState<string | undefined>();
    const validateSearch = useCallback(() => {
        setSearchQuery(search)
    }, [ search, setSearchQuery ])
    useKeyDownEvent([ 'Enter' ], validateSearch)
    const updateSearch = useCallback((value: string) => {
        setSearch(value)
        if (!value) setSearchQuery(undefined)
    }, [ setSearch, setSearchQuery ])

    const { isLoading, error, data: item } = useQuery({
        ...API.searchQuery({ path: searchQuery ?? '' }),
        enabled: !!searchQuery,
    })

    const dispatch = useAppDispatch();

    const invalidateStorage = useCallback(() => {
        dispatch(gqlAPI.util.invalidateTags([ 'Folders' ]))
    }, [ dispatch ])

    const content = useMemo(() => {
        if (isLoading) return <IonSpinner/>
        if (error) return <WarningText error={ error }/>
        if (!searchQuery) return <IonNote>
            You can search for the exact path of:
            <ul>
                <li>a common folder</li>
                <li>a dataset folder</li>
                <li>an OSEkit dataset.json file describing a dataset</li>
            </ul>
        </IonNote>
        if (!item) return <IonNote>Not found</IonNote>
        return <Item path={ item.path } forceOpen onUpdated={ invalidateStorage }/>
    }, [ isLoading, error, item, searchQuery, invalidateStorage ])

    return (
        <Modal onClose={ onClose }>
            <ModalHeader title="Search path"
                         onClose={ onClose }/>

            <div style={ { display: 'flex', gap: '0.5rem' } }>
                <Searchbar placeholder="Enter exact path"
                           search={ search }
                           onInput={ updateSearch }/>
                <Button color="primary" onClick={ validateSearch }>Search</Button>
            </div>

            { content }

            <ModalFooter>
                <HelpButton url="/doc/user/data/generate">
                    How to generate a dataset
                </HelpButton>
            </ModalFooter>
        </Modal>
    )
}
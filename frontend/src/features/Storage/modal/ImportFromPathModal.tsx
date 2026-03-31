import React, { useCallback, useMemo, useState } from 'react';
import { IonNote, IonSpinner } from '@ionic/react';

import { useAppDispatch } from '@/features/App';
import { gqlAPI } from '@/api/baseGqlApi';
import {
    Button,
    GraphQLErrorText,
    HelpButton,
    Modal,
    ModalFooter,
    ModalHeader,
    type ModalProps,
} from '@/components/ui';
import { Searchbar } from '@/components/form';
import { useKeyDownEvent } from '@/features/UX';

import { useSearch } from '../hook'
import { Item } from '../components/Item'

export const ImportFromPathModal: React.FC<ModalProps> = ({ onClose }) => {
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

    const { item, isLoading, error } = useSearch(searchQuery)
    const dispatch = useAppDispatch();

    const invalidateStorage = useCallback(() => {
        dispatch(gqlAPI.util.invalidateTags([ 'Folders' ]))
    }, [ dispatch ])

    const content = useMemo(() => {
        if (isLoading) return <IonSpinner/>
        if (error) return <GraphQLErrorText error={ error }/>
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
                <Button fill="clear" onClick={ validateSearch }>Search</Button>
            </div>

            { content }

            <ModalFooter>
                <HelpButton url="/doc/user/data/generate"
                            label="How to generate a dataset"/>
            </ModalFooter>
        </Modal>
    )
}
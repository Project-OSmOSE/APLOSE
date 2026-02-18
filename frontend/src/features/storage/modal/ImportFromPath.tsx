import React, { useCallback, useState } from 'react';
import { useSearchStorage } from '@/api';
import { useAppDispatch } from '@/features/App';
import { gqlAPI } from '@/api/baseGqlApi';
import { Button, HelpButton, Modal, ModalFooter, ModalHeader, type ModalProps, WarningText } from '@/components/ui';
import { Item } from '@/features/storage';
import { Searchbar } from '@/components/form';
import { IonNote, IonSpinner } from '@ionic/react';
import { useKeyDownEvent } from '@/features/UX';

export const ImportFromPath: React.FC<ModalProps> = ({ onClose }) => {
    const [ searchQuery, setSearchQuery ] = useState<string | undefined>();
    const [ search, setSearch ] = useState<string | undefined>();
    const validateSearch = useCallback(() => {
        setSearchQuery(search)
    }, [ search, setSearchQuery ])
    useKeyDownEvent(['Enter'], validateSearch)

    const { item, isLoading, error } = useSearchStorage({ path: searchQuery ?? '' }, { skip: !searchQuery })
    const dispatch = useAppDispatch();

    const invalidateStorage = useCallback(() => {
        dispatch(gqlAPI.util.invalidateTags([ 'Folders' ]))
    }, [ dispatch ])

    return (
        <Modal onClose={ onClose }>
            <ModalHeader title="Import an analysis"
                         onClose={ onClose }/>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Searchbar placeholder='Enter exact path'
                           search={ search }
                           onInput={ setSearch }/>
                <Button fill="clear" onClick={ validateSearch }>Search</Button>
            </div>

            { isLoading ? <IonSpinner/> :
                error ? <WarningText error={ error }/> :
                    item ? <Item node={ item } onUpdated={ invalidateStorage }/> : <IonNote>Not found</IonNote> }

            <ModalFooter>
                <HelpButton url="/doc/user/data/generate"
                            label="How to generate a dataset"/>
            </ModalFooter>
        </Modal>
    )
}
import React, {
    createContext,
    createElement,
    Fragment,
    type FunctionComponent,
    type ReactNode,
    useCallback,
    useContext,
    useState,
} from 'react';
import { Dialog } from '../Dialog';
import type { Props } from './types';


type CreateDialogContext = {
    create: <Data, InputData extends Record<string, any>>(element: FunctionComponent<Props<Data, InputData>>, input?: Partial<InputData>) => Promise<Data | null>;
};

type DialogElement<Data, InputData extends Record<string, any>> = {
    element: FunctionComponent<Props<Data, InputData>>;
    input?: Partial<InputData>;
    resolve: (data: Data | null) => void;
}

export const CreateDialogContext = createContext<CreateDialogContext>({
    create: () => null!,
})

export const useCreateDialogContext = () => {
    const context = useContext(CreateDialogContext);
    if (!context) {
        throw new Error('useCreateDialogContext must be used within a CreateDialogProvider');
    }
    return context;
}

const Display: React.FC<{
    dialogs: DialogElement<any, any>[],
    onUpdated: (newDialogs: DialogElement<any, any>[]) => void
}> = ({ dialogs, onUpdated }) => {
    const current = dialogs[0];
    const others = dialogs.slice(1);

    const onOpenChange = useCallback((open: boolean) => {
        if (open) return;
        onUpdated([])
    }, [ onUpdated ])

    const onChildUpdated = useCallback((newDialogs: DialogElement<any, any>[]) => {
        return onUpdated([ current, ...newDialogs ])
    }, [ onUpdated, current ])

    if (dialogs.length === 0) return <Fragment/>
    return <Dialog.Root open onOpenChange={ onOpenChange }>
        <Dialog.Portal>
            { createElement(current.element, {
                children: <Display dialogs={ others } onUpdated={ onChildUpdated }/>,
                input: current.input,
                onCreate: current.resolve,
            }) }
        </Dialog.Portal>
    </Dialog.Root>
}

export const Provider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [ dialogs, setDialogs ] = useState<DialogElement<any, any>[]>([]);

    const create = useCallback(function <Data, InputData extends Record<string, any>>(element: FunctionComponent<Props<Data, InputData>>, input?: Partial<InputData>) {
        return new Promise<Data | null>((resolve) => setDialogs(prev => [ ...prev, { element, input, resolve } ]))
    }, [ dialogs ])

    return (
        <CreateDialogContext.Provider value={ { create } }>
            { children }

            <Display dialogs={ dialogs } onUpdated={ setDialogs }/>
        </CreateDialogContext.Provider>
    )
}
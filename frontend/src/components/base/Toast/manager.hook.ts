import { Toast } from '@base-ui/react/toast'
import { useCallback, useMemo } from 'react';
import type {
    ToastManagerAddOptions as BaseToastManagerAddOptions,
    ToastObject as BaseToastObject,
    UseToastManagerReturnValue as BaseUseToastManagerReturnValue,
} from '@base-ui/react';
import type { BaseColor } from '@/components/base/types';
import { getErrorMessage } from '@/service/function';
import type { ErrorType } from '@/api';
import { cleanGqlList } from '@/api/utils';

export type ToastManagerAddOptions<Data extends object = any> = BaseToastManagerAddOptions<Data> & { type?: BaseColor }
type ToastObject<Data extends object = any> = Omit<BaseToastObject<Data>, 'type'> & { type?: BaseColor }
type ErrorOptions = Omit<ToastManagerAddOptions<never>, 'type' | 'description'> & { error: any }
type GqlErrorOptions = Omit<ToastManagerAddOptions<never>, 'type' | 'description'> & {
    errors: Array<ErrorType | null> | null
}

type UseToastManagerReturnValue<Data extends object = any> =
    Omit<BaseUseToastManagerReturnValue<Data>, 'toasts' | 'add'>
    & {
    toasts: ToastObject<Data>[];
    add: <T extends Data = Data>(options: ToastManagerAddOptions<T>) => string;
    addError: (options: ErrorOptions) => string;
    addGqlError: (options: GqlErrorOptions) => string;
}

export const useToastManager = <Data extends object = any>(): UseToastManagerReturnValue<Data> => {
    const { add: baseAdd, toasts, ...baseManagerValue } = Toast.useToastManager<Data>()

    const add = useCallback((options: ToastManagerAddOptions<Data>) => baseAdd(options), [ baseAdd ])
    const addError = useCallback(({ error, ...options }: ErrorOptions) => add({
        description: getErrorMessage(error),
        type: 'danger',
        ...options,
    }), [ add ])
    const addGqlError = useCallback(({ errors, ...options }: GqlErrorOptions) => add({
        description: cleanGqlList(errors).map(e => `${ e.field }: ${ e.messages.join(' ') }`).join(' '),
        type: 'danger',
        ...options,
    }), [ add ])

    return useMemo(() => ({
        add,
        toasts: toasts as ToastObject<Data>[],
        addError, addGqlError,
        ...baseManagerValue,
    }), [ add, addError, addGqlError, toasts, baseManagerValue ])
}
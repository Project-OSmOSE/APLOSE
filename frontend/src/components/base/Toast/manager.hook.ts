import { Toast } from '@base-ui/react/toast'
import { useCallback, useMemo } from 'react';
import type {
    ToastManagerAddOptions,
    ToastObject as BaseToastObject,
    UseToastManagerReturnValue as BaseUseToastManagerReturnValue,
} from '@base-ui/react';
import type { BaseColor } from '@/components/base/types';
import { getErrorMessage } from '@/service/function';

type Options<Data extends object = any> = ToastManagerAddOptions<Data> & { type?: BaseColor }
type ToastObject<Data extends object = any> = Omit<BaseToastObject<Data>, 'type'> & { type?: BaseColor }
type ErrorOptions = Omit<ToastManagerAddOptions<never>, 'type' | 'description'> & { error: any }

type UseToastManagerReturnValue<Data extends object = any> = Omit<BaseUseToastManagerReturnValue<Data>, 'toasts' |'add'> & {
    toasts: ToastObject<Data>[];
    add: <T extends Data = Data>(options: Options<T>) => string;
    addError: (options: ErrorOptions) => string;
}

export const useToastManager = <Data extends object = any>(): UseToastManagerReturnValue<Data> => {
    const { add: baseAdd, toasts, ...baseManagerValue } = Toast.useToastManager<Data>()

    const add = useCallback((options: Options<Data>) => baseAdd(options), [ baseAdd ])
    const addError = useCallback(({ error, ...options }: ErrorOptions) => add({
        description: getErrorMessage(error),
        type: 'danger',
        ...options,
    }), [ add ])

    return useMemo(() => ({
        add,
        toasts: toasts as ToastObject<Data>[],
        addError,
        ...baseManagerValue,
    }), [ add, addError, toasts, baseManagerValue ])
}
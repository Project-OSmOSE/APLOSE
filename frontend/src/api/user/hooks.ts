import { useMemo } from 'react';
import { UserGqlAPI } from './api';

const {
    updateCurrentUserEmail,
    updateCurrentUserPassword,
} = UserGqlAPI.endpoints


export const useUpdateCurrentUserEmail = () => {
    const [ updateEmail, info ] = updateCurrentUserEmail.useMutation();

    return {
        updateEmail,
        ...useMemo(() => {
            const formErrors = info.data?.currentUserUpdate?.errors ?? []
            return {
                ...info,
                isSuccess: info.isSuccess && formErrors.length === 0,
                formErrors,
            }
        }, [ info ]),
    }
}

export const useUpdateCurrentUserPassword = () => {
    const [ updatePassword, info ] = updateCurrentUserPassword.useMutation();

    return {
        updatePassword,
        ...useMemo(() => {
            const formErrors = info.data?.userUpdatePassword?.errors ?? []
            return {
                ...info,
                isSuccess: info.isSuccess && formErrors.length === 0,
                formErrors,
            }
        }, [ info ]),
    }
}

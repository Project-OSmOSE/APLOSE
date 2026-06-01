import { useMemo } from 'react';
import { UserGqlAPI } from './api';

const {
    updateCurrentUserPassword,
} = UserGqlAPI.endpoints


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

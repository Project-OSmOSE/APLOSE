import { AuthRestAPI } from './api';
import { useCallback } from 'react';
import { gqlAPI, GqlTags } from '@/api/baseGqlApi.ts';
import { useNavigate } from '@tanstack/react-router';

const {
    login,
    logout,
} = AuthRestAPI.endpoints

export const useLogin = login.useMutation

export const useLogout = () => {
    const [ _method, info ] = logout.useMutation()
    const navigate = useNavigate();

    const method = useCallback(async () => {
        gqlAPI.util.invalidateTags(GqlTags)
        await navigate({ to: '/login' })
        return _method()
    }, [ _method, navigate ])

    return {
        logout: method,
        ...info,
    }
}
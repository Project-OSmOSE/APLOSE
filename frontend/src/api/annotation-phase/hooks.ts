import { AnnotationPhaseGqlAPI } from './api';
import { useMemo } from 'react';

const {
    createAnnotationPhase,
    createVerificationPhase,
} = AnnotationPhaseGqlAPI.endpoints

export const useCreateAnnotationPhase = () => {
    const [ method, info ] = createAnnotationPhase.useMutation()
    return {
        createAnnotationPhase: method,
        ...useMemo(() => {
            const formErrors = info.data?.updateAnnotationCampaign?.errors ?? []
            return {
                ...info,
                isSuccess: info.isSuccess && formErrors.length === 0,
                formErrors,
            }
        }, [ info ]),
    }
}

export const useCreateVerificationPhase = () => {
    const [ method, info ] = createVerificationPhase.useMutation()
    return {
        createVerificationPhase: method,
        ...info,
    }
}
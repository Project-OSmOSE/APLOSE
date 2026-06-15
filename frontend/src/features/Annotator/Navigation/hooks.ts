import { useCallback } from 'react';
import { useAlert } from '@/components/ui';
import { useNavigate, useParams, useSearch } from '@tanstack/react-router';
import { useAppSelector } from '@/features/App';
import { selectUpdated } from '@/features/Annotator/UX';

export const useAnnotatorCanNavigate = () => {
    const isUpdated = useAppSelector(selectUpdated);
    const alert = useAlert();

    return useCallback(async (): Promise<boolean> => {
        if (!isUpdated) return true;
        return new Promise<boolean>((resolve) => {
            alert.showAlert({
                type: 'Warning',
                message: `You have unsaved changes. Are you sure you want to forget all of them?`,
                actions: [ {
                    label: 'Forget my changes',
                    callback: () => resolve(true),
                } ],
                onCancel: () => resolve(false),
            })
        })
    }, [ alert, isUpdated ])
}

export const useOpenAnnotator = () => {
    const routeParams: any = useParams({ strict: false })
    const search: any = useSearch({ strict: false });
    const navigate = useNavigate()

    return useCallback((spectrogramID: string, options?: { resume?: boolean, replace?: boolean }) => {
        const _search = { ...search }
        if (options?.resume) _search.onlyAssigned = true
        navigate({
            to: '/annotation-campaign/$campaignID/phase/$phaseType/spectrogram/$spectrogramID',
            params: { ...routeParams, spectrogramID },
            search: _search,
            replace: options?.replace,
        });
    }, [ routeParams, search, navigate ])
}
import { useCallback } from 'react';
import { useAlert } from '@/components/ui';
import { useNavigate } from '@tanstack/react-router';
import { useParams } from 'react-router-dom';
import { useAllTasksFilters } from '@/api';
import { type AploseNavParams } from '@/features/UX';
import { useAppSelector } from '@/features/App';
import { selectUpdated } from '@/features/Annotator/UX';

export const useAnnotatorCanNavigate = () => {
    const isUpdated = useAppSelector(selectUpdated);
    const alert = useAlert();

    const canNavigate = useCallback(async (): Promise<boolean> => {
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

    return canNavigate
}

export const useOpenAnnotator = () => {
    const { campaignID, phaseType } = useParams<AploseNavParams>();
    const { params } = useAllTasksFilters()
    const navigate = useNavigate()

    return useCallback((spectrogramID: string) => {
        navigate({
            to: '/annotation-campaign/$campaignID/phase/$phaseType/spectrogram/$spectrogramID',
            params: { campaignID, phaseType, spectrogramID },
            search: params
        });
    }, [ campaignID, phaseType, params, navigate ])
}
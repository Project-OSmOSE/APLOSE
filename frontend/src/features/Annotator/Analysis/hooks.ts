import { useLoaderData } from '@tanstack/react-router';
import { useAppSelector } from '@/features/App';
import { selectAnalysisID } from './selectors';
import { useMemo } from 'react';

export const useAnnotatorAnalysis = () => {
    const { analysis } = useLoaderData({ from: '/_authenticated/annotation-campaign/$campaignID' })
    const id = useAppSelector(selectAnalysisID)
    return useMemo(() => analysis.find(a => a.id === id), [ analysis, id ])
}
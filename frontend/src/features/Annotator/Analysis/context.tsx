import React, { createContext, ReactNode, useContext, useState } from 'react';
import { useLoaderData } from '@tanstack/react-router';
import type { CampaignAnalysisFragment } from '@/features/AnnotationCampaign';


type AnnotatorAnalysisContext = {
    allAnalysis: CampaignAnalysisFragment[],
    selectedAnalysis: CampaignAnalysisFragment | null,
    setSelectedAnalysis: (value: CampaignAnalysisFragment | null) => void,
};

type AnnotatorAnalysisContextProvider = {
    children: ReactNode;
};

export const AnnotatorAnalysisContext = createContext<AnnotatorAnalysisContext>({
    allAnalysis: [],

    selectedAnalysis: null!,
    setSelectedAnalysis: () => null,
})

export const AnnotatorAnalysisProvider: React.FC<AnnotatorAnalysisContextProvider> = ({ children }) => {
    const {
        analysis: allAnalysis,
    } = useLoaderData({ from: '/_authenticated/annotation-campaign/$campaignID' })
    const {
        defaultAnalysis,
    } = useLoaderData({ from: '/_authenticated/annotation-campaign/$campaignID/phase/$phaseType/spectrogram/$spectrogramID' })

    const [ selectedAnalysis, setSelectedAnalysis ] = useState<CampaignAnalysisFragment | null>(defaultAnalysis ?? null);

    return (
        <AnnotatorAnalysisContext.Provider value={ {
            allAnalysis,
            selectedAnalysis, setSelectedAnalysis,
        } }>
            { children }
        </AnnotatorAnalysisContext.Provider>
    )
}

export const useAnnotatorAnalysis = () => {
    const context = useContext(AnnotatorAnalysisContext);
    if (!context) {
        throw new Error('useAnnotatorAnalysis must be used within a AnnotatorAnalysisProvider');
    }
    return context;
}

import React, { createContext, ReactNode, useContext, useState } from 'react';
import { useLoaderData } from '@tanstack/react-router';
import type { Campaign } from '@/features/AnnotationCampaign';


type AnnotatorAnalysisContext = {
    allAnalysis: Campaign.AnalysisFragment[],
    selectedAnalysis: Campaign.AnalysisFragment | null,
    setSelectedAnalysis: (value: Campaign.AnalysisFragment | null) => void,
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

    const [ selectedAnalysis, setSelectedAnalysis ] = useState<Campaign.AnalysisFragment | null>(defaultAnalysis ?? null);

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

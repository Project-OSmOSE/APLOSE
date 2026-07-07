import React, { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useLoaderData } from '@tanstack/react-router';
import type { CampaignAnalysisFragment } from '@/features/AnnotationCampaign';
import type { Colormap } from '@/features/Colormap';


type AnnotatorAnalysisContext = {
    allAnalysis: CampaignAnalysisFragment[],
    selectedAnalysis: CampaignAnalysisFragment | null,
    setSelectedAnalysis: (value: CampaignAnalysisFragment | null) => void,

    canChangeColormap: boolean,

    colormap: Colormap | null,
    setColormap: (color: Colormap | null) => void,

    isColormapInverted: boolean,
    setIsColormapInverted: (value: boolean) => void,
    revertColormap: () => void,

    brightness: number;
    setBrightness: (value: number) => void,
    resetBrightness: () => void,

    contrast: number;
    setContrast: (value: number) => void,
    resetContrast: () => void,
};

type AnnotatorAnalysisContextProvider = {
    children: ReactNode;
};

export const AnnotatorAnalysisContext = createContext<AnnotatorAnalysisContext>({
    allAnalysis: [],

    selectedAnalysis: null!,
    setSelectedAnalysis: () => null,

    canChangeColormap: false,

    colormap: null,
    setColormap: () => null,

    isColormapInverted: false,
    setIsColormapInverted: () => null,
    revertColormap: () => null,

    brightness: 50,
    setBrightness: () => null,
    resetBrightness: () => null,

    contrast: 50,
    setContrast: () => null,
    resetContrast: () => null,
})

export const AnnotatorAnalysisProvider: React.FC<AnnotatorAnalysisContextProvider> = ({ children }) => {
    const {
        campaign,
        analysis: allAnalysis,
    } = useLoaderData({ from: '/_authenticated/annotation-campaign/$campaignID' })
    const {
        spectrogram,
        defaultAnalysis,
    } = useLoaderData({ from: '/_authenticated/annotation-campaign/$campaignID/phase/$phaseType/spectrogram/$spectrogramID' })

    const [ selectedAnalysis, setSelectedAnalysis ] = useState<CampaignAnalysisFragment | null>(defaultAnalysis ?? null);
    const [ colormap, setColormap ] = useState<Colormap | null>(campaign.colormapDefault as Colormap | undefined ?? null);
    const [ isColormapInverted, setIsColormapInverted ] = useState<boolean>(campaign.colormapInvertedDefault ?? false);
    const [ brightness, setBrightness ] = useState<number>(50);
    const [ contrast, setContrast ] = useState<number>(50);

    const canChangeColormap = useMemo(() => {
        if (!campaign.allowColormapTuning) return false;
        return selectedAnalysis?.colormap.name === 'Greys' as Colormap
    }, [ campaign, selectedAnalysis ])

    const revertColormap = useCallback(() => setIsColormapInverted(prev => !prev), [])
    const resetBrightness = useCallback(() => setBrightness(50), [])
    const resetContrast = useCallback(() => setContrast(50), [])

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        resetBrightness();
        resetContrast();
    }, [ spectrogram ]);

    return (
        <AnnotatorAnalysisContext.Provider value={ {
            allAnalysis,
            selectedAnalysis, setSelectedAnalysis,
            canChangeColormap,
            colormap, setColormap,
            isColormapInverted, setIsColormapInverted, revertColormap,
            brightness, setBrightness, resetBrightness,
            contrast, setContrast, resetContrast,
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

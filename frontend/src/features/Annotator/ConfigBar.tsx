import React, { useMemo } from 'react';
import {
    CalendarMinimalisticBoldDuotoneIcon,
    TargetBoldDuotoneIcon,
    TelescopeBoldDuotoneIcon
} from '@solar-icons/react';
import { useLoaderData } from '@tanstack/react-router';
import { useAnnotatorAnalysis } from '@/features/Annotator/Analysis';
import { ButtonGroup, Dialog, Note, Popover } from '@/components/base';
import { Zoom } from '@/features/Annotator/Zoom';
import { usePointer } from '@/features/Annotator/Pointer';
import { formatTime } from '@/service/function';
import { AnalysisComponent } from '@/features/SpectrogramAnalysis';
import { ImageSettings } from './ImageSettings';
import { MxData } from "../Mx";
import { cleanGqlList } from "@/api/utils.ts";

export const ConfigBar: React.FC = () => {
    const {
        analysis: allAnalysis,
    } = useLoaderData({ from: '/_authenticated/annotation-campaign/$campaignID' })
    const { spectrogram } = useLoaderData({ from: '/_authenticated/annotation-campaign/$campaignID/phase/$phaseType/spectrogram/$spectrogramID' })

    // Spectrogram analysis
    const {
        selectedAnalysis, setSelectedAnalysis,
    } = useAnnotatorAnalysis()

    // Pointer
    const pointer = usePointer()

    const obs = useMemo(() => cleanGqlList(spectrogram.visualObservations), [ spectrogram ])

    return <ButtonGroup spaceBetween>

        <ButtonGroup>
            <AnalysisComponent.Select items={ allAnalysis }
                                      value={ selectedAnalysis }
                                      onValueChange={ setSelectedAnalysis }/>

            <ImageSettings.ColormapButtons/>
            <ImageSettings.ImageTuningButtons/>

            <Zoom.Buttons/>

            <ImageSettings.UpdateSpinner/>
        </ButtonGroup>

        { pointer.position && <ButtonGroup>
            <Note color="medium" flex><TargetBoldDuotoneIcon size={ 16 }/></Note>
            <Note data color="dark">{ pointer.position.frequency.toFixed(2) }Hz
                / { formatTime(pointer.position.time, (spectrogram?.duration ?? 0) < 60) }</Note>
        </ButtonGroup> }

        <ButtonGroup>
            { obs.length > 0 && <Dialog.Root>
                <Popover.Root>
                    <Popover.Trigger render={ <div/> } nativeButton={ false }>
                        <Dialog.Trigger color='primary'><TelescopeBoldDuotoneIcon size={ 20 }/></Dialog.Trigger>
                    </Popover.Trigger>
                    <Popover.Content>
                        Visual observations
                    </Popover.Content>
                </Popover.Root>
                <Dialog.Portal>
                    <Dialog.Content>
                        <Dialog.Title>Visual observations</Dialog.Title>
                        <Dialog.CloseIcon/>
                        <MxData.VisualObservationTable obs={ obs }/>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root> }
            <ButtonGroup smallGap>
                <Note color="medium" flex><CalendarMinimalisticBoldDuotoneIcon size={ 16 }/></Note>
                <Note color="dark">{ new Date(spectrogram.start).toUTCString() }</Note>
            </ButtonGroup>
        </ButtonGroup>

    </ButtonGroup>
}
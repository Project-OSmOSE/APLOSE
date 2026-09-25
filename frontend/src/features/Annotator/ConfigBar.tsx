import React, { useMemo } from 'react';
import {
    CalendarMinimalisticBoldDuotoneIcon,
    TargetBoldDuotoneIcon,
    TelescopeBoldDuotoneIcon
} from '@solar-icons/react';
import { useLoaderData } from '@tanstack/react-router';
import { useAnnotatorAnalysis } from '@/features/Annotator/Analysis';
import { ButtonGroup, Dialog, Popover, Note } from '@/components/base';
import { Zoom } from '@/features/Annotator/Zoom';
import { usePointer } from '@/features/Annotator/Pointer';
import { formatTime } from '@/service/function';
import { AnalysisComponent } from '@/features/SpectrogramAnalysis';
import { ImageSettings } from './ImageSettings';
import { MxData } from "../Mx";
import { VisualObservationFragment } from "@/features/AnnotationSpectrogram";

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

    const obs = useMemo(() => [
            {
                source: {
                    displayName: 'Stripped dolphin',
                },
                otherHumanActivityPresence: true,
                youngPresence: false,
                behaviors: [
                    { name: 'eat' },
                    { name: 'sleep' },
                    { name: 'rest' },
                    { name: 'mate' }
                ],
                reactionsToBoat: [
                    { name: 'avoid the boat' },
                ],
                startDatetime: spectrogram.start,
                endDatetime: spectrogram.start,
                additionalInformation: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In semper facilisis tortor nec venenatis. Nulla a feugiat lectus. Duis tortor enim, hendrerit quis lacus in, aliquet scelerisque arcu. Pellentesque consectetur faucibus aliquam. In a pretium augue. Phasellus non sem lacinia, convallis neque non, vulputate nibh. In blandit cursus libero, sed gravida augue rhoncus in. Suspendisse potenti. Sed posuere massa et urna dapibus, sit amet gravida turpis placerat. Aliquam vulputate gravida fringilla. Curabitur sit amet sapien non metus gravida ornare. Nulla facilisi. Fusce id arcu quis purus venenatis lacinia. Aenean vehicula nisi vitae dolor accumsan tristique. Integer sapien magna, venenatis ut tincidunt non, maximus eu lacus. Maecenas eget varius nisi.\n' +
                    '\n' +
                    'In hac habitasse platea dictumst. Etiam viverra, risus mollis auctor dictum, lacus tellus lobortis nunc, id consequat nunc magna at lorem. Vestibulum massa libero, tempor egestas pulvinar sit amet, vestibulum nec nunc. Etiam tristique elit tellus, a imperdiet mi molestie ut. Duis lobortis magna quis eros sodales, id ultrices purus venenatis. Maecenas fringilla risus erat, ac ultrices nisi consectetur ac. Vivamus vel enim eu nunc eleifend porttitor. Suspendisse in dolor nulla. Vivamus porta imperdiet tellus. Donec sit amet auctor orci. Curabitur id molestie nibh. Ut vitae ultricies tortor, sed euismod elit.',
                countMin: 10,
                countMax: 50,
                startDistanceMin: 10,
                startDistanceMax: 100,
                endDistanceMin: 1000,
                endDistanceMax: null,
            } satisfies VisualObservationFragment
        ]
        // || cleanGqlList(spectrogram.visualObservations)
        , [ spectrogram ])

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
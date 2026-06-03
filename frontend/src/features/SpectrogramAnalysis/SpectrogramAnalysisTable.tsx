import React, { useEffect } from 'react';
import { IonIcon, IonNote } from '@ionic/react';
import { downloadOutline } from 'ionicons/icons/index.js';
import { dateToString } from '@/service/function';
import { Button, Table, Tbody, Td, Th, Thead, Tr, useToast } from '@/components/ui';
import { useDownloadAnalysis } from '@/api/download';
import type { AllSpectrogramAnalysisQuery } from '@/features/SpectrogramAnalysis/api';

type Analysis = NonNullable<NonNullable<AllSpectrogramAnalysisQuery['allSpectrogramAnalysis']>['results'][number]>
export const SpectrogramAnalysisTable: React.FC<{ analysis: Analysis[] }> = ({ analysis }) => {
    const [ downloadAnalysis, { error: downloadError } ] = useDownloadAnalysis()
    const toast = useToast()

    useEffect(() => {
        if (downloadError) toast.raiseError({ error: downloadError })
    }, [ downloadError ]);

    if (analysis.length === 0) return <IonNote color="medium">No spectrogram analysis</IonNote>

    return <Table>
        <Thead>
            <Tr>
                <Th scope="col">Name</Th>
                <Th scope="col">Type</Th>
                <Th scope="col">Created at</Th>
                <Th scope="col">Number of files</Th>
                <Th scope="col">Start date</Th>
                <Th scope="col">End date</Th>
                <Th scope="col">File duration</Th>
                <Th scope="col">Sampling frequency</Th>
                <Th scope="col">NFFT</Th>
                <Th scope="col">Window size</Th>
                <Th scope="col">Overlap</Th>
                <Th scope="col">Configuration</Th>
            </Tr>
        </Thead>

        <Tbody>
            { analysis.map(analysis => <Tr key={ analysis.id }>
                <Th scope="col">{ analysis.name }</Th>
                <Td>Spectrogram</Td>
                <Td>{ dateToString(analysis.createdAt) }</Td>
                <Td>{ analysis.spectrograms!.totalCount }</Td>
                <Td>{ dateToString(analysis.start) }</Td>
                <Td>{ dateToString(analysis.end) }</Td>
                <Td>{ analysis.dataDuration }</Td>
                <Td>{ analysis.fft.samplingFrequency }</Td>
                <Td>{ analysis.fft.nfft }</Td>
                <Td>{ analysis.fft.windowSize }</Td>
                <Td>{ analysis.fft.overlap }</Td>
                <Td>
                    <Button size="small" color="dark" fill="clear" onClick={ () => downloadAnalysis(analysis) }>
                        <IonIcon icon={ downloadOutline } slot="icon-only"/>
                    </Button>
                    <br/>
                    { analysis.legacy && <IonNote color="medium">{ 'OSEkit v<0.2.5' }</IonNote> }
                </Td>
            </Tr>) }
        </Tbody>
    </Table>
}

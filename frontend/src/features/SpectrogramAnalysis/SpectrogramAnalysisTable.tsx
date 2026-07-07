import React, { useEffect } from 'react';
import { dateToString } from '@/service/function';
import { Table, Tbody, Td, Th, Thead, Tr } from '@/components/ui';
import { Toast } from '@/components/base/Toast';
import { useDownloadAnalysis } from '@/api/download';
import type { AllSpectrogramAnalysisQuery } from '@/features/SpectrogramAnalysis/api';
import { Button } from '@/components/base/Button';
import { Download } from '@solar-icons/react';
import { Note } from '@/components/base/Note';

type Analysis = NonNullable<NonNullable<AllSpectrogramAnalysisQuery['allSpectrogramAnalysis']>['results'][number]>
export const SpectrogramAnalysisTable: React.FC<{
    analysis: Analysis[],
    spacing?: 'small' | 'regular'
}> = ({ analysis, spacing }) => {
    const [ downloadAnalysis, { error: downloadError } ] = useDownloadAnalysis()
    const toastManager = Toast.useToastManager()

    useEffect(() => {
        if (downloadError) toastManager.addError({ title: 'Download analysis failed', error: downloadError })
    }, [ downloadError ]);

    if (analysis.length === 0) return <Note color="medium">No spectrogram analysis</Note>

    return <Table spacing={ spacing }>
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
                    <Button onClick={ () => downloadAnalysis(analysis) }>
                        <Download weight="Linear" size={ 20 }/>
                    </Button>
                    { analysis.legacy && <Note color="medium">{ 'OSEkit v<0.2.5' }</Note> }
                </Td>
            </Tr>) }
        </Tbody>
    </Table>
}

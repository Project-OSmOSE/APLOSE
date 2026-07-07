import { useCallback } from 'react';

import type { ColormapNode, FftNode, LinearScaleNode, Maybe, SpectrogramAnalysisNode } from '@/api/types.gql-generated';
import { Note, Select as BaseSelect, SelectProps as BaseSelectProps } from '@/components/base'
import { cleanGqlList } from '@/api/utils';
import { frequencyToString } from '@/service/function';

export type SelectValue = Pick<SpectrogramAnalysisNode, 'id'> & {
    fft: Pick<FftNode, 'nfft' | 'windowSize' | 'overlap' | 'samplingFrequency'>,
    colormap: Pick<ColormapNode, 'name'>,
    frequencyScaleParts?: Maybe<Array<Maybe<Pick<LinearScaleNode, 'minValue' | 'maxValue'>>>>;
}

export type SelectProps<Value> = Omit<BaseSelectProps<Value, false>, 'itemName' | 'itemToStringValue' | 'itemToElementLabel' | 'isItemEqualToValue'>

export function Select<Value extends SelectValue>(props: SelectProps<Value>) {

    const itemToElementLabel = useCallback((item: SelectValue) => {
        const parts = cleanGqlList(item.frequencyScaleParts)
        const defaultMax = item.fft.samplingFrequency / 2
        let min = 0
        let max = defaultMax
        if (parts.length) {
            min = Math.min(...parts.map(a => a?.minValue ?? 0))
            max = Math.max(...parts.map(a => a?.maxValue ?? defaultMax))
        }
        return <div>
            <Note color="medium">nfft: </Note>{ item.fft.nfft }
            <Note color="medium"> | winsize: </Note>{ item.fft.windowSize }
            <Note color="medium"> | overlap: </Note>{ item.fft.overlap }
            <Note color="medium"> |
                scale: </Note>{ parts.length > 0 ? parts.length : 1 } [{ frequencyToString(min) }Hz-{ frequencyToString(max) }Hz]
            <Note color="medium"> | colormap: </Note>{ item.colormap.name }
        </div>
    }, [])

    const valueItemToElementLabel = useCallback((item: SelectValue) => {
        const parts = cleanGqlList(item.frequencyScaleParts)
        const defaultMax = item.fft.samplingFrequency / 2
        let min = 0
        let max = defaultMax
        if (parts.length) {
            min = Math.min(...parts.map(a => a?.minValue ?? 0))
            max = Math.max(...parts.map(a => a?.maxValue ?? defaultMax))
        }
        return <div>
            { item.fft.nfft }_{ item.fft.windowSize }_{ item.fft.overlap }
            <Note
                color="medium"> | { parts.length > 0 ? parts.length : 1 } [{ frequencyToString(min) }Hz-{ frequencyToString(max) }Hz]
                | { item.colormap.name }</Note>
        </div>
    }, [])

    return (
        <BaseSelect itemName="analysis"
                    itemToStringValue={ item => item.id }
                    itemToElementLabel={ itemToElementLabel }
                    valueItemToElementLabel={ valueItemToElementLabel }
                    isItemEqualToValue={ (a, b) => a.id === b.id }
                    { ...props }/>
    )
}
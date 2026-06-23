import React, { Fragment } from 'react';
import * as API from '../api';
import { cleanGqlList } from '@/api/utils';

type N<T> = NonNullable<T>
type Set = N<N<API.ListConfidenceSetsQuery['allConfidenceSets']>['results'][number]>
export const SetDescription: React.FC<{ set?: Set | null }> = ({ set }) => {
    if (!set) return <Fragment/>
    return <Fragment>
        { set.desc && set.desc.split('\r\n').map(d => <p key={ d }>{ d }</p>) }
        { cleanGqlList(set.confidenceIndicators).map(i => (
            <p key={ i!.label }><b>{ i!.level }:</b> { i!.label }</p>
        )) }
    </Fragment>
}

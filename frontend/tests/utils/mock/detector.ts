import type { GqlQuery } from './_types';
import type { ListDetectorsQuery } from '../../../src/api/detector/detector.generated';
import { detector, detectorConfiguration } from './types';


export const DETECTOR_QUERIES: {
  listDetectors: GqlQuery<ListDetectorsQuery>,
} = {
  listDetectors: {
    defaultType: 'filled',
    empty: {
      allDetectors: null,
    },
    filled: {
      allDetectors: {
        results: [ {
          id: detector.id,
          name: detector.name,
          configurations: [ {
            id: detectorConfiguration.id,
            configuration: detectorConfiguration.configuration,
          } ],
        } ],
      },
    },
  },
}


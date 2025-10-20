import { restAPI } from '@/api/baseRestApi';
import { AnnotationPhaseType, type ImportAnnotation, PostAnnotation } from '@/api';

const keys: (keyof ImportAnnotation)[] = [
  'id',
  'start_time',
  'end_time',
  'start_frequency',
  'end_frequency',
  'label',
  'confidence',
  'analysis',
  'detector_configuration',
  'spectrogram',
];

export const AnnotationRestAPI = restAPI.injectEndpoints({
  endpoints: builder => ({
    updateAnnotations: builder.mutation<void, {
      campaignID: string | number;
      phaseType: AnnotationPhaseType;
      spectrogramID: string | number;
      annotations: PostAnnotation[]
    }>({
      query: ({ campaignID, phaseType, spectrogramID, annotations }) => ({
        url: `annotation/campaign/${ campaignID }/phase/${ phaseType }/spectrogram/${ spectrogramID }/`,
        method: 'POST',
        body: annotations.map(a => ({
          ...a,
          validations: [ a.validation ],
        })),
      }),
    }),
    importAnnotations: builder.mutation<void, {
      campaignID: string | number;
      annotations: ImportAnnotation[];
      force_datetime?: boolean;
      force_max_frequency?: boolean;
    }>({
      query: ({ campaignID, annotations, ...params }) => {
        return {
          url: `annotation/campaign/${ campaignID }/phase/${ AnnotationPhaseType.Annotation }/`,
          method: 'POST',
          params,
          body: [
            keys.join(','),
            ...annotations.map(a => keys.map(k => `"${ a[k] }"`).join(',')),
          ].join('\n'),
        }
      },
    }),
  }),
})

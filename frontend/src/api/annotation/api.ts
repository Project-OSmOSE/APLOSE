import { restAPI } from '@/api/baseRestApi';
import { AnnotationPhaseType, type ImportAnnotation } from '@/api';


const keys: (keyof ImportAnnotation)[] = [
  'start_datetime',
  'end_datetime',
  'min_frequency',
  'max_frequency',
  'label',
  'confidence_indicator_label',
  'confidence_indicator_level',
  'detector',
  'detector_configuration',
];

export type ImportAnnotationsParams = {
  campaignID: string | number;
  annotations: ImportAnnotation[];
  force_datetime?: boolean;
  force_max_frequency?: boolean;
}
export const AnnotationRestAPI = restAPI.injectEndpoints({
  endpoints: builder => ({
    importAnnotations: builder.mutation<void, ImportAnnotationsParams>({
      query: ({ campaignID, annotations, ...params }) => {
        return {
          url: `/api/annotation/campaign/${ campaignID }/phase/${ AnnotationPhaseType.Annotation }/`,
          method: 'POST',
          params,
          body: {
            data: [
              keys.join(','),
              ...annotations.map(a => keys.map(k => `"${ a[k] }"`).join(',')),
            ].join('\n'),
          },
        }
      },
    }),
  }),
})

import { restAPI } from '@/api/baseRestApi';
import { AnnotationPhaseType, type ImportAnnotation } from '@/api';


const keys: (keyof ImportAnnotation)[] = [
  'start_datetime',
  'end_datetime',
  'start_frequency',
  'end_frequency',
  'label__name',
  'confidence__label',
  'confidence__level',
  'detector__name',
  'detector_configuration__configuration',
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

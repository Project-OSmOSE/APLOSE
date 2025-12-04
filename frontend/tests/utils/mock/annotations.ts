import { type RestQuery } from './_types';
import { campaign } from './types';
import { AnnotationPhaseType } from '../../../src/api/types.gql-generated';

export const ANNOTATION_MUTATIONS: {
  importAnnotations: RestQuery<undefined, never>
} = {
  importAnnotations: {
    url: `api/annotation/campaign/${ campaign.id }/phase/${ AnnotationPhaseType.Annotation }/`,
    success: {
      status: 200,
      json: undefined,
    },
  },
}

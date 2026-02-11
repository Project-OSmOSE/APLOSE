import type { GqlQuery } from './_types';
import type { HomeCollaboratorsQuery } from '../../../src/api/collaborator/collaborator.generated';
import { collaborator } from './types';

export const COLLABORATOR_QUERIES: {
    homeCollaborators: GqlQuery<HomeCollaboratorsQuery>
} = {
    homeCollaborators: {
        defaultType: 'filled',
        empty: {
            allCollaborators: null,
        },
        filled: {
            allCollaborators: {
                results: [
                    collaborator,
                ],
            },
        },
    },
}

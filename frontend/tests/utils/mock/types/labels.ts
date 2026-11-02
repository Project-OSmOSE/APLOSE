import { LabelNode, type Maybe, SoundNode, SourceNode } from '../../../../src/api/types.gql-generated';

export type Label = Pick<LabelNode, 'id' | 'displayName'> & {
    sound?: Maybe<Pick<SoundNode, 'englishName'>>;
    source: Pick<SourceNode, 'englishName'>;
}
export const LABELS: { [key in 'classic' | 'featured']: Label } = {
    classic: {
        id: '1',
        displayName: 'Rain',
        source: {
            englishName: 'Rain'
        }
    },
    featured: {
        id: '2',
        displayName: 'Whale - Whistle',
        source: {
            englishName: 'Whale'
        },
        sound: {
            englishName: 'Whistle'
        }
    },
}
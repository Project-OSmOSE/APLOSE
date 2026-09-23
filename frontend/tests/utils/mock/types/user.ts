import { ExpertiseLevelType, type UserNode } from '../../../../src/api/types.gql-generated';
import { User as UserFeature } from '../../../../src/features/User';

export type User = Omit<UserNode, '__typename'
  | 'annotationcampaignSet'
  | 'annotationComments'
  | 'annotations'
  | 'annotationTasks'
  | 'annotationFileRanges'
  | 'annotationResultsValidation'
  | 'annotatorGroups'
  | 'archives'
  | 'createdPhases'
  | 'datasetSet'
  | 'dateJoined'
  | 'endedPhases'
  | 'lastLogin'
  | 'spectrogramAnalysis'>

export type UserType = 'annotator' | 'creator' | 'staff' | 'superuser';

function getUser(type: UserType, id: number): User {
  const firstName = type.charAt(0).toUpperCase() + type.slice(1);
  const lastName = 'Test'
  return {
    id: id.toString(),
    firstName,
    lastName,
    displayName: `${ firstName } ${ lastName }`,
    expertise: ExpertiseLevelType.Novice,
    email: 'user@test.com',
    isActive: true,
    username: type,
    isAdmin: type === 'superuser' || type === 'staff',
    isStaff: type === 'staff',
    isSuperuser: type === 'superuser',
  }
}

export const USERS: { [key in UserType]: User } = {
  annotator: getUser('annotator', 1),
  creator: getUser('creator', 2),
  staff: getUser('staff', 3),
  superuser: getUser('superuser', 4),
}

export type UserGroup = UserFeature.GroupFragment
export const userGroup: UserGroup = {
  __typename: 'UserGroupNode',
  id: '1',
  name: 'Test group',
  users: [
    USERS.annotator,
  ]
}

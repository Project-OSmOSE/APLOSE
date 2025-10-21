import { ExpertiseLevel, type UserGroupNode, type UserNode } from '../../../src/api/types.gql-generated';
import type { GqlQuery } from './_types';
import type { GetCurrentUserQuery, ListUsersQuery } from '../../../src/api/user';

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
    expertise: ExpertiseLevel.Novice,
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

export type UserGroup = Omit<UserGroupNode, 'users'>
export const userGroup: UserGroup = {
  id: '1',
  name: 'Test group',
}

export const GET_CURRENT_USER_QUERY: { [key in UserType | 'empty']: GetCurrentUserQuery } = {
  annotator: {
    currentUser: {
      id: USERS.annotator.id,
      username: USERS.annotator.username,
      displayName: USERS.annotator.displayName,
      email: USERS.annotator.email,
      isAdmin: USERS.annotator.isAdmin,
      isSuperuser: USERS.annotator.isSuperuser,
    },
  },
  creator: {
    currentUser: {
      id: USERS.creator.id,
      username: USERS.creator.username,
      displayName: USERS.creator.displayName,
      email: USERS.creator.email,
      isAdmin: USERS.creator.isAdmin,
      isSuperuser: USERS.creator.isSuperuser,
    },
  },
  staff: {
    currentUser: {
      id: USERS.staff.id,
      username: USERS.staff.username,
      displayName: USERS.staff.displayName,
      email: USERS.staff.email,
      isAdmin: USERS.staff.isAdmin,
      isSuperuser: USERS.staff.isSuperuser,
    },
  },
  superuser: {
    currentUser: {
      id: USERS.superuser.id,
      username: USERS.superuser.username,
      displayName: USERS.superuser.displayName,
      email: USERS.superuser.email,
      isAdmin: USERS.superuser.isAdmin,
      isSuperuser: USERS.superuser.isSuperuser,
    },
  },
  empty: {
    currentUser: null,
  },
}

export const USER_QUERIES: {
  listUsers: GqlQuery<ListUsersQuery>,
} = {
  listUsers: {
    defaultType: 'filled',
    empty: {
      allUsers: null,
      allUserGroups: null,
    },
    filled: {
      allUsers: {
        results: Object.values(USERS).map(u => ({
          id: u.id,
          displayName: u.displayName,
          expertise: u.expertise,
        })),
      },
      allUserGroups: {
        results: [ {
          id: userGroup.id,
          name: userGroup.name,
          users: [ {
            id: USERS.annotator.id,
          } ],
        } ],
      },
    },
  },
}

import type { GqlQuery } from './_types';
import type { GetCurrentUserQuery, ListUsersQuery } from '../../../src/api/user';
import { userGroup, USERS, type UserType } from './types';


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
          username: u.username,
          displayName: u.displayName,
          expertise: u.expertise,
        })),
      },
      allUserGroups: {
        results: [ {
          id: userGroup.id,
          name: userGroup.name,
          users: [ {
            id: USERS.staff.id,
          } ],
        } ],
      },
    },
  },
}

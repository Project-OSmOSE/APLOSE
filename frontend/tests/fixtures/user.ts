import { User } from '../../src/service/types';

function extendUser(user) {
  const display_name = (user.first_name && user.last_name) ? `${ user.first_name } ${ user.last_name }` : user.username;
  const display_name_with_expertise = user.expertise_level ? `${ display_name } (${ user.expertise_level })` : display_name;
  return {
    ...user,
    display_name,
    display_name_with_expertise,
  }
}

export const AUTH = {
  username: 'username',
  password: 'password',
  token: 'TOKEN',
}

const BASE_USER: Omit<User, 'display_name' | 'display_name_with_expertise'> = {
  username: AUTH.username,
  id: 1,
  email: 'user@user.com',
  first_name: 'User',
  last_name: 'Test',
  expertise_level: 'Novice',
  is_staff: false,
  is_superuser: false,
}
export type UserType = 'annotator' | 'creator' | 'staff' | 'superuser';
export const USERS: { [key in UserType]: User } = {
  annotator: extendUser({ ...BASE_USER, username: 'annotator', first_name: 'Annotator' }),
  creator: extendUser({ ...BASE_USER, id: 2, username: 'creator', first_name: 'Creator' }),
  staff: extendUser({ ...BASE_USER, id: 3, is_staff: true, username: 'staff', first_name: 'Staff' }),
  superuser: extendUser({ ...BASE_USER, id: 4, is_superuser: true, username: 'superuser', first_name: 'Superuser' }),
}

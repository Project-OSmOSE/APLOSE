import { User } from "@/service/types";

export function extendUser(user: Omit<User, 'display_name' | 'display_name_with_expertise'>): User {
  const display_name = (user.first_name && user.last_name) ? `${ user.first_name } ${ user.last_name }` : user.username;
  const display_name_with_expertise = user.expertise_level ? `${ display_name } (${ user.expertise_level })` : display_name;
  return {
    ...user,
    display_name,
    display_name_with_expertise
  }
}

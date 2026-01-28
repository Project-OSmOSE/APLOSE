import { TeamMember } from "./team";

export interface Contact {
  id: number;
  first_name: string;
  last_name: string;
  initial_names: string;
  mail: string | null;
  website: string | null;
  current_institutions: number[]; //pk
  team_member: TeamMember | null;
}

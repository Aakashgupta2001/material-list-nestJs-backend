import { Role } from '../schemas/role.enum';

export interface UserDetails {
  id: string;
  name: string;
  email: string;
  phone: string;
  companyName: string;
  roles: Role[];
  active: boolean;
}

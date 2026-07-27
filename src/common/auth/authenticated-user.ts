import { Role } from "@prisma/client";

export interface AuthenticatedUser {
  id: string;
  email: string;
  username: string;
  role: Role;
}

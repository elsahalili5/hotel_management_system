export const ROLES = {
  ADMIN: "ADMIN",
  MANAGER: "MANAGER",
  RECEPTIONIST: "RECEPTIONIST",
  HOUSEKEEPING: "HOUSEKEEPING",
  GUEST: "GUEST",
} as const;

export type RoleType = (typeof ROLES)[keyof typeof ROLES];

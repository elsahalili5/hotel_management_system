import type { AuthUser } from "@mansio/shared";


function capitalizeFirst(value: string) {
  const normalized = value.trim();
  if (!normalized) return "";
  return `${normalized[0].toUpperCase()}${normalized.slice(1).toLowerCase()}`;
}

export function getUserFullName(user?: AuthUser) {
  if (!user) {
    return "";
  }
  const firstName = capitalizeFirst(user.first_name ?? "");
  const lastName = capitalizeFirst(user.last_name ?? "");

  return `${firstName} ${lastName}`.trim();
}

export function getUserInitials(user?: AuthUser) {
  if(!user) {
    return '';
  }
  return `${capitalizeFirst(user.first_name ?? '')[0]}${capitalizeFirst(user.last_name ?? '')[0]}`;
}


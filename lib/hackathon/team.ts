import crypto from "crypto";

const ALPHANUMERIC = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-")
    .slice(0, 40);

export const generateTeamInviteCode = (length = 8): string => {
  const bytes = crypto.randomBytes(length);
  let code = "";
  for (let i = 0; i < length; i += 1) {
    const index = bytes[i] % ALPHANUMERIC.length;
    code += ALPHANUMERIC[index];
  }
  return code;
};

export const buildTeamSlug = (name: string): string => {
  const base = slugify(name) || "team";
  const suffix = Math.random().toString(36).slice(-4);
  return `${base}-${suffix}`;
};


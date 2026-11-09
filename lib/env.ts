const APP_ENVS = ["local", "staging", "production"] as const;

export type AppEnv = (typeof APP_ENVS)[number];

function parseAppEnv(value: string | undefined): AppEnv {
  if (value && (APP_ENVS as readonly string[]).includes(value)) return value as AppEnv;
  // Missing or unknown values fall back to the safest non-production setting.
  return "local";
}

// NEXT_PUBLIC_* values are inlined at build time, so each must be read with a literal
// `process.env.NAME` reference (no dynamic lookups).
export const env = {
  appEnv: parseAppEnv(process.env.NEXT_PUBLIC_APP_ENV),
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || undefined,
} as const;

export const isProduction = env.appEnv === "production";

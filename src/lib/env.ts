// Environment variable validation
const requiredEnvVars = [
  "GOOGLE_SHEET_ID",
  "GOOGLE_CLIENT_EMAIL",
  "GOOGLE_PRIVATE_KEY",
  "GOOGLE_DRIVE_PARENT_FOLDER_ID",
  "ADMIN_USERNAME",
  "ADMIN_PASSWORD",
] as const;

export function validateEnvironment() {
  const missingVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(", ")}`
    );
  }
}

// Call this in your app startup
export const env = {
  GOOGLE_SHEET_ID: process.env.GOOGLE_SHEET_ID!,
  GOOGLE_CLIENT_EMAIL: process.env.GOOGLE_CLIENT_EMAIL!,
  GOOGLE_PRIVATE_KEY: process.env.GOOGLE_PRIVATE_KEY!,
  GOOGLE_DRIVE_PARENT_FOLDER_ID: process.env.GOOGLE_DRIVE_PARENT_FOLDER_ID!,
  ADMIN_USERNAME: process.env.ADMIN_USERNAME!,
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD!,
  GOOGLE_DRIVE_URL_PREFIX:
    process.env.GOOGLE_DRIVE_URL_PREFIX || "https://drive.google.com/uc?id=",
};

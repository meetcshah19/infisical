const PORT = process.env.PORT || 4000;
const EMAIL_TOKEN_LIFETIME = parseInt(process.env.EMAIL_TOKEN_LIFETIME! || '86400');
const INVITE_ONLY_SIGNUP = process.env.INVITE_ONLY_SIGNUP == undefined ? false : process.env.INVITE_ONLY_SIGNUP
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY!;
const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS!) || 10;
const JWT_AUTH_LIFETIME = process.env.JWT_AUTH_LIFETIME! || '10d';
const JWT_AUTH_SECRET = process.env.JWT_AUTH_SECRET!;
const JWT_MFA_LIFETIME = process.env.JWT_MFA_LIFETIME! || '5m';
const JWT_MFA_SECRET = process.env.JWT_MFA_SECRET!;
const JWT_REFRESH_LIFETIME = process.env.JWT_REFRESH_LIFETIME! || '90d';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;
const JWT_SERVICE_SECRET = process.env.JWT_SERVICE_SECRET!;
const JWT_SIGNUP_LIFETIME = process.env.JWT_SIGNUP_LIFETIME! || '15m';
const JWT_SIGNUP_SECRET = process.env.JWT_SIGNUP_SECRET!;
const MONGO_URL = process.env.MONGO_URL!;
const NODE_ENV = process.env.NODE_ENV! || 'production';
const VERBOSE_ERROR_OUTPUT = process.env.VERBOSE_ERROR_OUTPUT! === 'true' && true;
const LOKI_HOST = process.env.LOKI_HOST || undefined;
const CLIENT_ID_AZURE = process.env.CLIENT_ID_AZURE!;
const CLIENT_ID_HEROKU = process.env.CLIENT_ID_HEROKU!;
const CLIENT_ID_VERCEL = process.env.CLIENT_ID_VERCEL!;
const CLIENT_ID_NETLIFY = process.env.CLIENT_ID_NETLIFY!;
const CLIENT_ID_GITHUB = process.env.CLIENT_ID_GITHUB!;
const CLIENT_ID_GITLAB = process.env.CLIENT_ID_GITLAB!;
const CLIENT_ID_GCP_SECRET_MANAGER = process.env.CLIENT_ID_GCP_SECRET_MANAGER!;
const CLIENT_SECRET_AZURE = process.env.CLIENT_SECRET_AZURE!;
const CLIENT_SECRET_HEROKU = process.env.CLIENT_SECRET_HEROKU!;
const CLIENT_SECRET_VERCEL = process.env.CLIENT_SECRET_VERCEL!;
const CLIENT_SECRET_NETLIFY = process.env.CLIENT_SECRET_NETLIFY!;
const CLIENT_SECRET_GITHUB = process.env.CLIENT_SECRET_GITHUB!;
const CLIENT_SECRET_GITLAB = process.env.CLIENT_SECRET_GITLAB;
const CLIENT_SECRET_GCP_SECRET_MANAGER = process.env.CLIENT_SECRET_GCP_SECRET_MANAGER!;
const CLIENT_SLUG_VERCEL = process.env.CLIENT_SLUG_VERCEL!;
const POSTHOG_HOST = process.env.POSTHOG_HOST! || 'https://app.posthog.com';
const POSTHOG_PROJECT_API_KEY =
  process.env.POSTHOG_PROJECT_API_KEY! ||
  'phc_nSin8j5q2zdhpFDI1ETmFNUIuTG4DwKVyIigrY10XiE';
const SENTRY_DSN = process.env.SENTRY_DSN!;
const SITE_URL = process.env.SITE_URL!;
const SMTP_HOST = process.env.SMTP_HOST!;
const SMTP_SECURE = process.env.SMTP_SECURE! === 'true' || false;
const SMTP_PORT = parseInt(process.env.SMTP_PORT!) || 587;
const SMTP_USERNAME = process.env.SMTP_USERNAME!;
const SMTP_PASSWORD = process.env.SMTP_PASSWORD!;
const SMTP_FROM_ADDRESS = process.env.SMTP_FROM_ADDRESS!;
const SMTP_FROM_NAME = process.env.SMTP_FROM_NAME! || 'Infisical';
const STRIPE_PRODUCT_STARTER = process.env.STRIPE_PRODUCT_STARTER!;
const STRIPE_PRODUCT_PRO = process.env.STRIPE_PRODUCT_PRO!;
const STRIPE_PRODUCT_TEAM = process.env.STRIPE_PRODUCT_TEAM!;
const STRIPE_PUBLISHABLE_KEY = process.env.STRIPE_PUBLISHABLE_KEY!;
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY!;
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET!;
const TELEMETRY_ENABLED = process.env.TELEMETRY_ENABLED! !== 'false' && true;
const LICENSE_KEY = process.env.LICENSE_KEY!;

export {
  PORT,
  EMAIL_TOKEN_LIFETIME,
  INVITE_ONLY_SIGNUP,
  ENCRYPTION_KEY,
  SALT_ROUNDS,
  JWT_AUTH_LIFETIME,
  JWT_AUTH_SECRET,
  JWT_MFA_LIFETIME,
  JWT_MFA_SECRET,
  JWT_REFRESH_LIFETIME,
  JWT_REFRESH_SECRET,
  JWT_SERVICE_SECRET,
  JWT_SIGNUP_LIFETIME,
  JWT_SIGNUP_SECRET,
  MONGO_URL,
  NODE_ENV,
  VERBOSE_ERROR_OUTPUT,
  LOKI_HOST,
  CLIENT_ID_AZURE,
  CLIENT_ID_HEROKU,
  CLIENT_ID_VERCEL,
  CLIENT_ID_NETLIFY,
  CLIENT_ID_GITHUB,
  CLIENT_ID_GITLAB,
  CLIENT_ID_GCP_SECRET_MANAGER,
  CLIENT_SECRET_AZURE,
  CLIENT_SECRET_HEROKU,
  CLIENT_SECRET_VERCEL,
  CLIENT_SECRET_NETLIFY,
  CLIENT_SECRET_GITHUB,
  CLIENT_SECRET_GITLAB,
  CLIENT_SECRET_GCP_SECRET_MANAGER,
  CLIENT_SLUG_VERCEL,
  POSTHOG_HOST,
  POSTHOG_PROJECT_API_KEY,
  SENTRY_DSN,
  SITE_URL,
  SMTP_HOST,
  SMTP_PORT,
  SMTP_SECURE,
  SMTP_USERNAME,
  SMTP_PASSWORD,
  SMTP_FROM_ADDRESS,
  SMTP_FROM_NAME,
  STRIPE_PRODUCT_STARTER,
  STRIPE_PRODUCT_TEAM,
  STRIPE_PRODUCT_PRO,
  STRIPE_PUBLISHABLE_KEY,
  STRIPE_SECRET_KEY,
  STRIPE_WEBHOOK_SECRET,
  TELEMETRY_ENABLED,
  LICENSE_KEY
};

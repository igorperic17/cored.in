export const NODE_ENV =
  process.env.NODE_ENV ||
  process.env.VERCEL_ENV ||
  process.env.NEXT_PUBLIC_VERCEL_ENV ||
  "development";

export const MONGODB_URI = process.env.MONGODB_URI;
export const DB_NAME = process.env.DB_NAME;

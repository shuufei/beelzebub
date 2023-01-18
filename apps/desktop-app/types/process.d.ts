declare namespace NodeJS {
  interface ProcessEnv {
    readonly NX_PUBLIC_SUPABASE_URL: string;
    readonly NX_SUPABASE_PUBLIC_KEY: string;
  }
}

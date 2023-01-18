declare namespace NodeJS {
  interface ProcessEnv {
    readonly PUBLIC_SUPABASE_URL: string;
    readonly SUPABASE_SERVICE_KEY: string;
  }
}

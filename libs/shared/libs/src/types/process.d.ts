declare namespace NodeJS {
  interface ProcessEnv {
    readonly NEXT_SUPABASE_SERVICE_KEY: string;
    readonly NEXT_PUBLIC_SUPABASE_URL: string;
  }
}

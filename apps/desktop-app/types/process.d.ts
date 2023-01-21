declare namespace NodeJS {
  interface ProcessEnv {
    readonly NEXT_BEELZEBUB_ACCESS_KEY: string;
    readonly NEXT_BEELZEBUB_ACCESS_KEY_EXPIRES: string;
    readonly NEXT_APP_ENDPOINT: string;
    readonly NEXT_SUPABASE_SERVICE_KEY: string;
    readonly NEXT_PUBLIC_SUPABASE_URL: string;
    readonly NEXT_ADMIN_USER_EMAIL: string;
  }
}

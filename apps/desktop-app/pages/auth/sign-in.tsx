import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { Auth, ThemeSupa } from '@supabase/auth-ui-react';
import { useRouter } from 'next/router';
import { FC, useEffect } from 'react';

const SignInPage: FC = () => {
  const supabaseClient = useSupabaseClient();

  const user = useUser();

  const router = useRouter();
  useEffect(() => {
    if (user) {
      router.replace('/');
    }
  }, [router, supabaseClient, user]);

  return (
    <Auth
      redirectTo="/"
      appearance={{ theme: ThemeSupa }}
      supabaseClient={supabaseClient}
      providers={['google']}
      onlyThirdPartyProviders
      socialLayout="horizontal"
    />
  );
};

export default SignInPage;

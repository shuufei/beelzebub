import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { Auth, ThemeSupa } from '@supabase/auth-ui-react';
import { parse } from 'cookie';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { FC, useEffect } from 'react';
import { APP_ACCESS_CHECK_KEY } from '../api/set-cookie-app-access-key';

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

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const parsedCookies = parse(ctx.req.headers.cookie ?? '');
  const correctRequest =
    parsedCookies[APP_ACCESS_CHECK_KEY] ===
    process.env.NEXT_BEELZEBUB_ACCESS_KEY;
  if (!correctRequest) {
    return {
      redirect: {
        permanent: true,
        destination: '/service-suspended',
      },
    };
  }
  return {
    props: {},
  };
};

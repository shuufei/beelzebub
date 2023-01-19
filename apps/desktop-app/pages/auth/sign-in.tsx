import { Box, Button } from '@chakra-ui/react';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { parse } from 'cookie';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { FC, useEffect } from 'react';
import { APP_ACCESS_CHECK_KEY } from '../api/set-cookie-app-access-key';

type PageProps = {
  redirectTo: string;
};

const SignInPage: FC<PageProps> = ({ redirectTo }) => {
  const supabaseClient = useSupabaseClient();

  const user = useUser();

  const router = useRouter();
  useEffect(() => {
    if (user) {
      router.replace('/');
    }
  }, [router, supabaseClient, user]);

  return (
    <Box p={8}>
      <Button
        onClick={async () => {
          await supabaseClient.auth.signInWithOAuth({
            provider: 'google',
            options: {
              redirectTo,
            },
          });
        }}
      >
        sign in with google
      </Button>
    </Box>
  );
};

export default SignInPage;

export const getServerSideProps: GetServerSideProps<PageProps> = async (
  ctx
) => {
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
    props: {
      redirectTo: process.env.NEXT_APP_ENDPOINT,
    },
  };
};

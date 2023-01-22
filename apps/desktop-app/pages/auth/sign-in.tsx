import { Box, Button } from '@chakra-ui/react';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { FC, useEffect } from 'react';
import { validateAppAccessRequest } from '../../shared/ssr/validate-app-access-request';

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
  const validateResult = validateAppAccessRequest(ctx.req);
  if (!validateResult.isValid) {
    return {
      redirect: validateResult.redirect,
    };
  }
  return {
    props: {
      redirectTo: process.env.NEXT_APP_ENDPOINT,
    },
  };
};

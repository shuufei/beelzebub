import { Card } from '@beelzebub/shared/domain';
import { CardImg } from '@beelzebub/shared/ui';
import { Button, Heading, VStack, Text } from '@chakra-ui/react';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { parse } from 'cookie';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { APP_ACCESS_CHECK_KEY } from './api/set-cookie-app-access-key';

export function Index() {
  const supabaseClient = useSupabaseClient();

  const router = useRouter();

  return (
    <VStack as="main" alignItems={'flex-start'} spacing={4}>
      <Heading>Beelzebub Desktop App</Heading>
      <Link href={'/_tmp/deck-recipe'}>
        <Text textDecoration={'underline'} color="blue.600">
          deck recipe
        </Text>
      </Link>
      <CardImg
        card={
          {
            category: 'BT01',
            imgFileName: 'BT1-001.png',
          } as Card
        }
        width={100}
      />
      <Button
        onClick={async () => {
          await supabaseClient.auth.signOut();
          router.replace('/auth/sign-in');
        }}
      >
        sign out
      </Button>
    </VStack>
  );
}

export default Index;

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

  const supabase = createServerSupabaseClient(ctx);
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return {
      redirect: {
        destination: '/auth/sign-in',
        permanent: false,
      },
    };
  }

  return {
    props: {
      initialSession: session,
    },
  };
};

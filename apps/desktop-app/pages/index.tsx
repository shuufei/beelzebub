import { Card } from '@beelzebub/shared/domain';
import { CardImg } from '@beelzebub/shared/ui';
import { Button, Heading, Text, VStack } from '@chakra-ui/react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { validateAuthorizedRequest } from '../shared/ssr/validate-authorized-request';

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
  const validateResult = await validateAuthorizedRequest(ctx);
  if (!validateResult.isValid) {
    return {
      redirect: validateResult.redirect,
    };
  }

  return {
    props: {},
  };
};

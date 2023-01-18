import { Button, Heading, VStack } from '@chakra-ui/react';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const cardAspect = 600 / 430;

export function Index() {
  const supabaseClient = useSupabaseClient();

  const [url, setUrl] = useState<string | undefined>();
  const router = useRouter();

  useEffect(() => {
    const dl = async () => {
      const { data, error } = await supabaseClient.storage
        .from('app-static-resources')
        .download('cards/images/BT01/BT1-001.png');
      console.log('--- data: ', data, error);
      if (data == null) {
        return;
      }
      const url = URL.createObjectURL(data);
      setUrl(url);
    };
    dl();
  }, [supabaseClient]);

  return (
    <main>
      <Heading>Beelzebub Desktop App</Heading>
      {/* TODO: urlがundefinedの場合はplaceholder画像を表示する */}
      <Image
        src={url ?? '/images/back.png'}
        width={100}
        height={100 * cardAspect}
        alt=""
        priority={true}
      />
      <VStack alignItems={'flex-start'}>
        <Button
          onClick={async () => {
            await supabaseClient.auth.signOut();
            router.replace('/auth/sign-in');
          }}
        >
          sign out
        </Button>
      </VStack>
    </main>
  );
}

export default Index;

export const getServerSideProps = async (ctx) => {
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

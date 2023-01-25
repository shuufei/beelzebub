import { Button, HStack } from '@chakra-ui/react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/router';
import { FC } from 'react';
import { Navigation } from './navigation';

export const Header: FC = () => {
  const supabaseClient = useSupabaseClient();
  const router = useRouter();
  return (
    <HStack
      as="header"
      justifyContent={'space-between'}
      px={'6'}
      py={'2'}
      borderBottom={'1px'}
      borderColor={'gray.900'}
      position={'sticky'}
      top={0}
      bg={'white'}
      zIndex={'sticky'}
    >
      <Navigation />
      <Button
        size={'xs'}
        variant={'ghost'}
        onClick={async () => {
          await supabaseClient.auth.signOut();
          router.replace('/auth/sign-in');
        }}
      >
        サインアウト
      </Button>
    </HStack>
  );
};

import { HStack, Text } from '@chakra-ui/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FC } from 'react';

const NavigationItem: FC<{ href: string; label: string }> = ({
  href,
  label,
}) => {
  const router = useRouter();
  const active = router.pathname.startsWith(href);
  return (
    <Link href={href}>
      <Text
        fontSize={'sm'}
        fontWeight={'semibold'}
        color={active ? 'gray.900' : 'gray.400'}
      >
        {label}
      </Text>
    </Link>
  );
};

export const Navigation: FC = () => {
  return (
    <HStack spacing={'4'}>
      <NavigationItem href="/cards" label="カードリスト" />
      <NavigationItem href="/decks" label="デッキリスト" />
      <NavigationItem href="/vs" label="対戦" />
      <NavigationItem href="/_tmp/deck-recipe" label="tmp/デッキレシピ" />
    </HStack>
  );
};

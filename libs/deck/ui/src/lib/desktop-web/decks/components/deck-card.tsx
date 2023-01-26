import { LockIcon } from '@chakra-ui/icons';
import { Box, HStack, Text } from '@chakra-ui/react';
import d from 'dayjs';
import { FC, memo } from 'react';
import { KeyCardImg } from '../../components/key-card-img';
import { DeckJoinedLatestDeckVersion } from '../domain/deck-joined-latest-deck-version';

export const DeckCard: FC<{ deck: DeckJoinedLatestDeckVersion }> = memo(
  ({ deck }) => {
    return (
      <HStack
        alignItems={'flex-start'}
        pt={2}
        pl={3}
        pr={6}
        pb={6}
        border={'1px'}
        borderColor={'white'}
        borderRadius={'md'}
        _hover={{ bg: 'gray.100' }}
      >
        <KeyCardImg keyCard={deck.keyCard} width={50} />
        <Box>
          <HStack>
            <Text fontSize={'md'} fontWeight={'semibold'}>
              {deck.name}
            </Text>
            {deck.public === false && <LockIcon fontSize={'sm'} />}
          </HStack>
          <Box fontSize={'xs'} mt={1}>
            <Text>{deck.userId}</Text>
            <Text>
              最終更新:{' '}
              {d(deck.latestDeckVersion.createdAt).format(
                'YYYY年MM月D日 HH時mm分ss秒'
              )}
            </Text>
          </Box>
        </Box>
      </HStack>
    );
  }
);

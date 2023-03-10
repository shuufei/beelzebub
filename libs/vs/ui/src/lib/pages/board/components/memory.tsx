import { Player } from '@beelzebub/vs/domain';
import { Box, Button, Center, HStack } from '@chakra-ui/react';
import { FC, memo, useCallback } from 'react';
import { useRecoilValue } from 'recoil';
import { useDispatcher } from '../state/dispatcher';
import { boardMemorySelector } from '../state/selectors/board-memory-selector';

const MemoryPoint: FC<{
  count: number;
  isActive?: boolean;
  onClick?: () => void;
}> = memo(({ count, isActive = false, onClick }) => {
  return (
    <Button size={'xs'} variant={'unstyled'} h={7} w={7}>
      {isActive ? (
        <Center
          w={7}
          h={7}
          borderRadius={'full'}
          bg={'white'}
          fontSize={'xs'}
          onClick={onClick}
        >
          {count}
        </Center>
      ) : (
        <Center
          w={7}
          h={7}
          borderRadius={'full'}
          bg={'gray.500'}
          fontSize={'xs'}
          onClick={onClick}
        >
          {count}
        </Center>
      )}
    </Button>
  );
});

const MemoryOneSide: FC<{
  selectedCount?: number;
  onSelect?: (count: number) => void;
}> = memo(({ selectedCount, onSelect }) => {
  return (
    <HStack>
      {new Array(10).fill(null).map((_, i) => {
        return (
          <MemoryPoint
            key={i}
            count={i + 1}
            isActive={selectedCount === i + 1}
            onClick={() => {
              onSelect?.(i + 1);
            }}
          />
        );
      })}
    </HStack>
  );
});

export const Memory: FC = memo(() => {
  const memory = useRecoilValue(boardMemorySelector);
  const dispatch = useDispatcher();

  const changeMemory = useCallback(
    (count: number, player?: Player) => {
      dispatch('me', {
        actionName: 'change-memory',
        data: {
          player,
          count,
        },
      });
    },
    [dispatch]
  );

  return (
    <HStack bg={'gray.900'} p={1.5} borderRadius={'md'}>
      <Box transform={'rotate(180deg)'}>
        <MemoryOneSide
          selectedCount={
            memory.player === 'opponent' ? memory.count : undefined
          }
          onSelect={(count) => {
            changeMemory(count, 'opponent');
          }}
        />
      </Box>
      <MemoryPoint
        count={0}
        isActive={memory.count === 0}
        onClick={() => {
          changeMemory(0);
        }}
      />
      <MemoryOneSide
        selectedCount={memory.player === 'me' ? memory.count : undefined}
        onSelect={(count) => {
          changeMemory(count, 'me');
        }}
      />
    </HStack>
  );
});

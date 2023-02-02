import {
  Box,
  Button,
  useDisclosure,
  useOutsideClick,
  VStack,
} from '@chakra-ui/react';
import { FC, memo, ReactNode, useContext, useRef } from 'react';
import { PlayerContext } from '../../context/player-context';

export type CardAction =
  | 'appear'
  | 'evolution'
  | 'rest'
  | 'active'
  | 'trash'
  | 'addToHand'
  | 'reverseToStackTop'
  | 'reverseToStackBottom'
  | 'degeneration'
  | 'addToSecurityTop'
  | 'addToSecurityBottom'
  | 'addToEvolutionOrigin'
  | 'reverseToDigitamaStackTop'
  | 'reverseToDigitamaStackBottom';

export type AreaAction =
  | 'shuffle'
  | 'openStack'
  | 'draw'
  | 'recovery'
  | 'selfCheck'
  | 'reverseToOriginalLocation'
  | 'hatching'
  | 'restAll'
  | 'activeAll'
  | 'trashAll';

export type ActionMenuItem = {
  id: CardAction | AreaAction;
  label: string;
};

export const ActionMenu: FC<{
  children: ReactNode;
  actionMenuItems?: ActionMenuItem[];
  basePosition?: 'left' | 'right';
  onClickAction?: (actionId: ActionMenuItem['id']) => void;
}> = memo(
  ({ children, actionMenuItems, basePosition = 'left', onClickAction }) => {
    const player = useContext(PlayerContext);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const ref = useRef(null);
    useOutsideClick({
      ref: ref,
      handler: () => onClose(),
    });
    return player === 'me' ? (
      <Box
        onContextMenu={(event) => {
          event.preventDefault();
          onOpen();
        }}
        position={'relative'}
        ref={ref}
      >
        {children}
        {isOpen && (
          <VStack
            position={'absolute'}
            bottom={-2}
            left={basePosition === 'left' ? 0 : ''}
            right={basePosition === 'right' ? 0 : ''}
            transform={'translateY(100%)'}
            bg={'white'}
            p={2}
            px={3}
            border={'1px'}
            borderColor={'gray.100'}
            borderRadius={'md'}
            boxShadow={'md'}
            zIndex={'modal'}
          >
            {actionMenuItems?.map((item) => {
              return (
                <Button
                  key={item.id}
                  variant={'solid'}
                  size={'sm'}
                  px={4}
                  w={'full'}
                  onClick={() => {
                    onClickAction?.(item.id);
                    onClose();
                  }}
                >
                  {item.label}
                </Button>
              );
            })}
          </VStack>
        )}
      </Box>
    ) : (
      // eslint-disable-next-line react/jsx-no-useless-fragment
      <>{children}</>
    );
  }
);

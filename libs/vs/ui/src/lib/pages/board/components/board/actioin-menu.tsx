import {
  Box,
  Button,
  Text,
  useDisclosure,
  useOutsideClick,
  VStack,
} from '@chakra-ui/react';
import { FC, memo, ReactNode, useRef } from 'react';

type ActionMenuItem = {
  id: string;
  label: string;
  onClick: () => void;
};

export const ActionMenu: FC<{
  children: ReactNode;
  actionMenuItems?: ActionMenuItem[];
}> = memo(({ children, actionMenuItems }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const ref = useRef(null);
  useOutsideClick({
    ref: ref,
    handler: () => onClose(),
  });
  return (
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
          left={0}
          transform={'translateY(100%)'}
          bg={'white'}
          p={2}
          px={3}
          border={'1px'}
          borderColor={'gray.100'}
          borderRadius={'md'}
          boxShadow={'md'}
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
                  item.onClick();
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
  );
});

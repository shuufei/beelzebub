import { ChevronDownIcon } from '@chakra-ui/icons';
import {
  Button,
  Popover,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Text,
} from '@chakra-ui/react';
import { FC, memo, ReactNode } from 'react';

export const FilterPopup: FC<{
  triggerButtonLabel: string;
  header: ReactNode;
  body: ReactNode;
}> = memo(({ triggerButtonLabel, header, body }) => {
  return (
    <Popover>
      <PopoverTrigger>
        <Button size={'sm'}>
          <Text
            fontSize={'xs'}
            width={'32'}
            textAlign={'left'}
            textOverflow={'ellipsis'}
            overflow={'hidden'}
          >
            {triggerButtonLabel}
          </Text>
          <ChevronDownIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverCloseButton />
        <PopoverHeader>{header}</PopoverHeader>
        <PopoverBody>{body}</PopoverBody>
      </PopoverContent>
    </Popover>
  );
});

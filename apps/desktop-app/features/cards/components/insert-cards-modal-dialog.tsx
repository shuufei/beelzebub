import {
  Box,
  Button,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import { ChangeEvent, FC, memo, useCallback, useState } from 'react';

export const InsertCardsModalDialog: FC<{
  isOpen: boolean;
  onClose: () => void;
}> = memo(function InsertCardsModalDialog({ isOpen, onClose }) {
  const [category, setCategory] = useState('');
  const [cardsData, setCardsData] = useState<unknown | undefined>();

  const insertData = useCallback(async () => {
    if (cardsData == null || !category) {
      return;
    }
    await fetch(`/api/${category}/cards`, {
      method: 'POST',
      body: JSON.stringify(cardsData),
    });
  }, [cardsData, category]);

  const loadDeckJsonFile = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file == null) {
        return;
      }
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = async (e) => {
        const parsedJson = JSON.parse(e.target?.result as string);
        setCardsData(parsedJson);
      };
    },
    []
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>カードの登録</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box maxW={'md'} as="form">
            <FormControl>
              <FormLabel>カテゴリ名</FormLabel>
              <Input
                type="text"
                onChange={(event) => {
                  setCategory(event.target.value);
                }}
              />
            </FormControl>
            <FormControl mt="4">
              <FormLabel>カードファイル</FormLabel>
              <Input
                type="file"
                border={'none'}
                accept=".json"
                p="0"
                rounded={0}
                onChange={loadDeckJsonFile}
              />
            </FormControl>
          </Box>
          <ModalFooter p={0} py={4}>
            <HStack alignItems={'flex-start'} w={'full'}>
              <Button
                disabled={!category || !cardsData}
                onClick={insertData}
                colorScheme={'blue'}
              >
                登録
              </Button>
              <Button onClick={onClose} variant={'ghost'} colorScheme={'blue'}>
                キャンセル
              </Button>
            </HStack>
          </ModalFooter>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
});

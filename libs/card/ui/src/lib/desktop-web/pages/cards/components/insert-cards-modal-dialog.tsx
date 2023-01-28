import { useInsertCards } from '@beelzebub/card/db';
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
  Spinner,
  useToast,
} from '@chakra-ui/react';
import { ChangeEvent, FC, memo, useCallback, useState } from 'react';

export const InsertCardsModalDialog: FC<{
  isOpen: boolean;
  onClose: () => void;
}> = memo(function InsertCardsModalDialog({ isOpen, onClose }) {
  const [categoryId, setCategoryId] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [cardsData, setCardsData] = useState<unknown | undefined>();
  const [isLoading, setLoading] = useState(false);
  const insertCards = useInsertCards();
  const toast = useToast();

  const insertData = useCallback(async () => {
    if (cardsData == null || !categoryName) {
      return;
    }
    setLoading(true);
    await insertCards({ id: categoryId, categoryName }, cardsData);
    setLoading(false);
    onClose();
    toast({
      title: '新しいカードを登録しました',
      duration: 3000,
      status: 'success',
      isClosable: true,
      position: 'top-right',
    });
  }, [cardsData, categoryName, insertCards, categoryId, onClose, toast]);

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
              <FormLabel>カテゴリId</FormLabel>
              <Input
                type="text"
                onChange={(event) => {
                  setCategoryId(event.target.value);
                }}
              />
            </FormControl>
            <FormControl mt="4">
              <FormLabel>カテゴリ名</FormLabel>
              <Input
                type="text"
                onChange={(event) => {
                  setCategoryName(event.target.value);
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
                disabled={
                  !categoryName || !cardsData || !categoryId || isLoading
                }
                onClick={insertData}
                colorScheme={'blue'}
              >
                {!isLoading ? '登録' : <Spinner size={'sm'} />}
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

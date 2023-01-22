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
  const [category, setCategory] = useState('');
  const [cardsData, setCardsData] = useState<unknown | undefined>();
  const [isLoading, setLoading] = useState(false);
  const toast = useToast();

  const insertData = useCallback(async () => {
    if (cardsData == null || !category) {
      return;
    }
    setLoading(true);
    await fetch(`/api/${category}/cards`, {
      method: 'POST',
      body: JSON.stringify(cardsData),
    });
    setLoading(false);
    onClose();
    toast({
      title: '新しいカードを登録しました',
      duration: 3000,
      status: 'success',
      isClosable: true,
      position: 'top-right',
    });
  }, [cardsData, category, onClose, toast]);

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
                disabled={!category || !cardsData || isLoading}
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

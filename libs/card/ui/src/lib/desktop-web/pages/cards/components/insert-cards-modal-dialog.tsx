import { CardDB, CategoryDB, convertToCardDB } from '@beelzebub/shared/db';
import {
  CardOriginal,
  Category,
  convertCardFromOriginal,
} from '@beelzebub/shared/domain';
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
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { ChangeEvent, FC, memo, useCallback, useState } from 'react';
import { z, ZodError } from 'zod';

const usePostCardsAndCategory = () => {
  const supabaseClient = useSupabaseClient();
  const post = useCallback(
    async (category: Category, data: any) => {
      try {
        if (!('cardInfoList' in data)) {
          throw new Error('cardInfoList is required');
        }
        const parsedCardOriginals = z
          .array(CardOriginal)
          .parse(data.cardInfoList);
        const parsedCards = parsedCardOriginals.map((v) => {
          return convertCardFromOriginal(v, category.id);
        });
        const categoryDb: CategoryDB = {
          id: category.id,
          category_name: category.categoryName,
          created_at: new Date().toISOString(),
        };
        const categoryUpsertResult = await supabaseClient
          .from('categories')
          .upsert({ ...categoryDb });
        if (categoryUpsertResult.error != null) {
          throw new Error(
            `failed upsert category: ${JSON.stringify(categoryUpsertResult)}`
          );
        }
        console.info('category upsert result: ', categoryUpsertResult);

        const results = await Promise.all(
          parsedCards.map((card) => {
            const cardDb: CardDB = convertToCardDB(card);
            return supabaseClient.from('cards').upsert({ ...cardDb });
          })
        );
        console.info('supabase upsert results: ', results);
      } catch (error) {
        if (error instanceof ZodError) {
          console.error('original card data is invalid: ', error);
        }
        throw error;
      }
    },
    [supabaseClient]
  );

  return post;
};

export const InsertCardsModalDialog: FC<{
  isOpen: boolean;
  onClose: () => void;
}> = memo(function InsertCardsModalDialog({ isOpen, onClose }) {
  const [categoryId, setCategoryId] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [cardsData, setCardsData] = useState<unknown | undefined>();
  const [isLoading, setLoading] = useState(false);
  const post = usePostCardsAndCategory();
  const toast = useToast();

  const insertData = useCallback(async () => {
    if (cardsData == null || !categoryName) {
      return;
    }
    setLoading(true);
    await post({ id: categoryId, categoryName }, cardsData);
    setLoading(false);
    onClose();
    toast({
      title: '新しいカードを登録しました',
      duration: 3000,
      status: 'success',
      isClosable: true,
      position: 'top-right',
    });
  }, [cardsData, categoryName, post, categoryId, onClose, toast]);

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

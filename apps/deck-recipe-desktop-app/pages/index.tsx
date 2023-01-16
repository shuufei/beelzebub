import { Card } from '@beelzebub/shared/domain';
import {
  Box,
  Divider,
  FormControl,
  FormLabel,
  Heading,
  Input,
} from '@chakra-ui/react';
import { ChangeEvent, useCallback, useState } from 'react';
import { DeckRecipePreview } from '../components/deck-recipe-preview';

export function Index() {
  const [deckCards, setDeckCards] = useState<Card[]>([]);
  const [deckName, setDeckName] = useState('');

  const loadDeckJsonFile = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = (e) => {
        const parsed = JSON.parse(e.target.result as string) as Card[];
        setDeckCards(parsed);
      };
    },
    []
  );

  return (
    <Box as="main" px="6" py="4">
      <Heading as={'h1'} fontSize={'md'}>
        デッキレシピプレビュー
      </Heading>

      <Box p="2" maxW={'md'}>
        <FormControl mt="4">
          <FormLabel>デッキ名</FormLabel>
          <Input
            type="text"
            onChange={(event) => {
              setDeckName(event.target.value);
            }}
          />
        </FormControl>
        <FormControl mt="4">
          <FormLabel>デッキファイル</FormLabel>
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
      <Divider mt="4" mb="4" borderColor={'gray.900'} />
      {deckCards.length > 0 && (
        <DeckRecipePreview deckCards={deckCards} deckName={deckName} />
      )}
    </Box>
  );
}

export default Index;

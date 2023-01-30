import { useGetCardsByImgFileNames } from '@beelzebub/deck/db';
import { Card, categorizeCards, DeckVersion } from '@beelzebub/shared/domain';
import { CardImg } from '@beelzebub/shared/ui';
import {
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  VStack,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import { FC, memo, useMemo } from 'react';

export const DeckCardListModalDialog: FC<{
  isOpen: boolean;
  cards: DeckVersion['cards'];
  onClose: () => void;
}> = memo(({ isOpen, cards, onClose }) => {
  const imgFileNames = cards.map((v) => v.imgFileName);
  const { data } = useGetCardsByImgFileNames(imgFileNames);
  const flatted = useMemo(() => {
    const categorizedCards = categorizeCards(data ?? []);
    return Object.values(categorizedCards)
      .map((categoryCards) => {
        return categoryCards
          .map((card) => {
            const count =
              cards.find((v) => v.imgFileName === card.imgFileName)?.count ?? 0;
            return new Array<Card>(count).fill(card);
          })
          .flat();
      })
      .flat();
  }, [cards, data]);
  return (
    <Modal isOpen={isOpen} onClose={onClose} size={'xl'}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader fontSize={'md'}>デッキ カードリスト</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Wrap spacing={3}>
            {flatted.map(({ imgFileName, categoryId }, i) => {
              return (
                <WrapItem key={`${imgFileName}-${i}`}>
                  <VStack spacing={1}>
                    <CardImg
                      categoryId={categoryId}
                      imgFileName={imgFileName}
                      width={80}
                    />
                  </VStack>
                </WrapItem>
              );
            })}
          </Wrap>
        </ModalBody>
        <ModalFooter>
          <HStack justifyContent={'flex-start'} w={'full'}>
            <Button colorScheme={'blue'} variant={'ghost'} onClick={onClose}>
              キャンセル
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
});

import { useGetCardsByImgFileNames } from '@beelzebub/deck/db';
import { useGetDeckJoinLatestDeckVersion } from '@beelzebub/shared/db';
import { Deck, flatDeckCards } from '@beelzebub/shared/domain';
import { initializeBoardCards, Player } from '@beelzebub/vs/domain';
import { useEffect, useMemo } from 'react';
import { useRecoilState } from 'recoil';
import { boardsState } from '../state/boards-state';
import { useDispatcher } from '../state/dispatcher';

export const useInitializeBoard = (deckId: Deck['id'], player: Player) => {
  const [, setBoard] = useRecoilState(boardsState);

  const { data: deck } = useGetDeckJoinLatestDeckVersion(deckId);
  const imgFileNames = deck?.latestDeckVersion.cards.map((v) => v.imgFileName);
  const { data: cards } = useGetCardsByImgFileNames(imgFileNames ?? []);

  const flatted = useMemo(() => {
    return flatDeckCards(deck?.latestDeckVersion.cards ?? [], cards ?? []);
  }, [cards, deck?.latestDeckVersion.cards]);

  const dispatch = useDispatcher();

  useEffect(() => {
    if (player === 'opponent') {
      return;
    }
    if (flatted == null) {
      return;
    }
    const boardCards = initializeBoardCards(flatted);
    const digitamaStackBoardCards = boardCards.filter(
      (boardCard) => boardCard.card.cardtype === 'デジタマ'
    );
    const stackBoardCards = boardCards.filter(
      (boardCard) => boardCard.card.cardtype !== 'デジタマ'
    );
    dispatch('me', {
      actionName: 'set-deck',
      data: {
        deckId,
        stack: stackBoardCards,
        digitamaStack: digitamaStackBoardCards,
      },
    });
  }, [cards, deckId, dispatch, flatted, player, setBoard]);
};

import { BoardState } from '@beelzebub/vs/domain';
import { shuffle } from 'lodash';
import { useCallback } from 'react';
import { useRecoilState } from 'recoil';
import { boardsState } from '../state/boards-state';
import { useDispatcher } from '../state/dispatcher';

export const useSetupBoard = () => {
  const [boards] = useRecoilState(boardsState);
  const dispatch = useDispatcher();

  const setup = useCallback(() => {
    const boardMe = { ...boards.me };
    if (boardMe.deckId == null) {
      return;
    }

    const allCards = [
      ...boardMe.battleDigimon,
      ...boardMe.battleOption,
      ...boardMe.battleTamer,
      ...boardMe.hand,
      ...boardMe.security,
      ...boardMe.securityOpen,
      ...boardMe.securitySelfCheck,
      ...boardMe.stack,
      ...boardMe.stackOpen,
      ...boardMe.standby,
      ...boardMe.trash,
      ...boardMe.digitamaStack,
      ...boardMe.tmp,
    ]
      .map((card) => {
        return [card, ...card.evolutionOriginCards].map((v) => v);
      })
      .flat();

    // 15枚以下の場合はsetupできない
    if (allCards.length <= 15) {
      return;
    }

    const cards = allCards.filter((v) => v.card.cardtype !== 'デジタマ');
    const digitamaCards = allCards.filter(
      (v) => v.card.cardtype === 'デジタマ'
    );

    const stackCards = shuffle([...cards]);
    const securityCards = new Array(5).fill(null).reduce((acc) => {
      const card = stackCards.shift();
      return [...acc, card];
    }, []);
    const handCards = new Array(5).fill(null).reduce((acc) => {
      const card = stackCards.shift();
      return [...acc, card];
    }, []);

    const board: BoardState = {
      ...boardMe,
      stack: stackCards,
      digitamaStack: digitamaCards,
      security: securityCards,
      hand: handCards,
      battleDigimon: [],
      battleOption: [],
      battleTamer: [],
      securityOpen: [],
      securitySelfCheck: [],
      stackOpen: [],
      standby: [],
      trash: [],
      tmp: [],
    };

    dispatch('me', {
      actionName: 'sync',
      data: board,
    });
  }, [boards.me, dispatch]);

  return setup;
};

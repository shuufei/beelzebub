import { BoardArea, BoardCard } from '@beelzebub/vs/domain';
import { useCallback } from 'react';
import { useRecoilState } from 'recoil';
import { actionModeState } from '../state/action-mode-state';
import { useDispatcher } from '../state/dispatcher';

export const useDispatchEvolution = () => {
  const [actionMode, setActionMode] = useRecoilState(actionModeState);
  const dispatch = useDispatcher();

  const dispatchEvolution = useCallback(
    (selectedCard: BoardCard, selectedCardArea: BoardArea) => {
      if (actionMode.mode !== 'evolution') {
        return;
      }
      dispatch('me', {
        actionName: 'evolution',
        data: {
          evolutionCard: actionMode.data.card,
          evolutionCardArea: actionMode.data.area,
          evolutionOriginCard: selectedCard,
          evolutionOriginCardArea: selectedCardArea,
        },
      });
      setActionMode({
        mode: 'none',
        data: undefined,
      });
    },
    [actionMode, dispatch, setActionMode]
  );

  return dispatchEvolution;
};

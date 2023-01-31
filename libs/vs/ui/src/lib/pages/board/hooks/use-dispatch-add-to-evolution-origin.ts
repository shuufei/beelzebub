import { BoardArea, BoardCard } from '@beelzebub/vs/domain';
import { useCallback } from 'react';
import { useRecoilState } from 'recoil';
import { actionModeState } from '../state/action-mode-state';
import { useDispatcher } from '../state/dispatcher';

export const useDispatchAddToEvolutionOrigin = () => {
  const [actionMode, setActionMode] = useRecoilState(actionModeState);
  const dispatch = useDispatcher();

  const dispatchEvolution = useCallback(
    (selectedCard: BoardCard, selectedCardArea: BoardArea) => {
      if (actionMode.mode !== 'addToEvolutionOrigin') {
        return;
      }
      dispatch('me', {
        actionName: 'add-to-evolution-origin',
        data: {
          newEvolutionOriginCard: actionMode.data.card,
          newEvolutionOriginCardArea: actionMode.data.area,
          destCard: selectedCard,
          destCardArea: selectedCardArea,
          addIndex: 0,
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

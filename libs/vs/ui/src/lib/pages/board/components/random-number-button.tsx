import { Button } from '@chakra-ui/react';
import { FC, memo, useCallback } from 'react';
import { useRecoilValue } from 'recoil';
import { useDispatcher } from '../state/dispatcher';
import { boardRandomNumberSelector } from '../state/selectors/board-random-number-selector';

export const RandomNumberButton: FC = memo(() => {
  const randomNumber = useRecoilValue(boardRandomNumberSelector);
  const dispatch = useDispatcher();

  const dispatchSetRandomNumber = useCallback(() => {
    dispatch('me', {
      actionName: 'set-random-number',
      data: {
        randomNumber: Math.floor(Math.random() * 100),
      },
    });
  }, []);

  return (
    <Button size={'sm'} variant={'outline'} onClick={dispatchSetRandomNumber}>
      {randomNumber ?? 0}
    </Button>
  );
});

import { Reducer, _Action } from './action-type';

export type SetRandomNumberAction = _Action<
  'set-random-number',
  { randomNumber: number }
>;
export const reducerSetRandomNumberAction: Reducer<SetRandomNumberAction> = (
  _,
  currentState,
  { randomNumber }
) => {
  return {
    ...currentState,
    randomNumber,
  };
};

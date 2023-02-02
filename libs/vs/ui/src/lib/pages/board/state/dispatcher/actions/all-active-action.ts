import { Reducer, _Action } from './action-type';

export type AllActiveAction = _Action<'all-active', undefined>;
export const reducerAllActiveAction: Reducer<AllActiveAction> = (
  player,
  currentState
) => {
  const battleDigimonCards = [...currentState[player].battleDigimon].map(
    (v) => ({
      ...v,
      isRest: false,
    })
  );
  const battleTamerCards = [...currentState[player].battleTamer].map((v) => ({
    ...v,
    isRest: false,
  }));
  const battleOptionCards = [...currentState[player].battleOption].map((v) => ({
    ...v,
    isRest: false,
  }));
  return {
    ...currentState,
    [player]: {
      ...currentState[player],
      battleDigimon: battleDigimonCards,
      battleTamer: battleTamerCards,
      battleOption: battleOptionCards,
    },
  };
};

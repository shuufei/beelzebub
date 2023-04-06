import { BoardState, Player } from '@beelzebub/vs/domain';
import {
  BehaviorSubject,
  Subject,
  distinctUntilChanged,
  merge,
  share,
  takeUntil,
  tap,
} from 'rxjs';
import { v4 } from 'uuid';

export const INITIALI_BOARD_STATE: BoardState = {
  stack: [],
  trash: [],
  hand: [],
  security: [],
  digitamaStack: [],
  standby: [],
  stackOpen: [],
  securityOpen: [],
  securitySelfCheck: [],
  battleDigimon: [],
  battleTamer: [],
  battleOption: [],
  tmp: [],
};

type State = {
  me: BoardState;
  opponent: BoardState;
  memory: {
    player?: Player;
    count: number;
  };
};

const INITIAL_STATE: State = {
  me: INITIALI_BOARD_STATE,
  opponent: INITIALI_BOARD_STATE,
  memory: {
    player: undefined,
    count: 0,
  },
};
const stateBehaviorSubject = new BehaviorSubject<State>(INITIAL_STATE);

type Effect = undefined;
type PhaseEventType =
  | 'start-turn'
  | 'end-turn'
  | 'start-active'
  | 'end-active'
  | 'start-draw'
  | 'end-draw'
  | 'start-grawth'
  | 'end-grawth'
  | 'start-main'
  | 'end-main';
type GameEventType = PhaseEventType | 'appear-digimon';
type GameEvent = {
  id: string;
  type: GameEventType;
  nextGameEvent?: GameEvent;
};

const gameEventSubject = new Subject<GameEvent>();
const gameEvent$ = gameEventSubject.asObservable();

const currentGameEvent$ = gameEvent$.pipe(share());
const currentPhase$ = gameEvent$.pipe(
  // TODO: phase eventをもとに現在のphaseなのか、どちらのターンなのかを保持する
  share()
);

type ScheduledGameEvent = GameEvent & {
  effects: Effect[];
  derivedEffectsCount: number;
};
const completedSchedulingSubject = new Subject<ScheduledGameEvent>();
const completedScheduling$ = completedSchedulingSubject.asObservable();

const completedApplyEffectsSubject = new Subject<ScheduledGameEvent>();
const completedApplyEffects$ = completedApplyEffectsSubject.asObservable();

const completedGameSubject = new Subject<boolean>();
const completedGame$ = completedGameSubject.asObservable();

const dispatchNextGameEventByAuto = (
  completedGameEvent: ScheduledGameEvent
) => {
  /**
   * TODO:
   * - stateから、それぞれのカードがとりうる選択肢を算出
   * - mustで実行する必要があるものは即座に実行
   * - mustでないものは、選択肢の中からランダムで実行
   *    - ここの選択が強化学習により最適化
   * - 実行可能かどうかの判定は下記を考慮
   *    - ターンやフェイズ内での実行回数
   *    - 現在のフェイズ
   *    - 自分や相手のバトルゾーンのカードの状態
   *    - どちらのターンか
   */
  const nextGameEventId: GameEvent['id'] = v4();
  switch (completedGameEvent.type) {
    case 'start-turn':
      gameEventSubject.next({
        id: nextGameEventId,
        type: 'start-active',
      });
      return;
    case 'start-active':
      gameEventSubject.next({
        id: nextGameEventId,
        type: 'end-active',
      });
      return;
    case 'end-active':
      gameEventSubject.next({
        id: nextGameEventId,
        type: 'start-draw',
      });
      return;
    case 'start-draw':
      gameEventSubject.next({
        id: nextGameEventId,
        type: 'end-draw',
      });
      return;
    case 'end-draw':
      gameEventSubject.next({
        id: nextGameEventId,
        type: 'start-grawth',
      });
      return;
    case 'start-grawth':
      gameEventSubject.next({
        id: nextGameEventId,
        type: 'end-grawth',
      });
      return;
    case 'end-grawth':
      gameEventSubject.next({
        id: nextGameEventId,
        type: 'start-main',
      });
      return;
    case 'start-main':
      gameEventSubject.next({
        id: nextGameEventId,
        type: 'end-main',
      });
      return;
    case 'end-main':
      gameEventSubject.next({
        id: nextGameEventId,
        type: 'end-turn',
      });
      return;
    default:
      completedGameSubject.next(true);
      return;
  }
};

const isEqualGameEvent = <T extends GameEvent>(prev: T, curr: T) => {
  return prev.id === curr.id;
};
const scheduleHandler$ = gameEvent$.pipe(
  distinctUntilChanged(isEqualGameEvent),
  tap((gameEvent) => {
    console.log('[Scheduling Task Start] ', gameEvent);
    /**
     * TODO: schedule task
     * - eventをもとに発火するeffectの洗い出し
     * - effectの分岐と収束をderivedEffectsCountでカウント
     * - derivedEffectsCountが-1になったら収束とし、scheduling taskは完了となる
     * ===
     */
    const scheduledGameEvent: ScheduledGameEvent = {
      ...gameEvent,
      effects: [],
      derivedEffectsCount: -1,
    };
    completedSchedulingSubject.next(scheduledGameEvent);
  })
);

const applyEffectsHandler$ = completedScheduling$.pipe(
  distinctUntilChanged(isEqualGameEvent),
  tap((scheduledGameEvent) => {
    console.log('[Apply Effects Task Start] ', scheduledGameEvent);
    /**
     * TODO: apply task
     * - effectsを順番に実行し、stateを更新していく
     * ===
     */
    completedApplyEffectsSubject.next(scheduledGameEvent);
  })
);

const dispatchNextGameEventHandler$ = completedApplyEffects$.pipe(
  distinctUntilChanged(isEqualGameEvent),
  tap((completedGameEvent) => {
    console.log('[Dispatch Game Event Task Start] ', completedGameEvent);
    if (completedGameEvent.nextGameEvent != null) {
      gameEventSubject.next(completedGameEvent.nextGameEvent);
    }
    dispatchNextGameEventByAuto(completedGameEvent);
  })
);

const main = () => {
  merge(scheduleHandler$, applyEffectsHandler$, dispatchNextGameEventHandler$)
    .pipe(
      takeUntil(
        completedGame$.pipe(
          tap(() => {
            console.log('[Complete!]');
          })
        )
      )
    )
    .subscribe();

  const gameEvent: GameEvent = {
    id: v4(),
    type: 'start-turn',
  };
  console.log('[Dispatch Init Game Event] ', gameEvent);
  gameEventSubject.next(gameEvent);
};

main();

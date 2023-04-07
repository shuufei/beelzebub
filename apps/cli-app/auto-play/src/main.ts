import { BoardCard, BoardState, Player } from '@beelzebub/vs/domain';
import {
  BehaviorSubject,
  Subject,
  distinctUntilChanged,
  map,
  merge,
  share,
  take,
  takeUntil,
  tap,
} from 'rxjs';
import { v4 } from 'uuid';
import { SETUP_DECK } from './data/setup-deck';

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
  // me: INITIALI_BOARD_STATE,
  me: SETUP_DECK,
  opponent: INITIALI_BOARD_STATE,
  memory: {
    player: undefined,
    count: 0,
  },
};
const stateBehaviorSubject = new BehaviorSubject<State>(INITIAL_STATE);
const state$ = stateBehaviorSubject.asObservable();

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
// type GameEventType = PhaseEventType | 'appear-digimon';

type _GameEvent<
  T extends string,
  P extends { [key: string]: unknown } | undefined
> = {
  type: T;
  props: P;
};

// TODO: propsでplayerの指定が必要
type StartTurnGameEvent = _GameEvent<'start-turn', undefined>;
type EndTurnGameEvent = _GameEvent<'end-turn', undefined>;
type StartActiveGameEvent = _GameEvent<'start-active', undefined>;
type EndActiveGameEvent = _GameEvent<'end-active', undefined>;
type StartDrawGameEvent = _GameEvent<'start-draw', undefined>;
type EndDrawGameEvent = _GameEvent<'end-draw', undefined>;
type StartGrawthGameEvent = _GameEvent<'start-grawth', undefined>;
type EndGrawthGameEvent = _GameEvent<'end-grawth', undefined>;
type StartMainGameEvent = _GameEvent<'start-main', undefined>;
type EndMainGameEvent = _GameEvent<'end-main', undefined>;
type AppearDigimonGameEvent = _GameEvent<
  'appear-digimon',
  {
    boardCard: BoardCard;
  }
>;
type GameEvent =
  | AppearDigimonGameEvent
  | StartTurnGameEvent
  | EndTurnGameEvent
  | StartActiveGameEvent
  | EndActiveGameEvent
  | StartDrawGameEvent
  | EndDrawGameEvent
  | StartGrawthGameEvent
  | EndGrawthGameEvent
  | StartMainGameEvent
  | EndMainGameEvent;
type GameEventType = GameEvent['type'];
type DispatchedGameEvent = GameEvent & {
  id: string;
  nextGameEvent?: DispatchedGameEvent;
};
// type _GameEvent = {
//   id: string;
//   type: GameEventType;
//   nextGameEvent?: _GameEvent;
// };

const gameEventSubject = new Subject<DispatchedGameEvent>();
const gameEvent$ = gameEventSubject.asObservable();

const currentGameEvent$ = gameEvent$.pipe(share());
const currentPhase$ = gameEvent$.pipe(
  // TODO: phase eventをもとに現在のphaseなのか、どちらのターンなのかを保持する
  share()
);

type ScheduledGameEvent = DispatchedGameEvent & {
  effects: Effect[];
  derivedEffectsCount: number;
};
const completedSchedulingSubject = new Subject<ScheduledGameEvent>();
const completedScheduling$ = completedSchedulingSubject.asObservable();

const completedApplyEffectsSubject = new Subject<ScheduledGameEvent>();
const completedApplyEffects$ = completedApplyEffectsSubject.asObservable();

const completedGameSubject = new Subject<boolean>();
const completedGame$ = completedGameSubject.asObservable();

const dispatchMainPhaseGameEvent = () => {
  state$
    .pipe(
      take(1),
      map(({ me }) => {
        const handAreaOptions = me.hand
          .map((boardCard) => {
            if (boardCard.card.cardtype !== 'デジモン') {
              return [];
            }
            const appearEvent: DispatchedGameEvent = {
              id: v4(),
              type: 'appear-digimon',
              props: {
                boardCard: boardCard,
              },
            };
            return [appearEvent];
          })
          .flat();
        return handAreaOptions;
      }),
      tap((options) => {
        const randomIndex = Math.floor(Math.random() * options.length);
        const nextGameEvent = options[randomIndex];
        if (nextGameEvent == null) {
          return;
        }
        gameEventSubject.next(nextGameEvent);
      })
    )
    .subscribe();
};
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
  const nextGameEventId: DispatchedGameEvent['id'] = v4();
  switch (completedGameEvent.type) {
    case 'start-turn':
      gameEventSubject.next({
        id: nextGameEventId,
        type: 'start-active',
        props: undefined,
      });
      return;
    case 'start-active':
      gameEventSubject.next({
        id: nextGameEventId,
        type: 'end-active',
        props: undefined,
      });
      return;
    case 'end-active':
      gameEventSubject.next({
        id: nextGameEventId,
        type: 'start-draw',
        props: undefined,
      });
      return;
    case 'start-draw':
      gameEventSubject.next({
        id: nextGameEventId,
        type: 'end-draw',
        props: undefined,
      });
      return;
    case 'end-draw':
      gameEventSubject.next({
        id: nextGameEventId,
        type: 'start-grawth',
        props: undefined,
      });
      return;
    case 'start-grawth':
      gameEventSubject.next({
        id: nextGameEventId,
        type: 'end-grawth',
        props: undefined,
      });
      return;
    case 'end-grawth':
      gameEventSubject.next({
        id: nextGameEventId,
        type: 'start-main',
        props: undefined,
      });
      return;
    case 'start-main':
      dispatchMainPhaseGameEvent();
      return;
    case 'end-main':
      gameEventSubject.next({
        id: nextGameEventId,
        type: 'end-turn',
        props: undefined,
      });
      return;
    default:
      // completedGameSubject.next(true);
      return;
  }
};

const isEqualGameEvent = <T extends DispatchedGameEvent>(prev: T, curr: T) => {
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
      ),
      take(200)
    )
    .subscribe();

  const gameEvent: DispatchedGameEvent = {
    id: v4(),
    type: 'start-turn',
    props: undefined,
  };
  console.log('[Dispatch Init Game Event] ', gameEvent);
  gameEventSubject.next(gameEvent);
};

main();

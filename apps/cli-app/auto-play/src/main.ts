import { BoardCard, BoardState } from '@beelzebub/vs/domain';
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

type Player = 'player1' | 'player2';
type Phase = 'start' | 'active' | 'draw' | 'growth' | 'main' | 'end';
type State = {
  player1: BoardState;
  player2: BoardState;
  memory: {
    player?: Player;
    count: number;
  };
  turn: {
    phase: Phase;
    player: Player;
  };
};

const START_PLAYER: Player = 'player1';
const INITIAL_STATE: State = {
  // me: INITIALI_BOARD_STATE,
  player1: SETUP_DECK,
  player2: INITIALI_BOARD_STATE,
  memory: {
    player: START_PLAYER,
    count: 0,
  },
  turn: {
    phase: 'start',
    player: START_PLAYER,
  },
};
const stateBehaviorSubject = new BehaviorSubject<State>(INITIAL_STATE);
const state$ = stateBehaviorSubject.asObservable();
const updateState = (updated: Partial<State>) => {
  state$
    .pipe(
      take(1),
      tap((state) => {
        stateBehaviorSubject.next({
          ...state,
          ...updated,
        });
      })
    )
    .subscribe();
};
const getNextTurnPlayer = (currentTurnPlayer: Player): Player => {
  switch (currentTurnPlayer) {
    case 'player1':
      return 'player2';
    case 'player2':
      return 'player1';
  }
};

type Effect = undefined;
type PhaseEventType =
  | 'start-turn'
  | 'end-turn'
  | 'start-active'
  | 'end-active'
  | 'start-draw'
  | 'end-draw'
  | 'start-growth'
  | 'end-growth'
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
type StartGrawthGameEvent = _GameEvent<'start-growth', undefined>;
type EndGrawthGameEvent = _GameEvent<'end-growth', undefined>;
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
  player: Player;
};

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

const dispatchMainPhaseGameEvent = (state: State) => {
  const { memory } = state;
  const currentPlayer = memory.player;
  if (currentPlayer == null) {
    /**
     * TODO:
     * ゲーム開始処理の実行
     */
    return;
  }
  const player = state[currentPlayer];
  const options = player.hand
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
        player: currentPlayer,
      };
      return [appearEvent];
    })
    .flat();
  const randomIndex = Math.floor(Math.random() * options.length);
  const nextGameEvent = options[randomIndex];
  if (nextGameEvent == null) {
    return;
  }
  gameEventSubject.next(nextGameEvent);
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
  state$
    .pipe(
      take(1),
      tap((state) => {
        if (
          state.turn.phase === 'main' &&
          state.turn.player !== state.memory.player &&
          completedGameEvent.type !== 'end-main'
        ) {
          gameEventSubject.next({
            id: v4(),
            type: 'end-main',
            props: undefined,
            player: state.turn.player,
          });
        }
        const nextGameEventId: DispatchedGameEvent['id'] = v4();
        switch (completedGameEvent.type) {
          case 'start-turn':
            updateState({
              turn: {
                phase: 'active',
                player: state.turn.player,
              },
            });
            gameEventSubject.next({
              id: nextGameEventId,
              type: 'start-active',
              props: undefined,
              player: state.turn.player,
            });
            return;
          case 'start-active':
            gameEventSubject.next({
              id: nextGameEventId,
              type: 'end-active',
              props: undefined,
              player: state.turn.player,
            });
            return;
          case 'end-active':
            updateState({
              turn: {
                phase: 'draw',
                player: state.turn.player,
              },
            });
            gameEventSubject.next({
              id: nextGameEventId,
              type: 'start-draw',
              props: undefined,
              player: state.turn.player,
            });
            return;
          case 'start-draw':
            gameEventSubject.next({
              id: nextGameEventId,
              type: 'end-draw',
              props: undefined,
              player: state.turn.player,
            });
            return;
          case 'end-draw':
            updateState({
              turn: {
                phase: 'growth',
                player: state.turn.player,
              },
            });
            gameEventSubject.next({
              id: nextGameEventId,
              type: 'start-growth',
              props: undefined,
              player: state.turn.player,
            });
            return;
          case 'start-growth':
            gameEventSubject.next({
              id: nextGameEventId,
              type: 'end-growth',
              props: undefined,
              player: state.turn.player,
            });
            return;
          case 'end-growth':
            updateState({
              turn: {
                phase: 'main',
                player: state.turn.player,
              },
            });
            gameEventSubject.next({
              id: nextGameEventId,
              type: 'start-main',
              props: undefined,
              player: state.turn.player,
            });
            return;
          case 'start-main':
            dispatchMainPhaseGameEvent(state);
            return;
          case 'end-main':
            updateState({
              turn: {
                phase: 'end',
                player: state.turn.player,
              },
            });
            gameEventSubject.next({
              id: nextGameEventId,
              type: 'end-turn',
              props: undefined,
              player: state.turn.player,
            });
            return;
          case 'end-turn':
            updateState({
              turn: {
                phase: 'start',
                player: getNextTurnPlayer(state.turn.player),
              },
            });
            gameEventSubject.next({
              id: nextGameEventId,
              type: 'start-turn',
              props: undefined,
              player: getNextTurnPlayer(state.turn.player),
            });
            return;
          default:
            // completedGameSubject.next(true);
            return;
        }
      })
    )
    .subscribe();
};

const isEqualGameEvent = <T extends DispatchedGameEvent>(prev: T, curr: T) => {
  return prev.id === curr.id;
};
const scheduleHandler$ = gameEvent$.pipe(
  distinctUntilChanged(isEqualGameEvent),
  tap((gameEvent) => {
    console.log('===== [Dispatched Game Event] ', gameEvent);
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

    /**
     * TMP: 一時的にmemoryを強制変更
     */
    if (scheduledGameEvent.type === 'appear-digimon') {
      const nextPlayer: Player = getNextTurnPlayer(scheduledGameEvent.player);
      updateState({
        memory: {
          player: nextPlayer,
          count: 3,
        },
      });
    }

    completedApplyEffectsSubject.next(scheduledGameEvent);
  })
);

const dispatchNextGameEventHandler$ = completedApplyEffects$.pipe(
  distinctUntilChanged(isEqualGameEvent),
  tap((completedGameEvent) => {
    console.log('[Completed Game Event] ', completedGameEvent);
    if (completedGameEvent.nextGameEvent != null) {
      gameEventSubject.next(completedGameEvent.nextGameEvent);
    }
    dispatchNextGameEventByAuto(completedGameEvent);
  })
);

const main = () => {
  merge(scheduleHandler$, applyEffectsHandler$, dispatchNextGameEventHandler$)
    .pipe(
      take(2)
      // takeUntil(
      //   completedGame$.pipe(
      //     tap(() => {
      //       console.log('[Complete!]');
      //     })
      //   )
      // )
    )
    .subscribe();

  const gameEvent: DispatchedGameEvent = {
    id: v4(),
    type: 'start-turn',
    props: undefined,
    player: START_PLAYER,
  };
  console.log('[Dispatch Init Game Event] ', gameEvent);
  gameEventSubject.next(gameEvent);
};

main();

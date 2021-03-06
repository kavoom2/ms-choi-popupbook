import { pageDelay, pageKeyList, pageTimeout } from "@lib/constants/scenes";
import {
  assetLoader,
  home,
  intro,
  outro,
  scene,
} from "@lib/constants/stageMachineStates";
import {
  BOOK_END_ANIMATION,
  BOOK_START_ANIMATION,
  END_ANIMATION,
  FAIL_ASSET_LOAD,
  GO_NEXT_PAGE,
  GO_NEXT_SUBTITLE,
  GO_PREV_PAGE,
  GO_PREV_SUBTITLE,
  OUTRO_ENTER_END,
  OUTRO_ENTER_START,
  OUTRO_EXIT_END,
  OUTRO_EXIT_START,
  PLAY_APP,
  REPLAY_APP,
  START_ANIMATION,
  STEP,
  SUBTITLE_END_ANIMATION,
  SUBTITLE_START_ANIMATION,
  SUCCEED_ASSET_LOAD,
} from "@lib/constants/stateMachineActions";
import {
  subtitleDelay,
  subtitles,
  subtitleTimeout,
} from "@lib/constants/subtitles";
import { assign, createMachine, send } from "xstate";

/**
 * * 화면단 변수 설정
 */
const maxPages = pageKeyList.length;

// 변수 - Delay
const assetLoaderDelay = 200;
const homeDelay = 800;
const homeExitDelay = 50;
const introDelay = 2500;
const outroEnterDelay = 3000;
const outroExitDelay = 1000;

/**
 * XState Machine 정의
 */
const id = "stage";

const initial = assetLoader;

const context = {
  [assetLoader]: {
    isAssetLoaded: false,
  },
  [home]: {
    isAnimating: false,
    isAnimationEnd: false,
  },
  [intro]: {
    isAnimating: false,
    isAnimationEnd: false,
  },
  [scene]: {
    book: {
      page: -1,
      maxPages,
      isAnimating: false,
    },
    subtitle: {
      curIdx: 0,
      maxIdx: 0,
      isAnimating: false,
    },
  },
  [outro]: {
    isEntering: false,
    isEnterEnd: false,
    isExiting: false,
    isExitEnd: false,
  },
};

const states = {
  /**
   * Asset Loading 스테이지
   */
  [assetLoader]: {
    on: {
      [STEP]: {
        target: home,
        cond: (ctx, event) => ctx[assetLoader].isAssetLoaded,
      },
      [SUCCEED_ASSET_LOAD]: {
        actions: [
          assign({
            [assetLoader]: {
              isAssetLoaded: true,
            },
          }),
          send({ type: STEP }, { delay: assetLoaderDelay }),
        ],
      },
      [FAIL_ASSET_LOAD]: {
        actions: [
          assign({
            [assetLoader]: {
              isAssetLoaded: false,
            },
          }),
        ],
      },
    },
  },

  /**
   * Home 스테이지
   */
  [home]: {
    on: {
      [STEP]: {
        target: intro,
        cond: (ctx, event) => ctx[home].isAnimationEnd,
      },
      [START_ANIMATION]: {
        actions: [
          assign({
            [home]: { isAnimating: true, isAnimationEnd: false },
          }),
          send({ type: END_ANIMATION }, { delay: homeDelay }),
        ],
      },
      [END_ANIMATION]: {
        actions: [
          assign({
            [home]: { isAnimating: false, isAnimationEnd: true },
          }),
          send({ type: STEP }, { delay: homeExitDelay }),
        ],
      },
      [PLAY_APP]: {
        actions: [send({ type: START_ANIMATION })],
      },
    },
    exit: [
      assign({
        [home]: { isAnimating: false, isAnimationEnd: false },
      }),
    ],
  },

  /**
   * Intro 스테이지
   */
  [intro]: {
    entry: [send({ type: START_ANIMATION })],
    on: {
      [STEP]: {
        target: scene,
        cond: (ctx, event) => ctx[intro].isAnimationEnd,
      },
      [START_ANIMATION]: {
        actions: [
          assign({
            [intro]: { isAnimating: true, isAnimationEnd: false },
          }),
          send({ type: END_ANIMATION }, { delay: introDelay }),
        ],
      },
      [END_ANIMATION]: {
        actions: [
          assign({
            [intro]: { isAnimating: false, isAnimationEnd: true },
          }),
        ],
      },
    },
    exit: [
      assign({
        [intro]: { isAnimating: false, isAnimationEnd: false },
      }),
    ],
  },

  /**
   * Scene 스테이지
   */
  [scene]: {
    entry: [send({ type: GO_NEXT_PAGE })],
    exit: [
      assign({
        [scene]: {
          book: {
            page: -1,
            maxPages,
            isAnimating: false,
          },
          subtitle: {
            curIdx: 0,
            maxIdx: 0,
            isAnimating: false,
          },
        },
      }),
    ],
    on: {
      [STEP]: {
        target: outro,
        cond: (ctx, event) =>
          ctx[scene].book.page === ctx[scene].book.maxPages - 1 &&
          ctx[scene].subtitle.curIdx === ctx[scene].subtitle.maxIdx &&
          !ctx[scene].book.isAnimating &&
          !ctx[scene].subtitle.isAnimating,
      },

      [GO_NEXT_PAGE]: {
        cond: (ctx, event) =>
          ctx[scene].book.page < ctx[scene].book.maxPages &&
          ctx[scene].subtitle.curIdx >= ctx[scene].subtitle.maxIdx &&
          !ctx[scene].book.isAnimating &&
          !ctx[scene].subtitle.isAnimating,
        actions: [
          assign((ctx, event) => {
            const page = ctx[scene].book.page + 1;
            const curIdx = 0;
            const maxIdx = subtitles[page]?.length - 1 ?? 0;

            return {
              ...ctx,
              [scene]: {
                book: {
                  ...ctx[scene].book,
                  page,
                },
                subtitle: {
                  ...ctx[scene].subtitle,
                  curIdx,
                  maxIdx,
                },
              },
            };
          }),
          send({ type: BOOK_START_ANIMATION }),
          send({ type: SUBTITLE_START_ANIMATION }),
          send(
            { type: BOOK_END_ANIMATION },
            {
              delay:
                pageTimeout.next +
                subtitleTimeout.enter +
                pageDelay.uiDisableDelay,
            }
          ),
          send(
            { type: SUBTITLE_END_ANIMATION },
            {
              delay:
                subtitleTimeout.enter +
                subtitleDelay.pageTransitionDelay +
                subtitleDelay.uiDisableDelay,
            }
          ),
        ],
      },

      [GO_PREV_PAGE]: {
        cond: (ctx, event) =>
          ctx[scene].book.page > 0 &&
          ctx[scene].subtitle.curIdx === 0 &&
          !ctx[scene].book.isAnimating &&
          !ctx[scene].subtitle.isAnimating,
        actions: [
          assign((ctx, event) => {
            const page = ctx[scene].book.page - 1;
            const maxIdx = subtitles[page]?.length - 1 ?? 0;
            const curIdx = maxIdx;

            return {
              ...ctx,
              [scene]: {
                book: {
                  ...ctx[scene].book,
                  page,
                },
                subtitle: {
                  ...ctx[scene].subtitle,
                  curIdx,
                  maxIdx,
                },
              },
            };
          }),
          send({ type: BOOK_START_ANIMATION }),
          send({ type: SUBTITLE_START_ANIMATION }),
          send(
            { type: BOOK_END_ANIMATION },
            {
              delay:
                pageTimeout.prev +
                subtitleTimeout.enter +
                pageDelay.uiDisableDelay,
            }
          ),
          send(
            { type: SUBTITLE_END_ANIMATION },
            {
              delay:
                subtitleTimeout.enter +
                subtitleDelay.pageTransitionDelay +
                subtitleDelay.uiDisableDelay,
            }
          ),
        ],
      },

      [GO_NEXT_SUBTITLE]: {
        cond: (ctx, event) =>
          ctx[scene].subtitle.curIdx < ctx[scene].subtitle.maxIdx &&
          !ctx[scene].book.isAnimating &&
          !ctx[scene].subtitle.isAnimating,
        actions: [
          assign((ctx, event) => {
            const curIdx = ctx[scene].subtitle.curIdx + 1;

            return {
              ...ctx,
              [scene]: {
                ...ctx[scene],
                subtitle: {
                  ...ctx[scene].subtitle,
                  curIdx,
                },
              },
            };
          }),
          send({ type: SUBTITLE_START_ANIMATION }),
          send(
            { type: SUBTITLE_END_ANIMATION },
            {
              delay: subtitleTimeout.enter + subtitleDelay.uiDisableDelay,
            }
          ),
        ],
      },

      [GO_PREV_SUBTITLE]: {
        cond: (ctx, event) =>
          ctx[scene].subtitle.curIdx > 0 &&
          !ctx[scene].book.isAnimating &&
          !ctx[scene].subtitle.isAnimating,
        actions: [
          assign((ctx, event) => {
            const curIdx = ctx[scene].subtitle.curIdx - 1;

            return {
              ...ctx,
              [scene]: {
                ...ctx[scene],
                subtitle: {
                  ...ctx[scene].subtitle,
                  curIdx,
                },
              },
            };
          }),
          send({ type: SUBTITLE_START_ANIMATION }),
          send(
            { type: SUBTITLE_END_ANIMATION },
            {
              delay: subtitleTimeout.enter + subtitleDelay.uiDisableDelay,
            }
          ),
        ],
      },

      [BOOK_START_ANIMATION]: {
        cond: (ctx, event) => !ctx[scene].book.isAnimating,
        actions: [
          assign({
            [scene]: (ctx, event) => ({
              ...ctx[scene],
              book: {
                ...ctx[scene].book,
                isAnimating: true,
              },
            }),
          }),
        ],
      },

      [BOOK_END_ANIMATION]: {
        cond: (ctx, event) => ctx[scene].book.isAnimating,
        actions: [
          assign({
            [scene]: (ctx, event) => ({
              ...ctx[scene],
              book: {
                ...ctx[scene].book,
                isAnimating: false,
              },
            }),
          }),
        ],
      },

      [SUBTITLE_START_ANIMATION]: {
        cond: (ctx, event) => !ctx[scene].subtitle.isAnimating,
        actions: [
          assign({
            [scene]: (ctx, event) => ({
              ...ctx[scene],
              subtitle: {
                ...ctx[scene].subtitle,
                isAnimating: true,
              },
            }),
          }),
        ],
      },

      [SUBTITLE_END_ANIMATION]: {
        cond: (ctx, event) => ctx[scene].subtitle.isAnimating,
        actions: [
          assign({
            [scene]: (ctx, event) => ({
              ...ctx[scene],
              subtitle: {
                ...ctx[scene].subtitle,
                isAnimating: false,
              },
            }),
          }),
        ],
      },
    },
  },

  /**
   * Outro 스테이지
   */
  [outro]: {
    entry: [send({ type: OUTRO_ENTER_START })],
    on: {
      [STEP]: {
        target: intro,
        cond: (ctx, event) => ctx[outro].isExitEnd,
      },
      [OUTRO_ENTER_START]: {
        actions: [
          assign({
            [outro]: (ctx, event) => ({
              ...ctx[outro],
              isEntering: true,
              isEnterEnd: false,
            }),
          }),
          send({ type: OUTRO_ENTER_END }, { delay: outroEnterDelay }),
        ],
      },
      [OUTRO_ENTER_END]: {
        actions: [
          assign({
            [outro]: (ctx, event) => ({
              ...ctx[outro],
              isEntering: false,
              isEnterEnd: true,
            }),
          }),
        ],
      },
      [OUTRO_EXIT_START]: {
        actions: [
          assign({
            [outro]: (ctx, event) => ({
              ...ctx[outro],
              isExiting: true,
              isExitEnd: false,
            }),
          }),
          send({ type: OUTRO_EXIT_END }, { delay: outroExitDelay }),
        ],
      },
      [OUTRO_EXIT_END]: {
        actions: [
          assign({
            [outro]: (ctx, event) => ({
              ...ctx[outro],
              isExiting: false,
              isExitEnd: true,
            }),
          }),
          send({ type: STEP }),
        ],
      },
      [REPLAY_APP]: {
        cond: (ctx, event) => ctx[outro].isEnterEnd,
        actions: [send({ type: OUTRO_EXIT_START })],
      },
    },
    exit: [
      assign({
        [outro]: {
          isEntering: false,
          isEnterEnd: false,
          isExiting: false,
          isExitEnd: false,
        },
      }),
    ],
  },
};

/**
 * Experience stage machine
 */
const stageMachine = createMachine({
  id,
  initial,
  context,
  states,
});

export default stageMachine;

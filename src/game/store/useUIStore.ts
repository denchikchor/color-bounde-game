import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import type { UIInitialState, UIState } from "../types";
import { DEFAULT_DOTS_PER_COLOR, DEFAULT_COLORS } from "../constants";
import { clampDots } from "../utils";

export const initialState: UIInitialState = {
    screen: 'menu',
    colors: [...DEFAULT_COLORS],
    dotsPerColor: DEFAULT_DOTS_PER_COLOR,
    draftColors: [...DEFAULT_COLORS],
    draftDotsPerColor: DEFAULT_DOTS_PER_COLOR,
};

export const useUI = create<UIState>()(
    devtools(
        persist(
            (set, get) => ({
                ...initialState,
                setScreen: (screen) => set({ screen }),
                setDraft: (p) => set(p),
                openSettings: () => {
                    const { colors, dotsPerColor } = get();
                    set({ screen: 'settings', draftColors: colors.slice(), draftDotsPerColor: dotsPerColor });
                },
                applyAndGoGame: () => {
                    const { draftColors, draftDotsPerColor } = get();
                    set({
                        screen: 'game',
                        colors: (draftColors.length ? draftColors : ['#FFFFFF']).slice(),
                        dotsPerColor: clampDots(draftDotsPerColor),
                    });
                },
                startDefaultGame: () => {
                    const { colors, dotsPerColor } = initialState;
                    set({
                        screen: 'game',
                        colors,
                        dotsPerColor: clampDots(dotsPerColor),
                        draftColors: colors,
                        draftDotsPerColor: dotsPerColor,
                    })
                },
                backToMenu: () => {
                    set({ screen: 'menu' });
                }
            }),
            {
                name: 'color-dot-game-ui',
                storage: createJSONStorage(() => localStorage),
                partialize: (state) => ({
                    colors: state.colors,
                    dotsPerColor: state.dotsPerColor,
                    draftColors: state.draftColors,
                    draftDotsPerColor: state.draftDotsPerColor,
                }),
            }
        )
    )
)

export const uiSelectors = {
    screen: (s: UIState) => s.screen,
    colors: (s: UIState) => s.colors,
    dotsPerColor: (s: UIState) => s.dotsPerColor,
    draftColors: (s: UIState) => s.draftColors,
    draftDotsPerColor: (s: UIState) => s.draftDotsPerColor,
    setScreen: (s: UIState) => s.setScreen,
    setDraft: (s: UIState) => s.setDraft,
    openSettings: (s: UIState) => s.openSettings,
    applyAndGoGame: (s: UIState) => s.applyAndGoGame,
    startDefaultGame: (s: UIState) => s.startDefaultGame,
    backToMenu: (s: UIState) => s.backToMenu,
} as const;
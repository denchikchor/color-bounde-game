export type Screen = 'menu' | 'settings' | 'game' | 'result';

export type Ptr = 'mouse' | 'touch' | 'pen';

export type Dot = {
  id: string;
  colorKey: string;
  x: number; y: number;
  vx: number; vy: number;
  phase: number; freq: number;
};

export type Options = { onWin: () => void };

export type InitialProps = { initialDotsPerColor?: number; initialColors?: string[]; };

export interface GameFieldProps {
  fieldRef: React.RefObject<HTMLDivElement | null>;
  dotElsRef: React.RefObject<Map<string, HTMLDivElement>>;
  dotsRef: React.RefObject<Dot[]>;
  paletteRef: React.RefObject<string[]>;
  playTimeSec: number;
  onPointerMove: (e: React.PointerEvent) => void;
  onPointerLeave: () => void;
}

export interface ClusterEngine extends GameFieldProps {
  setConfig: (colors: string[], dotsPerColor: number) => void;
  enterGame: () => void;
  exitGame: () => void;
  sceneKey: number;
  timerTick: number;
}

export interface UIActions {
    setScreen: (screen: Screen) => void;
    setDraft: (p: Partial<Pick<UIState, 'draftColors' | 'draftDotsPerColor'>>) => void;
    openSettings: () => void;
    applyAndGoGame: () => void;
    startDefaultGame: (defaults?: { colors?: string[]; dotsPerColor?: number }) => void;
    backToMenu: () => void;
}

export interface UIInitialState {
    screen: Screen;
    colors: string[];
    dotsPerColor: number;
    draftColors: string[];
    draftDotsPerColor: number;
}

export interface UIState extends UIInitialState, UIActions {}
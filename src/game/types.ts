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

export type ClusterEngine = {
  setConfig: (colors: string[], dotsPerColor: number) => void;
  enterGame: () => void;
  exitGame: () => void;
  sceneKey: number;
  fieldRef: React.RefObject<HTMLDivElement | null>;
  dotElsRef: React.RefObject<Map<string, HTMLDivElement>>;
  dotsRef: React.RefObject<Dot[]>;
  paletteRef: React.RefObject<string[]>;
  playTimeSec: number;
  timerTick: number;
  onPointerMove: (e: React.PointerEvent) => void;
  onPointerLeave: () => void;
};

export type GameFieldProps = {
  fieldRef: React.RefObject<HTMLDivElement | null>;
  dotElsRef: React.RefObject<Map<string, HTMLDivElement>>;
  dotsRef: React.RefObject<Dot[]>;
  paletteRef: React.RefObject<string[]>;
  playTimeSec: number;
  onPointerMove: (e: React.PointerEvent) => void;
  onPointerLeave: () => void;
};

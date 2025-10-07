export type Screen = 'menu' | 'settings' | 'game' | 'result';

export type Dot = {
  id: string;
  colorKey: string;
  x: number; y: number;
  vx: number; vy: number;
  phase: number; freq: number;
};

export type Ptr = 'mouse' | 'touch';


export type Options = {
  onWin: () => void;
};
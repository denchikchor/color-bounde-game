export function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export const clampDots = (n: number) => Math.max(2, Math.min(100, Math.trunc(n)));

import { useEffect, useRef, useState } from 'react';
import type { Dot, Options, Ptr } from './types';
import {
  BOUNCE, CLUSTER_RADIUS, COLLISION_PUSH, DT, DOT_SIZE, EXCLUSION_MARGIN,
  FRICTION, HOVER_RADIUS, IDLE_FORCE, IDLE_FREQ_MAX, IDLE_FREQ_MIN,
  IMPULSE_SCALE, MAX_SPEED, STRENGTH,
  DEFAULT_DOTS_PER_COLOR,
  SPAWN_VELOCITY,
} from './constants';
import { rand } from './utils';

export function useClusterEngine({ onWin }: Options) {
  const paletteRef = useRef<string[]>([]);
  const colorsOrderRef = useRef<string[]>([]);

  const fieldRef = useRef<HTMLDivElement | null>(null);
  const dotElsRef = useRef<Map<string, HTMLDivElement>>(new Map());
  const dotsRef = useRef<Dot[]>([]);
  const loopIdRef = useRef<number | null>(null);
  const timeRef = useRef(0);
  const lastClusterCheckRef = useRef(0);

  const pointer = useRef<{ x: number; y: number; inside: boolean; type: Ptr }>({
    x: 0, y: 0, inside: false, type: 'mouse',
  });

  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [finishedAt, setFinishedAt] = useState<number | null>(null);
  const finishedAtRef = useRef<number | null>(null);

  const [timerTick, setTimerTick] = useState(0);

  useEffect(() => {
    if (!startedAt || finishedAt) return;
    const id = setInterval(() => {
      setTimerTick((t) => (t + 1) % 1_000_000);
    }, 250);
    return () => clearInterval(id);
  }, [startedAt, finishedAt]);

  useEffect(() => {
    finishedAtRef.current = finishedAt;
  }, [finishedAt]);

  const playTimeSec =
    startedAt && !finishedAt
      ? Math.floor((performance.now() - startedAt) / 1000)
      : startedAt && finishedAt
      ? Math.floor((finishedAt - startedAt) / 1000)
      : 0;

  // Force re-mount of field contents when (re)spawn
  const [sceneKey, setSceneKey] = useState(0);

  // Public configuration setter
  const setConfig = (colors: string[], dotsPerColor: number) => {
    paletteRef.current = colors.slice();
    colorsOrderRef.current = colors.map((_, i) => `c${i}`);
    dotsPerColorRef.current = dotsPerColor;
  };

  const dotsPerColorRef = useRef(DEFAULT_DOTS_PER_COLOR);

  const enterGame = () => {
    finishedAtRef.current = null;
    spawnDots();
    setSceneKey((k) => k + 1);
    setStartedAt(performance.now());
    setFinishedAt(null);
    startLoop();
  };

  const exitGame = () => {
    stopLoop();
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const field = fieldRef.current;
    if (!field) return;
    const rect = field.getBoundingClientRect();
    pointer.current.x = e.clientX - rect.left;
    pointer.current.y = e.clientY - rect.top;
    pointer.current.type = e.pointerType as Ptr;
    pointer.current.inside = true;
  };
  const onPointerLeave = () => { pointer.current.inside = false; };

  function spawnDots() {
    const field = fieldRef.current;
    if (!field) return;
    const rect = field.getBoundingClientRect();

    const padding = 24;
    const arr: Dot[] = [];
    const keys = colorsOrderRef.current;
    const dotsPerColor = dotsPerColorRef.current;

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      for (let j = 0; j < dotsPerColor; j++) {
        arr.push({
          id: `${key}-${j}-${Math.random().toString(36).slice(2)}`,
          colorKey: key,
          x: rand(padding, rect.width - padding),
          y: rand(padding, rect.height - padding - 2),
          vx: rand(-SPAWN_VELOCITY, SPAWN_VELOCITY),
          vy: rand(-SPAWN_VELOCITY, SPAWN_VELOCITY),
          phase: rand(0, Math.PI * 2),
          freq: rand(IDLE_FREQ_MIN, IDLE_FREQ_MAX),
        });
      }
    }

    dotsRef.current = arr;
  }

  function startLoop() {
    if (loopIdRef.current !== null) return;

    let last = performance.now();
    let acc = 0;

    const step = () => {
      const now = performance.now();
      acc += (now - last) / 1000;
      last = now;
      acc = Math.min(acc, 0.25);
      let substeps = 0;
      while (acc >= DT && substeps++ < 5) {
        physicsStep(DT);
        acc -= DT;
      }

      loopIdRef.current = requestAnimationFrame(step);
    };

    loopIdRef.current = requestAnimationFrame(step);
  }

  function stopLoop() {
    if (loopIdRef.current !== null) {
      cancelAnimationFrame(loopIdRef.current);
      loopIdRef.current = null;
    }
  }

  function physicsStep(dt: number) {
    timeRef.current += dt;
    const field = fieldRef.current;
    if (!field) return;
    const rect = field.getBoundingClientRect();
    const dots = dotsRef.current;

    // Pointer repulsion
    if (pointer.current.inside) {
      const isTouch = pointer.current.type === 'touch';
      const r = isTouch ? HOVER_RADIUS * 1.2 : HOVER_RADIUS;
      const scale = isTouch ? IMPULSE_SCALE * 0.7 : IMPULSE_SCALE;
      for (const d of dots) {
        const dx = d.x - pointer.current.x;
        const dy = d.y - pointer.current.y;
        const dist = Math.hypot(dx, dy);
        if (dist > 0.0001 && dist < r) {
          const force = STRENGTH * (1 - dist / r);
          const nx = dx / dist, ny = dy / dist;
          d.vx += nx * force * scale * dt;
          d.vy += ny * force * scale * dt;
        }
      }
    }

    // Sphere-sphere collision resolution (separation + impulse)
    const minDist = DOT_SIZE;
    for (let i = 0; i < dots.length; i++) {
      for (let j = i + 1; j < dots.length; j++) {
        const a = dots[i], b = dots[j];
        const dx = b.x - a.x, dy = b.y - a.y;
        const dist = Math.hypot(dx, dy);
        if (dist > 0 && dist < minDist) {
          const overlap = (minDist - dist) * COLLISION_PUSH;
          const nx = dx / dist, ny = dy / dist;
          a.x -= nx * overlap * 0.5; a.y -= ny * overlap * 0.5;
          b.x += nx * overlap * 0.5; b.y += ny * overlap * 0.5;
          a.vx -= nx * overlap * 5;  a.vy -= ny * overlap * 5;
          b.vx += nx * overlap * 5;  b.vy += ny * overlap * 5;
        }
      }
    }

    // Integrate, idle micro-motion, bounds, and DOM transforms
    for (const d of dots) {
      const t = timeRef.current;

      // Idle micro-motion (break symmetry and keep motion)
      d.vx += Math.sin(t * d.freq * 2 * Math.PI + d.phase) * IDLE_FORCE * dt;
      d.vy += Math.cos(t * d.freq * 2 * Math.PI + d.phase) * IDLE_FORCE * dt;

      // Friction and speed clamp
      d.vx *= 1 - FRICTION; d.vy *= 1 - FRICTION;
      const speed = Math.hypot(d.vx, d.vy);
      if (speed > MAX_SPEED) { const k = MAX_SPEED / speed; d.vx *= k; d.vy *= k; }

      // Position update
      d.x += d.vx * dt;
      d.y += d.vy * dt;

      // Bounds with bounce
      if (d.x < DOT_SIZE / 2) { d.x = DOT_SIZE / 2; d.vx = Math.abs(d.vx) * BOUNCE; }
      else if (d.x > rect.width - DOT_SIZE / 2) { d.x = rect.width - DOT_SIZE / 2; d.vx = -Math.abs(d.vx) * BOUNCE; }
      if (d.y < DOT_SIZE / 2) { d.y = DOT_SIZE / 2; d.vy = Math.abs(d.vy) * BOUNCE; }
      else if (d.y > rect.height - DOT_SIZE / 2 - 2) { d.y = rect.height - DOT_SIZE / 2 - 2; d.vy = -Math.abs(d.vy) * BOUNCE; }

      // Apply transform to the DOM element
      const el = dotElsRef.current.get(d.id);
      if (el) el.style.transform =
        `translate3d(${d.x - DOT_SIZE / 2}px, ${d.y - DOT_SIZE / 2}px, 0)`;
    }

    checkClusters(performance.now());
  }

  function checkClusters(now: number) {
    if (now - lastClusterCheckRef.current < 200) return;
    lastClusterCheckRef.current = now;

    const dots = dotsRef.current;
    const keys = colorsOrderRef.current;

    // Group by color
    const byColor = Object.fromEntries(
      keys.map<[string, Dot[]]>(k => [k, []])
    );
    for (const d of dots) { (byColor[d.colorKey] ??= []).push(d); }

    // Compute centroids
    const centroids = Object.fromEntries(
      keys.map<[string, { cx: number; cy: number }]>(k => [k, { cx: 0, cy: 0 }])
    );

    for (const key of keys) {
      const arr = byColor[key]; if (!arr?.length) continue;
      centroids[key].cx = arr.reduce((s, d) => s + d.x, 0) / arr.length;
      centroids[key].cy = arr.reduce((s, d) => s + d.y, 0) / arr.length;
    }

    // Validate cluster tightness and exclusion
    let allGood = true;

    for (const key of keys) {
      const arr = byColor[key]; if (!arr?.length) continue;
      const { cx, cy } = centroids[key];

      // Each dot must be within the cluster radius of its centroid
      for (const d of arr) {
        if (Math.hypot(d.x - cx, d.y - cy) > CLUSTER_RADIUS) { allGood = false; break; }
      }
      if (!allGood) break;

      // Dots of other colors must not intrude into this cluster (with margin)
      const exclusion = CLUSTER_RADIUS - EXCLUSION_MARGIN;
      for (const other of keys) {
        if (other === key) continue;
        for (const od of byColor[other] ?? []) {
          if (Math.hypot(od.x - cx, od.y - cy) < exclusion) { allGood = false; break; }
        }
        if (!allGood) break;
      }
      if (!allGood) break;
    }

    // Ensure clusters are sufficiently separated from each other
    if (allGood) {
      for (let i = 0; i < keys.length; i++) {
        for (let j = i + 1; j < keys.length; j++) {
          const a = keys[i], b = keys[j];
          const ca = centroids[a], cb = centroids[b];
          if (Math.hypot(ca.cx - cb.cx, ca.cy - cb.cy) < CLUSTER_RADIUS * 2 - EXCLUSION_MARGIN) {
            allGood = false; break;
          }
        }
        if (!allGood) break;
      }
    }

    // Win condition handling
    if (allGood) {
      if (finishedAtRef.current == null) {
        const timestamp = performance.now();
        finishedAtRef.current = timestamp;
        setFinishedAt(timestamp);
        stopLoop();
        onWin();
      }
    }
  }

  return {
    setConfig,
    enterGame, exitGame, sceneKey, fieldRef, dotElsRef, dotsRef,
    paletteRef, playTimeSec, timerTick, onPointerMove, onPointerLeave,
  };
}

import { DOT_SIZE } from '../constants';
import type { GameFieldProps } from '../types';

export function GameField({
    fieldRef,
    dotElsRef,
    dotsRef,
    paletteRef,
    playTimeSec,
    onPointerMove,
    onPointerLeave,
}: GameFieldProps) {
    return (
        <div
            ref={fieldRef}
            className="relative mt-4 h-[560px] rounded-2xl bg-neutral-900 border border-neutral-800 overflow-hidden cursor-crosshair circle-cursor"
            onPointerMove={onPointerMove}
            onPointerLeave={onPointerLeave}
        >
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-[160px] font-black text-white/5 leading-none tabular-nums">
                    {playTimeSec}
                </div>
            </div>

            {dotsRef.current.map((d) => {
                const idx = parseInt(d.colorKey.slice(1), 10) || 0;
                const hex = paletteRef.current[idx] ?? '#9CA3AF';
                return (
                    <div
                        key={d.id}
                        ref={(el) => {
                            if (el) dotElsRef.current.set(d.id, el);
                            else dotElsRef.current.delete(d.id);
                        }}
                        className="absolute rounded-full will-change-transform"
                        style={{
                            width: DOT_SIZE,
                            height: DOT_SIZE,
                            backgroundColor: hex,
                            transform: `translate3d(${d.x - DOT_SIZE / 2}px, ${
                                d.y - DOT_SIZE / 2
                            }px, 0)`,
                        }}
                    />
                );
            })}
        </div>
    );
}

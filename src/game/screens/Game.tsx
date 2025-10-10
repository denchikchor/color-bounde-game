import { GameField } from '../components/GameField';
import { uiSelectors, useUI } from '../store/useUIStore';
import type { ClusterEngine } from '../types';

export default function Game({ engine }: { engine: ClusterEngine }) {
    const goMenu = useUI(uiSelectors.backToMenu);
    return (
        <div className="mt-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-black">Game</h2>
                <button
                    onClick={goMenu}
                    className="px-3 py-1.5 rounded-xl bg-neutral-800 border border-neutral-700 hover:bg-neutral-700"
                >
                    Main Menu
                </button>
            </div>

            <GameField
                key={engine.sceneKey}
                fieldRef={engine.fieldRef}
                dotElsRef={engine.dotElsRef}
                dotsRef={engine.dotsRef}
                paletteRef={engine.paletteRef}
                playTimeSec={engine.playTimeSec}
                onPointerMove={engine.onPointerMove}
                onPointerLeave={engine.onPointerLeave}
            />
        </div>
    );
}

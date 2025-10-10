import { uiSelectors, useUI } from '../store/ui';
import type { ClusterEngine } from '../types';

export default function Result({ engine }: { engine: ClusterEngine }) {
    const goMenu = useUI(uiSelectors.backToMenu);
    const playAgain = useUI(uiSelectors.startDefaultGame);
    return (
        <div className="mt-8 p-6 flex flex-col justify-center items-center min-h-[300px] rounded-2xl border border-neutral-800 bg-neutral-900 text-center">
            <h2 className="text-3xl font-bold">Success!</h2>
            <p className="text-white/70 mt-2">
                You sorted in{' '}
                <b className="tabular-nums">{engine.playTimeSec}s</b>
            </p>
            <div className="mt-6 flex items-center justify-center gap-3">
                <button
                    onClick={() => playAgain()}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500"
                >
                    Play Again
                </button>
                <button
                    onClick={() => goMenu()}
                    className="px-4 py-2 rounded-xl bg-neutral-800 border border-neutral-700 hover:bg-neutral-700"
                >
                    Main Menu
                </button>
            </div>
        </div>
    );
}

import { uiSelectors, useUI } from '../store/useUIStore';

export default function Menu() {
    const goSettings = useUI(uiSelectors.openSettings);
    const startDefaultGame = useUI(uiSelectors.startDefaultGame);
    return (
        <div className="mt-8 p-6 flex flex-col justify-center items-center min-h-[300px] rounded-2xl border border-neutral-800 bg-neutral-900">
            <div className="text-center">
                <h1 className="text-2xl font-semibold">Color Dot Game</h1>
                <p className="text-white/60 mt-2">Group the dots by color.</p>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-3">
                <button
                    onClick={() => startDefaultGame()}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500"
                >
                    Start Game
                </button>
                <button
                    onClick={() => goSettings()}
                    className="px-4 py-2 rounded-xl bg-neutral-800 border border-neutral-700 hover:bg-neutral-700"
                >
                    Settings
                </button>
            </div>
        </div>
    );
}

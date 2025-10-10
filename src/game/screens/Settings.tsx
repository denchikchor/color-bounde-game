import { uiSelectors, useUI } from '../store/ui';

export default function Settings() {
    const draftColors = useUI(uiSelectors.draftColors);
    const draftDotsPerColor = useUI(uiSelectors.draftDotsPerColor);
    const setDraft = useUI(uiSelectors.setDraft);
    const backToMenu = useUI(uiSelectors.backToMenu);
    const applyAndGoGame = useUI(uiSelectors.applyAndGoGame);

    const setDraftDots = (n: number) => {
        setDraft({ draftDotsPerColor: Math.max(2, Math.min(100, n)) });
    };
    const replaceDraftColor = (i: number, hex: string) => {
        setDraft({
            draftColors: draftColors.map((c, idx) => (idx === i ? hex : c)),
        });
    };
    const removeDraftColor = (i: number) => {
        if (draftColors.length <= 1) return;
        setDraft({ draftColors: draftColors.filter((_, idx) => idx !== i) });
    };

    const addDraftColor = () =>
        setDraft({ draftColors: [...draftColors, '#ffffff'] });

    return (
        <div className="mt-8 p-6 rounded-2xl border border-neutral-800 bg-neutral-900">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Settings</h2>
                <button
                    onClick={backToMenu}
                    className="px-3 py-1.5 rounded-xl bg-neutral-800 border border-neutral-700 hover:bg-neutral-700"
                >
                    ← Back
                </button>
            </div>

            <div className="mt-6 grid gap-6">
                <div>
                    <label className="text-sm text-white/70">
                        Dots per color
                    </label>
                    <input
                        type="number"
                        min={2}
                        max={100}
                        value={draftDotsPerColor}
                        onChange={(e) =>
                            setDraftDots(Number(e.target.value || 2))
                        }
                        className="block mt-1 w-28 rounded-lg bg-neutral-800 border border-neutral-700 px-2 py-1 text-white"
                    />
                </div>

                <div>
                    <label className="text-sm text-white/70">Colors</label>
                    <div className="mt-2 space-y-2">
                        {draftColors.map((hex, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                                <label className="relative inline-block h-9 w-9 rounded-full overflow-hidden border border-neutral-700">
                                    <input
                                        type="color"
                                        value={hex}
                                        onChange={(e) =>
                                            replaceDraftColor(
                                                idx,
                                                e.target.value
                                            )
                                        }
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    <span
                                        className="block w-full h-full"
                                        style={{ backgroundColor: hex }}
                                    />
                                </label>
                                <span className="text-white/50 text-sm  min-w-[70px]">
                                    {hex}
                                </span>
                                <button
                                    onClick={() => removeDraftColor(idx)}
                                    disabled={draftColors.length <= 1}
                                    className="px-2 py-1 rounded-lg bg-neutral-800 border border-neutral-700 text-white/80 hover:bg-neutral-700"
                                >
                                    −
                                </button>
                            </div>
                        ))}
                    </div>
                    <div className="mt-3">
                        <button
                            onClick={addDraftColor}
                            className="px-3 py-1.5 rounded-xl bg-gray-800 hover:bg-gray-700"
                        >
                            + Add color
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={applyAndGoGame}
                        className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500"
                    >
                        Start Game
                    </button>
                    <button
                        onClick={backToMenu}
                        className="px-4 py-2 rounded-xl bg-neutral-800 border border-neutral-700 hover:bg-neutral-700"
                    >
                        Back to Menu
                    </button>
                </div>
            </div>
        </div>
    );
}

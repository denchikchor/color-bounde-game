import { useEffect, useState } from 'react';
import type { Screen } from './game/types';
import { DEFAULT_COLORS } from './game/constants';
import { useClusterEngine } from './game/useClusterEngine';
import { GameField } from './game/components/GameField';

export default function ColorClusterGame({
    defaultDotsPerColor = 3,
    defaultColors = DEFAULT_COLORS,
}: {
    defaultDotsPerColor?: number;
    defaultColors?: string[];
}) {
    const [screen, setScreen] = useState<Screen>('menu');

    const [colors, setColors] = useState<string[]>(defaultColors);
    const [dotsPerColor, setDotsPerColor] =
        useState<number>(defaultDotsPerColor);
    const [draftColors, setDraftColors] = useState<string[]>(defaultColors);
    const [draftDotsPerColor, setDraftDotsPerColor] =
        useState<number>(defaultDotsPerColor);

    const onWin = () => {
        setScreen('result');
    };

    const engine = useClusterEngine({ onWin });

    useEffect(() => {
        if (screen === 'game') {
            engine.setConfig(colors, dotsPerColor);
            engine.enterGame();
            return () => engine.exitGame();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [screen, colors, dotsPerColor]);

    // Navigation
    const goMenu = () => setScreen('menu');
    const goSettings = () => {
        setDraftColors(colors);
        setDraftDotsPerColor(dotsPerColor);
        setScreen('settings');
    };
    const startDefaultGame = () => {
        setColors(DEFAULT_COLORS);
        setDotsPerColor(defaultDotsPerColor);
        setScreen('game');
    };
    const applySettingsAndStart = () => {
        setColors(draftColors.length ? draftColors : DEFAULT_COLORS);
        setDotsPerColor(Math.max(1, draftDotsPerColor));
        setScreen('game');
    };
    const backFromSettings = () => setScreen('menu');
    const playAgain = () => setScreen('game');

    return (
        <div className="w-full max-w-5xl mx-auto p-4 text-white select-none">
            {screen === 'menu' && (
                <div className="mt-8 p-6 flex flex-col justify-center items-center min-h-[300px] rounded-2xl border border-neutral-800 bg-neutral-900">
                    <div className="text-center">
                        <h1 className="text-2xl font-semibold">
                            Color Dot Game
                        </h1>
                        <p className="text-white/60 mt-2">
                            Group the dots by color.
                        </p>
                    </div>
                    <div className="mt-6 flex flex-wrap items-center gap-3">
                        <button
                            onClick={startDefaultGame}
                            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500"
                        >
                            Start Game
                        </button>
                        <button
                            onClick={goSettings}
                            className="px-4 py-2 rounded-xl bg-neutral-800 border border-neutral-700 hover:bg-neutral-700"
                        >
                            Settings
                        </button>
                    </div>
                </div>
            )}

            {screen === 'settings' && (
                <div className="mt-8 p-6 rounded-2xl border border-neutral-800 bg-neutral-900">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold">Settings</h2>
                        <button
                            onClick={backFromSettings}
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
                                onChange={(e) => {
                                    const val = Number(e.target.value || 2);
                                    setDraftDotsPerColor(
                                        Math.min(100, Math.max(2, val))
                                    );
                                }}
                                className="block mt-1 w-28 rounded-lg bg-neutral-800 border border-neutral-700 px-2 py-1 text-white"
                            />
                        </div>

                        <div>
                            <label className="text-sm text-white/70">
                                Colors
                            </label>
                            <div className="mt-2 space-y-2">
                                {draftColors.map((hex, idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-center gap-2"
                                    >
                                        <label className="relative inline-block h-9 w-9 rounded-full overflow-hidden border border-neutral-700">
                                            <input
                                                type="color"
                                                value={hex}
                                                onChange={(e) => {
                                                    const v = e.target.value;
                                                    setDraftColors((prev) =>
                                                        prev.map((it, i) =>
                                                            i === idx ? v : it
                                                        )
                                                    );
                                                }}
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
                                            onClick={() =>
                                                setDraftColors((prev) =>
                                                    prev.filter(
                                                        (_, i) => i !== idx
                                                    )
                                                )
                                            }
                                            className="px-2 py-1 rounded-lg bg-neutral-800 border border-neutral-700 text-white/80 hover:bg-neutral-700"
                                        >
                                            −
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-3">
                                <button
                                    onClick={() =>
                                        setDraftColors((prev) => [
                                            ...prev,
                                            '#ffffff',
                                        ])
                                    }
                                    className="px-3 py-1.5 rounded-xl bg-gray-800 hover:bg-gray-700"
                                >
                                    + Add color
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={applySettingsAndStart}
                                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500"
                            >
                                Start Game
                            </button>
                            <button
                                onClick={backFromSettings}
                                className="px-4 py-2 rounded-xl bg-neutral-800 border border-neutral-700 hover:bg-neutral-700"
                            >
                                Back to Menu
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {screen === 'game' && (
                <div className="mt-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-black">
                            Game
                        </h2>
                        <button
                            onClick={goMenu}
                            className="px-3 py-1.5 rounded-xl bg-neutral-800 border border-neutral-700 hover:bg-neutral-700"
                        >
                            Main Menu
                        </button>
                    </div>

                    <GameField
                        sceneKey={engine.sceneKey}
                        fieldRef={engine.fieldRef}
                        dotElsRef={engine.dotElsRef}
                        dotsRef={engine.dotsRef}
                        paletteRef={engine.paletteRef}
                        playTimeSec={engine.playTimeSec}
                        onPointerMove={engine.onPointerMove}
                        onPointerLeave={engine.onPointerLeave}
                    />
                </div>
            )}

            {screen === 'result' && (
                <div className="mt-8 p-6 flex flex-col justify-center items-center min-h-[300px] rounded-2xl border border-neutral-800 bg-neutral-900 text-center">
                    <h2 className="text-3xl font-bold">Success!</h2>
                    <p className="text-white/70 mt-2">
                        You sorted in{' '}
                        <b className="tabular-nums">{engine.playTimeSec}s</b>
                    </p>
                    <div className="mt-6 flex items-center justify-center gap-3">
                        <button
                            onClick={playAgain}
                            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500"
                        >
                            Play Again
                        </button>
                        <button
                            onClick={goMenu}
                            className="px-4 py-2 rounded-xl bg-neutral-800 border border-neutral-700 hover:bg-neutral-700"
                        >
                            Main Menu
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

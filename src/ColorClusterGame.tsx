import { useEffect } from 'react';
import { useClusterEngine } from './game/useClusterEngine';
import Menu from './game/screens/Menu';
import Settings from './game/screens/Settings';
import Game from './game/screens/Game';
import Result from './game/screens/Result';
import { uiSelectors, useUI } from './game/store/ui';

export default function ColorClusterGame() {
    const screen = useUI(uiSelectors.screen);
    const colors = useUI(uiSelectors.colors);
    const dotsPerColor = useUI(uiSelectors.dotsPerColor);
    const setScreen = useUI(uiSelectors.setScreen);

    const engine = useClusterEngine({ onWin: () => setScreen('result') });

    useEffect(() => {
        engine.setConfig(colors, dotsPerColor);
    }, [colors, dotsPerColor]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (screen === 'game') {
            engine.enterGame();
            return () => engine.exitGame();
        }
    }, [screen]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div className="w-full max-w-5xl mx-auto p-4 text-white select-none">
            {screen === 'menu' ? (
                <Menu />
            ) : screen === 'settings' ? (
                <Settings />
            ) : screen === 'game' ? (
                <Game engine={engine} />
            ) : screen === 'result' ? (
                <Result engine={engine} />
            ) : null}
        </div>
    );
}

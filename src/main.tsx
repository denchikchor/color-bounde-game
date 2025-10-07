import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import ColorClusterGame from './ColorClusterGame';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ColorClusterGame />
    </StrictMode>
);

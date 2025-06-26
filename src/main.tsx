import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import RootRouter from './RootRouter';
import './index.css';
import { WebRTCProvider } from './components/WebRTCManager';
import { TavusProvider } from './components/TavusIntegration';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <WebRTCProvider>
      <TavusProvider>
        <RootRouter />
      </TavusProvider>
    </WebRTCProvider>
  </StrictMode>
);

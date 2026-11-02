import React from 'react';
import {createRoot} from 'react-dom/client';
import {ShopProvider} from './store.jsx';
import App from './App.jsx';
import './styles.css';

createRoot(document.getElementById('root')).render(<ShopProvider><App/></ShopProvider>);

// Service worker: app shell offline caching, and a new build activates + reloads
// once on its own so the shop never keeps staring at a stale version.
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  let controlled = Boolean(navigator.serviceWorker.controller);
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (controlled) window.location.reload();
    controlled = true;
  });
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(registration => {
      registration.update().catch(() => {});
    }).catch(() => {});
  });
}

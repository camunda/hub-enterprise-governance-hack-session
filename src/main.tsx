import { createRoot } from 'react-dom/client';
import { App } from '@/app/App';
import '@fontsource/geist-sans/400.css';
import '@fontsource/geist-sans/500.css';
import '@fontsource/geist-sans/600.css';
import '@fontsource/geist-sans/700.css';
import '@/styles/index.css';

/**
 * There is no backend. MSW intercepts every /api/* call, in every mode —
 * dev and production build alike — since a production build of this app
 * has nowhere else to send requests.
 */
async function enableMocking(): Promise<void> {
  const { worker } = await import('@/test/browser');
  await worker.start({
    onUnhandledRequest: 'bypass',
    serviceWorker: {
      url: '/mockServiceWorker.js',
    },
  });
}

const root = document.getElementById('root');
if (!root) throw new Error('Root element not found');

enableMocking().then(() => {
  createRoot(root).render(<App />);
});

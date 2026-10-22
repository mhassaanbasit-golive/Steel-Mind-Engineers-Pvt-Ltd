import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './styles/interactions.css';

if (typeof window !== 'undefined') {
  const checkTouch = () => {
    const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;
    if (isTouch) {
      document.documentElement.classList.add('is-touch');
    } else {
      document.documentElement.classList.remove('is-touch');
    }
  };
  checkTouch();
  window.addEventListener('resize', checkTouch, { passive: true });

  // Ensure no stale Service Workers or cached shells linger on client devices (especially iPhones)
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      for (const registration of registrations) {
        registration.unregister();
      }
    }).catch(() => {});
  }
}

createRoot(document.getElementById('root')!).render(<App />);

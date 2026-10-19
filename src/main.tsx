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
}

createRoot(document.getElementById('root')!).render(<App />);

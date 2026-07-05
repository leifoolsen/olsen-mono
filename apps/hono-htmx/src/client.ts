// client.ts
import './style.css';

type ExtendedWindow = Window & {
  toggleAppTheme: () => void;
  toggleAppDensity: () => void;
};

const extendedWindow = window as unknown as ExtendedWindow;

extendedWindow.toggleAppTheme = () => {
  const root = document.documentElement;
  const isDark = root.getAttribute('data-theme') === 'dark';
  root.setAttribute('data-theme', isDark ? 'light' : 'dark');
};

extendedWindow.toggleAppDensity = () => {
  const root = document.documentElement;
  const isCondensed = root.getAttribute('data-density') === 'condensed';
  root.setAttribute('data-density', isCondensed ? 'normal' : 'condensed');
};

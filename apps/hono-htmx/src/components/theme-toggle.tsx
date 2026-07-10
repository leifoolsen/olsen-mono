// components/ThemeButton.tsx
import type { FC } from 'hono/jsx';

type ThemeToggleProps = {
  currentTheme: string;
};

export const ThemeToggle: FC<ThemeToggleProps> = ({ currentTheme }) => {
  const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
  const buttonText = `Change to ${nextTheme === 'dark' ? 'dark' : 'light'} theme`;

  return (
    <>
      <button type="button" hx-post="/api/toggle-theme" hx-swap="outerHTML" data-variant="danger">
        {buttonText}
      </button>

      <body id="theme-body" data-theme={currentTheme} hx-swap-oob="true" />
    </>
  );
};

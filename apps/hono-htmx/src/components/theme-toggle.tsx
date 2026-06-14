// components/ThemeButton.tsx
import type { FC } from 'hono/jsx';

type ThemeToggleProps = {
  currentTheme: string;
};

export const ThemeToggle: FC<ThemeToggleProps> = ({ currentTheme }) => {
  const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
  const buttonText = `Bytt til ${nextTheme === 'dark' ? 'mørkt' : 'lyst'} tema`;

  return (
    <>
      {/* Knappen som erstatter seg selv */}
      <button hx-post="/api/toggle-theme" hx-swap="outerHTML" data-variant="danger">
        {buttonText}
      </button>

      {/* OOB-swap som oppdaterer body-attributtet live i bakgrunnen */}
      <body id="theme-body" data-theme={currentTheme} hx-swap-oob="true" />
    </>
  );
};

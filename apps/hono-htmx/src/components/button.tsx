import styles from './button.css?inline'; // Node godtar dette som en streng!
import type { Css } from './button.css';

function cn(...classes: Css[]): string {
  return classes.join(' ');
}

export const Button = () => {
  return (
    <div>
      {/* Vites ferdigkompilerte CSS dyttes rett inn i en inline style-tag */}
      <style dangerouslySetInnerHTML={{ __html: styles }} />

      <button
        class={cn('myButton', 'myButton_test')}
        hx-get="/api/fragment"
        hx-target="#fragment-target"
        hx-swap="innerHTML"
      >
        Hent magisk innhold
      </button>
    </div>
  );
};

/*
import styles from './button.css?inline';
import type { Css, CssVariables } from './button.css';
// Du kan også importere globale variabler fra tema-filen din!
import type { CssVariables as GlobalVars } from '../../styles/theme.css';

interface ButtonProps {
  color?: 'red' | 'blue';
}

export const Button = ({ color = 'red' }: ButtonProps) => {
  // Sørger for at du kun kan sette gyldige variabler definert i CSS-filen (eller globale)
  const buttonStyle: Record<CssVariables | GlobalVars, string> = {
    '--btn-color': color, // TypeScript godtar denne fordi den finnes i button.css
    '--global-margin': '12px' // TypeScript godtar denne om den finnes i theme.css
  };

  return (
    <div>
      <style dangerouslySetInnerHTML={{ __html: styles }} />

      <button
        class="myButton"
        style={buttonStyle}
        hx-get="/api/fragment"
      >
        Hent magisk innhold
      </button>
    </div>
  );
};
 */

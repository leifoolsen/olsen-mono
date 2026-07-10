import type { Css } from './button.css';
import styles from './button.css?inline'; // Node godtar dette som en streng!

function cn(...classes: Css[]): string {
  return classes.join(' ');
}

export const Button = () => {
  return (
    <div>
      <style dangerouslySetInnerHTML={{ __html: styles }} />

      <button
        type="button"
        class={cn('myButton')}
        hx-get="/api/fragment"
        hx-target="#fragment-target"
        hx-swap="innerHTML"
      >
        Server info
      </button>
    </div>
  );
};

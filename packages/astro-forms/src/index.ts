import type { HTMLElement } from 'happy-dom';
import type { ListboxChangeEventDetail } from './types';

export * from './types.ts';

declare global {
  interface HTMLElementTagNameMap {
    'ui-listbox': HTMLElement;
  }

  interface HTMLElementEventMap {
    'listbox-change': CustomEvent<ListboxChangeEventDetail>;
  }
}

import type { ComboboxChangeEventDetail, ListboxChangeEventDetail } from './types.ts';

export type { ComboboxChangeEventDetail, ListboxChangeEventDetail, ListboxItem } from './types.ts';

declare global {
  interface HTMLElementTagNameMap {
    'ui-listbox': HTMLElement;
    'ui-combobox': HTMLElement;
  }

  interface HTMLElementEventMap {
    'listbox-change': CustomEvent<ListboxChangeEventDetail>;
    'combobox-change': CustomEvent<ComboboxChangeEventDetail>;
  }
}

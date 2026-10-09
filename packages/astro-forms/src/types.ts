// astro-forms/src/types.ts

import type { DebouncedFunction } from '@olsen-mono/core-utils';

export type ListboxItem = {
  id: string;
  name: string;
  value: string;
  text: string;
};

export type ListboxChangeEventDetail = ListboxItem | ListboxItem[] | null;

export type ComboboxChangeEventDetail = ListboxChangeEventDetail;

export type ListboxApi = {
  selectAll: () => void;
  deselectAll: () => void;
  filter: (query: string) => void;
  filterDebounced: DebouncedFunction<(query: string) => void>;
};

export type ListboxReadyDetail = {
  id: string;
  isMultiSelectable: boolean;
  api: ListboxApi;
};

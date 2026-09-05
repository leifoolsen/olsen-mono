// src/components/form-element/types.ts

export type ListboxItem = {
  id: string;
  name: string;
  value: string;
  text: string;
};

export type ListboxChangeEventDetail = ListboxItem | ListboxItem[] | null;
export type ComboboxChangeEventDetail = ListboxChangeEventDetail & {};

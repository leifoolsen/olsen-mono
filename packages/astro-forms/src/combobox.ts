// packages/astro-forms/src/combobox.ts
import { match } from '@olsen-mono/core-utils';
import type { ListboxElement } from './listbox.ts';
import type { ComboboxChangeEventDetail, ListboxChangeEventDetail } from './types.ts';

export function createCombobox(input: HTMLInputElement) {
  const comboboxGroup = input.closest('[data-combobox]');
  const popover = comboboxGroup?.querySelector('[data-combobox-popover]');
  const listbox = comboboxGroup?.querySelector<ListboxElement>('[data-combobox-listbox]');

  if (
    !(comboboxGroup instanceof HTMLDivElement) ||
    !(popover instanceof HTMLDivElement) ||
    !(listbox instanceof HTMLDivElement)
  ) {
    match<boolean, void>()
      .on(!comboboxGroup, () => {
        console.warn(`[Combobox] Could not find data-combobox element for #${input.id}`);
      })
      .on(!popover, () => {
        console.warn(`[Combobox] Could not find data-combobox-popover element for #${input.id}`);
      })
      .on(!listbox, () => {
        console.warn(`[Combobox] Could not find data-combobox-listbox element for #${input.id}`);
      });

    return;
  }

  const isMultiSelectable = listbox.getAttribute('aria-multiselectable') === 'true';

  const openPopover = () => {
    popover.showPopover();
    input.setAttribute('aria-expanded', 'true');
  };

  const closePopover = () => {
    popover.hidePopover();
    input.setAttribute('aria-expanded', 'false');
    input.focus();
  };

  const syncInputValue = () => {
    const selectedOptions = Array.from(listbox.querySelectorAll('[role="option"][aria-selected="true"]'));

    const data = selectedOptions.map((opt) => ({
      id: opt.id,
      name: opt.getAttribute('data-name') ?? '',
      value: opt.getAttribute('data-value') ?? '',
      text: opt instanceof HTMLElement ? opt.innerText : '',
    }));

    if (isMultiSelectable) {
      input.value = data.map((item) => item.text).join(', ');
      input.setAttribute('data-value', data.map((item) => item.value).join(', '));
    } else if (data[0]) {
      input.value = data[0].text;
      input.setAttribute('data-value', data[0].value);
    } else {
      input.value = '';
      input.setAttribute('data-value', '');
    }
  };

  const setupIcons = () => {
    const searchIcon = comboboxGroup.querySelector('.form-search-icon');
    const pickerIcon = comboboxGroup.querySelector('.form-picker-icon');
    const clearIcon = comboboxGroup.querySelector('.form-clear-icon');
    const infoIcon = comboboxGroup.querySelector('.info-icon');

    searchIcon?.addEventListener('click', () => {
      input.focus();
      input.click();
    });

    pickerIcon?.addEventListener('click', () => {
      input.focus();
      input.click();
    });

    clearIcon?.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      input.value = '';
      input.setAttribute('data-value', '');

      listbox.deselectAll();
      listbox.filter('');

      input.focus();
    });

    infoIcon?.addEventListener('click', () => {
      if (!input.disabled) {
        input.focus();
      }
    });
  };

  const setupEventListeners = () => {
    listbox.addEventListener('keydown', (e: KeyboardEvent) => {
      match(e)
        .on(
          (e) => e.key === 'Escape',
          () => {
            e.preventDefault();
            closePopover();
          },
        )
        .on(
          (e) => e.key === ' ' || e.key === 'Enter',
          () => {
            e.preventDefault();
            if (!isMultiSelectable) {
              closePopover();
            }
          },
        );
    });

    listbox.addEventListener('blur', () => {
      listbox.filterDebounced.flush();
      closePopover();
    });

    listbox.addEventListener('click', () => {
      if (!isMultiSelectable) {
        closePopover();
      }
    });

    listbox.addEventListener('listbox-change', (e: Event) => {
      e.stopPropagation();
      const customEvent = e as CustomEvent<ListboxChangeEventDetail>;
      const data = customEvent.detail;

      if (Array.isArray(data)) {
        input.value = data.map((item) => item.text).join(', ');
        input.setAttribute('data-value', data.map((item) => item.value).join(', '));
      } else if (data) {
        input.value = data.text;
        input.setAttribute('data-value', data.value);
      } else {
        input.value = '';
        input.setAttribute('data-value', '');
      }

      input.dispatchEvent(
        new CustomEvent('combobox-change', {
          bubbles: true,
          detail: data,
        }),
      );

      if (!isMultiSelectable && data) {
        closePopover();
      }
    });

    input.addEventListener('blur', () => {
      listbox.filterDebounced.flush();
    });

    input.addEventListener('click', () => {
      if (input.getAttribute('aria-expanded') !== 'true') {
        openPopover();
      } else {
        closePopover();
      }
    });

    input.addEventListener('input', () => {
      openPopover();

      if (input.value.trim() === '') {
        listbox.filterDebounced.cancel();
        listbox.filter('');
      } else {
        listbox.filterDebounced(input.value);
      }
    });

    input.addEventListener('keydown', (e: KeyboardEvent) => {
      match(e)
        .on(
          (e) => e.key === 'ArrowDown' || e.key === 'ArrowUp',
          (e) => {
            e.preventDefault();
            openPopover();
            listbox.focus();
          },
        )
        .on(
          (e) => e.key === 'Escape',
          () => {
            e.preventDefault();
            closePopover();
          },
        )
        .on(
          (e) => e.key === 'Tab',
          () => {
            closePopover();
          },
        );
    });
  };

  setupIcons();
  setupEventListeners();
  syncInputValue();

  Object.assign(input, {
    openPopover,
    closePopover,
    syncInputValue,
  });

  return {
    openPopover,
    closePopover,
    syncInputValue,
  };
}

export type ComboboxElement = HTMLInputElement &
  ReturnType<typeof createCombobox> & {
    addEventListener(
      type: 'combobox-change',
      listener: (this: ComboboxElement, ev: CustomEvent<ComboboxChangeEventDetail>) => void,
      options?: boolean | AddEventListenerOptions,
    ): void;

    addEventListener<K extends keyof HTMLElementEventMap>(
      type: K,
      listener: (this: HTMLInputElement, ev: HTMLElementEventMap[K]) => void,
      options?: boolean | AddEventListenerOptions,
    ): void;

    addEventListener(
      type: string,
      listener: EventListenerOrEventListenerObject,
      options?: boolean | AddEventListenerOptions,
    ): void;
  };

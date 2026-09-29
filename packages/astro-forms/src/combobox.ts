// packages/astro-forms/src/combobox.ts
import { match } from '@olsen-mono/core-utils';
import type { ComboboxChangeEventDetail, ListboxApi, ListboxChangeEventDetail, ListboxReadyDetail } from './types';

export function createCombobox(input: HTMLInputElement) {
  const comboboxGroup = input.closest('[data-combobox]');
  const popover = comboboxGroup?.querySelector('[data-combobox-popover]');
  const listbox = comboboxGroup?.querySelector('[role="listbox"]');
  let listboxApi: ListboxApi | null = null;
  let isMultiSelectable = false;

  if (
    !(comboboxGroup instanceof HTMLDivElement) ||
    !(popover instanceof HTMLDivElement) ||
    !(listbox instanceof HTMLDivElement)
  ) {
    match<boolean, void>()
      .on(!(comboboxGroup instanceof HTMLDivElement), () => {
        console.warn(`[Combobox] Could not find combobox element for #${input.id}`);
      })
      .on(!(popover instanceof HTMLDivElement), () => {
        console.warn(`[Combobox] Could not find popover element for #${input.id}`);
      })
      .on(!(listbox instanceof HTMLDivElement), () => {
        console.warn(`[Combobox] Could not find listbox element for #${input.id}`);
      });

    return;
  }

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

      listboxApi?.deselectAll();
      listboxApi?.filter('');

      input.focus();
    });

    infoIcon?.addEventListener('click', () => {
      if (!input.disabled) {
        input.focus();
      }
    });
  };

  const setupEventListeners = () => {
    input.addEventListener('blur', () => {
      listboxApi?.filterDebounced.flush();
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
        listboxApi?.filterDebounced.cancel();
        listboxApi?.filter('');
      } else {
        listboxApi?.filterDebounced(input.value);
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
    const selectedOptions = Array.from(
      popover.querySelectorAll('[role="listbox"] [role="option"][aria-selected="true"]'),
    );

    const data = selectedOptions.map((opt) => ({
      id: opt.id,
      name: opt.getAttribute('data-name') ?? '',
      value: opt.getAttribute('data-value') ?? '',
      text: opt instanceof HTMLElement ? opt.innerText.trim() : '',
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

  const registerListbox = ({ isMultiSelectable: isMulti, api }: ListboxReadyDetail) => {
    listboxApi = api;
    isMultiSelectable = isMulti;
    input.setAttribute('aria-multiselectable', isMultiSelectable ? 'true' : 'false');

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
      api.filterDebounced.flush();
      closePopover();
    });

    listbox.addEventListener('click', () => {
      if (!isMultiSelectable) {
        closePopover();
      }
    });

    listbox.addEventListener('ui:listbox-change', (e: Event) => {
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
        new CustomEvent('ui:combobox-change', {
          bubbles: true,
          detail: data,
        }),
      );

      if (!isMultiSelectable && data) {
        closePopover();
      }
    });

    syncInputValue();
  };

  comboboxGroup.addEventListener('ui:listbox-ready', (e: Event) => {
    const customEvent = e as CustomEvent<ListboxReadyDetail>;
    registerListbox(customEvent.detail);
  });

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
      type: 'ui:combobox-change',
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

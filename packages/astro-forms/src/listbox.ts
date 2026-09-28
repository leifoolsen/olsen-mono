import { debounce, match } from '@olsen-mono/core-utils';
import type { ListboxChangeEventDetail, ListboxItem } from './types';

export function createListbox(element: HTMLElement) {
  let lastSelectedIndex = -1;
  const isMultiSelectable = element.getAttribute('aria-multiselectable') === 'true';

  const getSelectableOptions = (): HTMLElement[] => {
    return Array.from(element.querySelectorAll('[role="option"]:not([aria-disabled="true"]):not([hidden])'));
  };

  const emitChange = () => {
    const allOptions = Array.from(element.querySelectorAll('[role="option"]'));
    const selectedOptions = allOptions.filter((opt) => opt.getAttribute('aria-selected') === 'true');

    const data: ListboxItem[] = selectedOptions.map((opt) => ({
      id: opt.id,
      name: opt.getAttribute('data-name') ?? '',
      value: opt.getAttribute('data-value') ?? '',
      text: opt instanceof HTMLElement ? opt.innerText : '',
    }));

    element.dispatchEvent(
      new CustomEvent('listbox-change', {
        bubbles: true,
        detail: isMultiSelectable ? data : data[0] || null,
      }),
    );
  };

  const toggleSelect = (target: HTMLElement) => {
    const isSelected = target.getAttribute('aria-selected') === 'true';
    target.setAttribute('aria-selected', isSelected ? 'false' : 'true');
    emitChange();
  };

  const selectRange = (targetIndex: number) => {
    if (!isMultiSelectable || lastSelectedIndex === -1) return;

    const options = getSelectableOptions();
    const start = Math.min(lastSelectedIndex, targetIndex);
    const end = Math.max(lastSelectedIndex, targetIndex);

    for (let i = start; i <= end; i++) {
      options[i]?.setAttribute('aria-selected', 'true');
    }
    emitChange();
  };

  const setActive = (target: HTMLElement | null) => {
    if (!target) return;

    const options = getSelectableOptions();
    lastSelectedIndex = options.indexOf(target);

    element.setAttribute('aria-activedescendant', target.id);
    element.querySelector('.is-active')?.classList.remove('is-active');
    target.classList.add('is-active');

    if (!isMultiSelectable) {
      for (const opt of element.querySelectorAll('[role="option"]')) {
        opt.setAttribute('aria-selected', 'false');
      }
      target.setAttribute('aria-selected', 'true');
      emitChange();
    }
  };

  const setActive2 = (target: HTMLElement | null) => {
    if (!target) return;

    const options = getSelectableOptions();
    lastSelectedIndex = options.indexOf(target);

    element.setAttribute('aria-activedescendant', target.id);
    element.querySelector('.is-active')?.classList.remove('is-active');
    target.classList.add('is-active');
    target.scrollIntoView({ block: 'nearest', behavior: 'auto' });
  };

  const handleBlur = () => {
    element.querySelector('.is-active')?.classList.remove('is-active');
  };

  const handleFocus = () => {
    const options = getSelectableOptions();
    if (options.length === 0) return;

    const isNavigatingWithKeyboard = element.matches(':focus-visible');
    const alreadySelected = element.querySelector('[role="option"][aria-selected="true"]');

    if (alreadySelected instanceof HTMLElement) {
      if (isNavigatingWithKeyboard) {
        setActive2(alreadySelected);
      } else {
        lastSelectedIndex = options.indexOf(alreadySelected);
        element.querySelector('.is-active')?.classList.remove('is-active');
        element.setAttribute('aria-activedescendant', alreadySelected.id);
        alreadySelected.classList.add('is-active');
      }
    } else {
      if (isNavigatingWithKeyboard) {
        setActive2(options[0] ?? null);
      } else {
        lastSelectedIndex = 0;
        element.querySelector('.is-active')?.classList.remove('is-active');

        if (options[0]) {
          element.setAttribute('aria-activedescendant', options[0].id);
          options[0].classList.add('is-active');
        }
      }
    }
  };

  const handleClick = (e: MouseEvent) => {
    const target = (e.target as HTMLElement).closest('[role="option"]');
    if (!(target instanceof HTMLElement) || target.hasAttribute('disabled') || target.hidden) return;

    const options = getSelectableOptions();
    const targetIndex = options.indexOf(target);

    match<boolean, void>()
      .on(isMultiSelectable && e.shiftKey && lastSelectedIndex !== -1, () => {
        e.preventDefault();
        selectRange(targetIndex);
        setActive(target);
      })
      .on(isMultiSelectable, () => {
        e.preventDefault();
        setActive(target);
        toggleSelect(target);
      })
      .otherwise(() => setActive(target));
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    const options = getSelectableOptions();
    if (options.length === 0) return;

    match<KeyboardEvent, void>(e)
      .on(
        (e) => isMultiSelectable && (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'a',
        (e) => {
          e.preventDefault();
          const allSelected = options.every((opt) => opt.getAttribute('aria-selected') === 'true');

          for (const opt of options) {
            opt.setAttribute('aria-selected', allSelected ? 'false' : 'true');
          }
          emitChange();
        },
      )
      .otherwise((e) => {
        const activeId = element.getAttribute('aria-activedescendant');
        const activeEl = activeId ? document.getElementById(activeId) : null;
        const currentIndex = activeEl ? options.indexOf(activeEl) : -1;

        const nextTarget = match<KeyboardEvent, HTMLElement | null>(e)
          .on(
            (e) => isMultiSelectable && e.shiftKey && (e.key === 'ArrowDown' || e.key === 'ArrowUp'),
            (e) => {
              e.preventDefault();
              const nextIndex =
                e.key === 'ArrowDown' ? Math.min(currentIndex + 1, options.length - 1) : Math.max(currentIndex - 1, 0);

              const nextEl = options[nextIndex];
              if (nextEl) {
                setActive(nextEl);
                selectRange(nextIndex);
              }
              return null;
            },
          )
          .on(
            (e) => e.key === 'ArrowDown',
            (e) => {
              e.preventDefault();
              e.stopPropagation();
              return options[(currentIndex + 1) % options.length] ?? null;
            },
          )
          .on(
            (e) => e.key === 'ArrowUp',
            (e) => {
              e.preventDefault();
              e.stopPropagation();
              const len = options.length;
              return options[(currentIndex - 1 + len) % len] ?? null;
            },
          )
          .on(
            (e) => e.key === 'Home',
            (e) => {
              e.preventDefault();
              return options[0] ?? null;
            },
          )
          .on(
            (e) => e.key === 'End',
            (e) => {
              e.preventDefault();
              return options[options.length - 1] ?? null;
            },
          )
          .on(
            (e) => e.key === ' ' || e.key === 'Enter',
            (e) => {
              e.preventDefault();
              if (activeEl && isMultiSelectable) {
                toggleSelect(activeEl);
              } else if (activeEl) {
                setActive(activeEl);
              }
              return null;
            },
          )
          .on(
            (e) => e.key.length === 1,
            (e) => {
              const re = new RegExp(`^${e.key}`, 'i');
              const target =
                options.slice(currentIndex + 1).find((opt) => opt.innerText?.match(re)) ??
                options.slice(0, currentIndex).find((opt) => opt.innerText?.match(re));

              return target ?? null;
            },
          )
          .otherwise(() => null);

        if (nextTarget) {
          setActive2(nextTarget);
        }
      });
  };

  const filter = (query: string) => {
    const cleanQuery = query.toLowerCase().trim();
    const options = Array.from(element.querySelectorAll('[role="option"]'));
    const groups = Array.from(element.querySelectorAll('[role="group"]'));

    if (cleanQuery === '') {
      for (const opt of options) {
        if (!(opt instanceof HTMLElement)) continue;
        opt.hidden = false;
        opt.setAttribute('aria-selected', 'false');
      }
    } else {
      for (const opt of options) {
        if (!(opt instanceof HTMLElement)) continue;
        const value = (opt.getAttribute('data-value') ?? '').toLowerCase();
        const text = (opt.innerText ?? '').toLowerCase();
        opt.hidden = !(value.includes(cleanQuery) || text.includes(cleanQuery));
        if (opt.hidden) opt.setAttribute('aria-selected', 'false');
      }
    }

    for (const group of groups) {
      if (!(group instanceof HTMLElement)) continue;
      const visibleOptions = group.querySelectorAll('[role="option"]:not([hidden])');
      group.hidden = visibleOptions.length < 1;
    }
    element.removeAttribute('aria-activedescendant');
  };

  const selectAll = () => {
    if (!isMultiSelectable) return;
    const options = getSelectableOptions();
    for (const opt of options) {
      opt.setAttribute('aria-selected', 'true');
    }
    emitChange();
  };

  const deselectAll = () => {
    const options = getSelectableOptions();
    for (const opt of options) {
      opt.setAttribute('aria-selected', 'false');
    }
    emitChange();
  };

  const filterDebounced = debounce((query: string) => {
    filter(query);
  }, 250);

  const alreadySelected = element.querySelector('[role="option"][aria-selected="true"]');

  if (alreadySelected instanceof HTMLElement) {
    const options = getSelectableOptions();
    lastSelectedIndex = options.indexOf(alreadySelected);
    element.setAttribute('aria-activedescendant', alreadySelected.id);
    alreadySelected.classList.add('is-active');
  }

  element.addEventListener('focus', handleFocus);
  element.addEventListener('blur', handleBlur);
  element.addEventListener('keydown', handleKeyDown);
  element.addEventListener('click', handleClick);

  Object.assign(element, {
    selectAll,
    deselectAll,
    filter,
    filterDebounced,
  });

  const api = {
    selectAll,
    deselectAll,
    filter,
    filterDebounced,
  };

  setTimeout(
    () =>
      element.dispatchEvent(
        new CustomEvent('listbox-ready', {
          bubbles: true,
          composed: true,
          detail: {
            id: element.id,
            isMultiSelectable: isMultiSelectable,
            api,
          },
        }),
      ),
    0,
  );

  return api;
}

export type ListboxElement = HTMLDivElement &
  ReturnType<typeof createListbox> & {
    addEventListener(
      type: 'listbox-change',
      listener: (this: ListboxElement, ev: CustomEvent<ListboxChangeEventDetail>) => void,
      options?: boolean | AddEventListenerOptions,
    ): void;

    addEventListener(
      type: 'listbox-ready',
      listener: (
        this: ListboxElement,
        ev: CustomEvent<{ id: string; isMultiSelectable: boolean; api: ReturnType<typeof createListbox> }>,
      ) => void,
      options?: boolean | AddEventListenerOptions,
    ): void;

    addEventListener<K extends keyof HTMLElementEventMap>(
      type: K,
      listener: (this: HTMLDivElement, ev: HTMLElementEventMap[K]) => void,
      options?: boolean | AddEventListenerOptions,
    ): void;

    addEventListener(
      type: string,
      listener: EventListenerOrEventListenerObject,
      options?: boolean | AddEventListenerOptions,
    ): void;
  };

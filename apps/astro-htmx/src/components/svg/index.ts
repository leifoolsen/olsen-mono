import { createIconSystem } from '@olsen-mono/astro-icon';

export const svgMapping = {
  asterisk: {
    file: 'asterisk',
    scale: 1.3,
  },
  'chevron-forward': {
    file: 'chevron-forward',
    scale: 1.3,
  },
  close: {
    file: 'close',
    scale: 1.3,
  },
  'close-small': {
    file: 'close-small',
    scale: 1.3,
  },
  home: {
    file: 'home',
    scale: 1.3,
  },
  info: {
    file: 'info',
    scale: 1.3,
  },
  menu: {
    file: 'menu',
    scale: 1.3,
  },
  search: {
    file: 'search',
    scale: 1.3,
  },
  warning: {
    file: 'warning',
    scale: 1.3,
  },
} as const;

const appIcons = import.meta.glob('./raw/*.svg', { query: '?raw', eager: true });

export const { getIconMask, getSvgData } = createIconSystem(svgMapping, appIcons);
export type SvgName = keyof typeof svgMapping;

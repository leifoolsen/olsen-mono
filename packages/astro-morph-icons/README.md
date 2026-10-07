# MorphLinesIcon

A MorphLinesIcon is a custom Astro component that animates SVG line segments from one shape to another. It's designed to be used
with a button or toggle and can be customized with various properties to control the animation. It is a highly
performant, accessible, and mathematically sound SVG **micro-interaction icon component** built exclusively for **Astro**.

`MorphLinesIcon` enables seamless, staggered, and organic line-shifting animations between any two geometric shapes defined
by discrete straight coordinates on a standard `24x24` grid.

## Key Features

- 📐 **Strict Geometric Morphing:** Dynamically recalculates translation vectors, scaling, and rotational displacement on the server side using raw line coordinates.
- 🌊 **Staggered Orchestration:** Features configurable individual line delays via native CSS custom properties for elastic, wave-like transition sequences.
- 🎯 **Intelligent Distance Matching:** Built-in nearest-neighbor algorithm pairs line segments based on spatial proximity so lines travel the absolute shortest visual path.
- 📱 **Mobile & Touch Guarded:** Leverages strict `@media (hover: hover)` styling rules to eliminate sticky hover states on touch screens (iOS & Android).
- 🌐 **Fully Semantic & Theme Aware:** Uses `stroke="currentColor"` for dynamic cascade color inheritance and correctly manages mapping for `aria-checked` and `aria-disabled` attributes.
- 🧬 **Airy Token Modifier:** Optional programmatic scaling vector adjusts the negative inner space of the icon without requiring multiple asset coordinate sets.

---

## Installation

Within your monorepo, import the component and types into your target Astro workspace:

```tsx
import { MorphLinesIcon } from '@olsen-mono/astro-morph-icons';
import type { LineSegment } from '@olsen-mono/astro-morph-icons/types';
```

---

## Component Properties (API)

The component fully extends `HTMLAttributes<'svg'>`. Custom properties are documented below:

| Property    | Type               | Default    | Description                                                                                                                                          |
| :---------- | :----------------- | :--------- | :--------------------------------------------------------------------------------------------------------------------------------------------------- |
| `fromLines` | `LineSegment[]`    | _Required_ | Array of line segments representing the starting visual shape (`x1`, `y1`, `x2`, `y2`).                                                              |
| `toLines`   | `LineSegment[]`    | _Required_ | Array of line segments representing the target active visual shape.                                                                                  |
| `active`    | `boolean`          | `false`    | Sets the layout state. `true` morphs elements into `toLines`; `false` resets to `fromLines`. Maps directly to `aria-checked`.                        |
| `airy`      | `boolean`          | `false`    | Programmatically scales down both line sets by a factor of `0.75` for a more minimalist, spacious look.                                              |
| `hover`     | `boolean`          | `false`    | Enables temporary morph tracking directly via mouse pointer enter/leave triggers on desktop browsers.                                                |
| `rotate`    | `string`           | `'0deg'`   | Set structural container SVG canvas rotation when activated (e.g., `'90deg'`, `'180deg'`).                                                           |
| `size`      | `number \| string` | `'1em'`    | Dimensions applied to both `width` and `height`. Numeric values automatically append an `em` unit.                                                   |
| `duration`  | `string`           | `'0.2s'`   | Sets the timeline duration value for the CSS cubic-bezier vector transition.                                                                         |
| `stagger`   | `string`           | `'0.04s'`  | The sequential delay interval multiplier applied natively across matching line indexes so they don't animate atexactly the same time. Default 0.04s. |
| `disabled`  | `boolean`          | `false`    | Disables interactive pointer feedback and freezes structural transitions. Maps to `aria-disabled`.                                                   |

---

## Usage Examples

### 1. Classical Animated Hamburger Menu Button Example

Perfect for toggle buttons requiring a fluid rotation coupled with a line structure shift.

```astro
---
import { MorphLinesIcon } from '@packages/astro-icons';

// Data definitions mapped to standard 24x24 canvas
const tripleLines = [
  { x1: 4, y1: 6, x2: 20, y2: 6 },
  { x1: 4, y1: 12, x2: 20, y2: 12 },
  { x1: 4, y1: 18, x2: 20, y2: 18 },
];

const xLines = [
  { x1: 5, y1: 5, x2: 19, y2: 19 },
  { x1: 12, y1: 12, x2: 12, y2: 12 }, // Middle line safely collapses into its zero-length center
  { x1: 5, y1: 19, x2: 19, y2: 5 },
];

const isMenuOpen = true; // Controlled via state management
---

<button class="nav-toggle" aria-expanded={isMenuOpen}>
  <MorphLinesIcon fromLines={tripleLines} toLines={xLines} active={isMenuOpen} rotate="180deg" stagger="0.03s" />
</button>

<style>
  .nav-toggle {
    background: none;
    border: none;
    padding: 0.5rem;
    cursor: pointer;
    transition: transform 0.1s ease;
    color: var(--color-text);
  }
  /* Best Practice: Container controls tactical scaling and press physics */
  .nav-toggle:active:not(:disabled) {
    transform: scale(0.92);
  }
</style>
```

### 2. Micro-Interaction Hover Search Example

Fades and transforms a search magnifying glass into an action close (`X`) indicator natively on hover.

```astro
---
import { MorphLinesIcon } from '@packages/astro-icons';
import { searchLines, xLines } from '../data/icon-library';
---

<div class="search-wrapper">
  <input type="text" placeholder="Search system..." />
  <MorphLinesIcon fromLines={searchLines} toLines={xLines} hover={true} airy={true} size="1.25em" />
</div>
```

---

## Architecture and Edge-Case Safety

1. **Zero-Length Segment Management (`12,12`):** When morphing arrays with mismatched lengths, missing items are automatically safely initialized as `12,12,12,12` data nodes. The compiler handles padding adjustment to prevent structural NaN rendering exceptions or multi-thousand-factor CSS `scale()` blowouts.
2. **Dynamic Vector Uniformity:** Built using `vector-effect="non-scaling-stroke"`. This ensures the icon lines strictly maintain their uniform `2px` stroke weight regardless of structural scaling transformations, preserving pristine visual coherence across your entire design layout.

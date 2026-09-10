---
'@olsen-mono/core-utils': patch
'@olsen-mono/css-foundation': patch
'@olsen-mono/css-to-dts': patch
'@olsen-mono/object-builder': patch
'@olsen-mono/reactive-state': patch
'@olsen-mono/tooling': patch
'astro-htmx': patch
---

Modified package export i all packages for improved JIT/no-build. Improved generated typing of CSS. Introduced --camelCase and --watch flag. Added script to watch changes in CSS files. Normalized eol by adding .gitattributes file. Replaced copyfiles with shx. Improved dry-run.

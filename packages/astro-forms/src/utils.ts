// packages/core-utils/src/inject-for-attribute.ts
/**
 * Injects a `for` attribute into <label> tags that don't already have one.
 * Useful for auto-wiring labels to form inputs in Astro components.
 *
 * @param html - The HTML string to process
 * @param forId - The ID value to inject into the `for` attribute
 * @returns The modified HTML string with `for` attributes injected
 *
 * @example
 * const html = '<label>Email</label>';
 * const result = injectForAttribute(html, 'email-input');
 * // Result: '<label for="email-input">Email</label>'
 */
export function injectForAttribute(html: string, forId: string): string {
  // Regex finds <label> tags without an existing `for` attribute
  // (?<!for=["'][^"']*["']) is a negative lookbehind to skip labels that already have `for`
  return html.replace(
    /<label\b(?![^>]*\sfor\s*=)([^>]*)>/gi,
    (_, attributes: string) => `<label for="${forId}"${attributes}>`,
  );
}

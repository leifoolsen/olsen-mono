/**
 * A TypeScript utility type that extracts placeholders wrapped in double curly braces
 * from a given string type. This can be useful for parsing and identifying dynamic
 * placeholders from template strings.
 *
 * @template T The string type from which placeholders are to be extracted.
 *
 * The type works recursively on the input string type `T`. If a placeholder is detected
 * (i.e., a value enclosed in `{{` and `}}`), it attempts to extract it. If the extracted
 * placeholder contains mismatched braces, the utility skips over the current match and
 * continues parsing the rest of the string. This ensures robust handling of malformed
 * placeholders while extracting valid ones.
 *
 * @typeParam {T} The input string type to process and extract placeholders from.
 *
 * @return {string|never} A union of all extracted placeholder names if found, or `never`
 * if no placeholders are present.
 *
 * @example
 * // For a template string `"{{username}} logged in at {{timestamp}}"`, the ExtractPlaceholders
 * // type will resolve to `"username" | "timestamp"`.
 *
 * @note The placeholders are expected to be inside double curly braces `{{}}`.
 */
type ExtractPlaceholders<T extends string> = T extends `${string}{{${infer Placeholder}}}${infer Rest}`
  ? Placeholder extends `${string}{${string}` | `${string}}${string}`
    ? ExtractPlaceholders<Rest>
    : Placeholder | ExtractPlaceholders<Rest>
  : never;

/**
 * A type representing the configuration for a safe regular expression.
 * The `SafeRegexConfig` ensures that placeholders in the pattern are accounted for in the configuration,
 * if they exist.
 *
 * @template P - The string pattern for the regular expression.
 *
 * This type is conditional:
 * - If the `P` pattern does not contain any placeholders, the `terms` property is not used.
 * - If the `P` pattern contains placeholders, the `terms` property must provide corresponding values for all
 *              extracted placeholders as a `Record` object.
 *
 * Properties:
 * - `pattern`: The string pattern representing the regular expression.
 * - `flags`: Optional regex flags (e.g., "g", "i", "m").
 * - `terms`: A `Record` of placeholder names to their replacement values, required if the pattern
 *            contains placeholders.
 */
type SafeRegexConfig<P extends string> =
  ExtractPlaceholders<P> extends never
    ? {
        pattern: P;
        flags?: string;
        terms?: never;
      }
    : {
        pattern: P;
        flags?: string;
        terms: Record<ExtractPlaceholders<P>, string | number>;
      };

/**
 * Validates the format and compatibility of regular expression flags.
 *
 * @param {string} [flags] - The string containing regular expression flags to validate.
 * If no flags are provided, the function returns without performing any checks.
 *
 * @throws {SyntaxError} Throws an error if any of the following conditions are met:
 * - The flags contain characters other than 'g', 'i', 'm', 's', 'u', 'y', or 'v'.
 * - The flags contain duplicate entries.
 * - The flags contain both 'u' and 'v', which are incompatible.
 */
const validateRegexFlags = (flags?: string): void => {
  if (!flags) {
    return;
  }

  const hasOnlyAllowedFlags = /^[gimsuyv]+$/.test(flags);
  const hasUniqueFlags = new Set(flags).size === flags.length;
  const hasIncompatibleFlags = flags.includes('u') && flags.includes('v');

  if (!hasOnlyAllowedFlags || !hasUniqueFlags || hasIncompatibleFlags) {
    throw new SyntaxError(`Invalid regular expression flags: "${flags}"`);
  }
};

/**
 * Creates a safe regular expression by interpolating a provided pattern with dynamic terms.
 *
 * The function ensures that the terms provided are safely escaped to prevent unintended regular
 * expression behavior. If any placeholders remain unprocessed in the resulting pattern or if
 * invalid flags are provided, an error is thrown.
 *
 * @template P - The type of the pattern string.
 * @param {SafeRegexConfig<P>} config - The configuration object for generating the regular expression.
 * @param {P} config.pattern - The base pattern for the regular expression, which can contain placeholders
 *        in the format {{key}}.
 * @param {Object.<string, string | number>} [config.terms] - An optional object containing key-value pairs
 *        where keys correspond to placeholders in the pattern and values provide the replacement text.
 *        All values will be safely escaped.
 * @param {string} [config.flags] - Optional regex flags, such as 'g', 'i', or 'm', to modify the behavior
 *        of the regular expression.
 * @throws {SyntaxError} Throws if the provided `flags` are invalid.
 * @throws {Error} Throws an error if placeholders in the pattern are not completely replaced or if the
 *         resulting regex flags are invalid.
 * @returns {RegExp} A regular expression constructed from the interpolated and safely escaped pattern.
 */
export const createSafeRegex = <P extends string>(config: SafeRegexConfig<P>): RegExp => {
  validateRegexFlags(config.flags);

  const escapeRegExp = (str: string) => str.replace(/[.*+?^${}()|[\]\\-]/g, '\\$&');
  const terms = config.terms || {};

  const finalPattern = Object.entries(terms).reduce<string>((currentPattern, [key, value]) => {
    const safeValue = escapeRegExp(String(value));
    return currentPattern.replaceAll(`{{${key}}}`, () => safeValue);
  }, config.pattern);

  if (/\{\{[^}]*\}\}/.test(finalPattern)) {
    throw new Error(`Could not create regex. Some placeholders were not replaced: "${finalPattern}"`);
  }

  return new RegExp(finalPattern, config.flags || '');
};

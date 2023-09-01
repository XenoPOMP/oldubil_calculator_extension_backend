/**
 * Pull requested RegExp pattern from
 * string.
 *
 * @param {string} original       original string
 * @param {string} pattern        string pattern.
 * @param options
 */
export const pullPattern = (
  original: string,
  pattern: string,
  options?: {
    flags?: string;
    wrap?: boolean;
  }
): string | undefined => {
  const wrappedPattern: RegExp = new RegExp(
    `(${pattern})`,
    options?.flags ?? 'gi'
  );
  const pulledPattern: RegExp = new RegExp(
    `${pattern}`,
    options?.flags ?? 'gi'
  );

  return wrappedPattern
    ?.exec(original)
    ?.map(res => res)
    ?.filter(text => {
      if (!(options?.wrap ?? true)) {
        return text;
      }

      return pulledPattern.test(text);
    })[0];
};

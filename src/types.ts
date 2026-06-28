/**
 * A context object that interpolation tokens are resolved against. Values may be
 * nested objects and arrays; tokens reach into them with dotted and indexed
 * paths (e.g. `user.posts[0].title`).
 */
export type Context = Record<string, unknown>;

/**
 * The input map. Every key is considered, but by default only `string` and
 * `number` values survive into the result — anything else is dropped (see
 * {@link Options.passthrough}).
 */
export type Params = Record<string, unknown>;

/**
 * The parsed output for the default call (no {@link Options}): the `string` and
 * `number` entries of {@link Params}, with every `{{ token }}` in the strings
 * replaced by its resolved context value.
 */
export type ParsedResult = Record<string, string | number>;

/**
 * A named transform usable inside a token as a pipe: `{{ path | name: arg }}`.
 * It receives the current value and any colon-separated arguments, and returns
 * the next value in the chain.
 */
export type Transform = (value: unknown, ...args: Array<string | number>) => unknown;

/** Options that opt in to the additive features. Omitting them preserves v1 behaviour. */
export interface Options {
  /** Named transforms referenced by `{{ path | name }}` pipes. */
  transforms?: Record<string, Transform>;
  /**
   * Keep parameter values that are neither `string` nor `number` instead of
   * dropping them. Defaults to `false`.
   */
  passthrough?: boolean;
  /**
   * When a parameter string is exactly one `{{ token }}`, emit the resolved value
   * with its real type rather than stringifying it. Defaults to `false`.
   */
  raw?: boolean;
}

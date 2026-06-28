import type { Context, Options, Params, ParsedResult, Transform } from './types';

/** Matches a `{{ ... }}` token, optionally escaped with a leading backslash. */
const TOKEN = /\\?\{\{(.*?)\}\}/g;
/** Matches a string that is exactly one token with no surrounding text. */
const WHOLE_TOKEN = /^\{\{([^{}]*)\}\}$/;

type Filter = { name: string; args: Array<string | number> };
type ParsedToken = { path: string[]; filters: Filter[]; fallback?: string };

/**
 * Splits a path expression into its keys, dropping the empty segments produced by
 * dot and bracket notation: `user.posts[0].title` -> `['user', 'posts', '0', 'title']`.
 */
const toPath = (expression: string): string[] =>
  expression
    .trim()
    .split(/[.[\]]/)
    .filter((key) => key !== '');

/** Strips a single matching pair of surrounding quotes, if present. */
const unquote = (raw: string): string => {
  const value = raw.trim();
  return /^'.*'$/.test(value) || /^".*"$/.test(value) ? value.slice(1, -1) : value;
};

/** Parses a filter argument into a number when it looks numeric, otherwise a string. */
const parseArg = (raw: string): string | number => {
  const value = raw.trim();
  if (/^'.*'$/.test(value) || /^".*"$/.test(value)) {
    return value.slice(1, -1);
  }
  const num = Number(value);
  return value !== '' && !Number.isNaN(num) ? num : value;
};

/** Parses a `name: arg, arg` pipe segment into a {@link Filter}. */
const parseFilter = (segment: string): Filter => {
  const colon = segment.indexOf(':');
  if (colon === -1) {
    return { name: segment.trim(), args: [] };
  }
  return {
    name: segment.slice(0, colon).trim(),
    args: segment
      .slice(colon + 1)
      .split(',')
      .map(parseArg),
  };
};

/** Parses a token's interior into its path, filter chain and optional fallback. */
const parseToken = (expression: string): ParsedToken => {
  const fallbackAt = expression.indexOf('||');
  const head = fallbackAt === -1 ? expression : expression.slice(0, fallbackAt);
  const fallback = fallbackAt === -1 ? undefined : unquote(expression.slice(fallbackAt + 2));
  const pipeAt = head.indexOf('|');
  const pathPart = pipeAt === -1 ? head : head.slice(0, pipeAt);
  const filterText = pipeAt === -1 ? '' : head.slice(pipeAt + 1);
  const filters = filterText === '' ? [] : filterText.split('|').map(parseFilter);
  return { path: toPath(pathPart), filters, fallback };
};

/**
 * Walks `path` through `context`, returning the resolved value or `undefined` when
 * any step is missing or descends into a non-object.
 */
const resolveValue = (path: string[], context: Context): unknown => {
  let current: unknown = context;
  for (const key of path) {
    if (current === null || typeof current !== 'object') {
      return undefined;
    }
    current = (current as Record<string, unknown>)[key];
  }
  return current;
};

/** Runs the filter chain, throwing if a referenced transform was not registered. */
const applyFilters = (
  value: unknown,
  filters: Filter[],
  transforms: Record<string, Transform>,
): unknown =>
  filters.reduce((current, { name, args }) => {
    const transform = transforms[name];
    if (!transform) {
      throw new Error(`Unknown transform "${name}"`);
    }
    return transform(current, ...args);
  }, value);

/** Resolves a token to its raw value: path, then filters, then fallback when absent. */
const resolveToken = (
  token: ParsedToken,
  context: Context,
  transforms: Record<string, Transform>,
): unknown => {
  const value = applyFilters(resolveValue(token.path, context), token.filters, transforms);
  return value == null && token.fallback !== undefined ? token.fallback : value;
};

/**
 * Renders a token as a string. Plain paths keep the v1 falsy-collapse (a falsy
 * value becomes an empty string); a fallback fills any empty result.
 */
const renderToken = (
  token: ParsedToken,
  context: Context,
  transforms: Record<string, Transform>,
): string => {
  const value = applyFilters(resolveValue(token.path, context), token.filters, transforms);
  let text: string;
  if (value === null || value === undefined) {
    text = '';
  } else if (token.filters.length > 0) {
    text = `${value}`;
  } else {
    text = value ? `${value}` : '';
  }
  return text === '' && token.fallback !== undefined ? token.fallback : text;
};

/** Replaces every `{{ token }}` in `template`; a leading backslash escapes one. */
const interpolate = (
  template: string,
  context: Context,
  transforms: Record<string, Transform>,
): string =>
  template.replace(TOKEN, (match: string, expression: string) =>
    match.startsWith('\\')
      ? match.slice(1)
      : renderToken(parseToken(expression), context, transforms),
  );

export function parser(params: Params, context: Context): ParsedResult;
export function parser(params: Params, context: Context, options: Options): Record<string, unknown>;
/**
 * Interpolates the string entries of `params` against `context`. String values
 * have their `{{ token }}` placeholders replaced, numbers pass through untouched,
 * and any other value type is omitted unless {@link Options.passthrough} is set.
 */
export function parser(
  params: Params,
  context: Context,
  options: Options = {},
): Record<string, unknown> {
  const transforms = options.transforms ?? {};
  return Object.keys(params).reduce<Record<string, unknown>>((result, key) => {
    const value = params[key];

    if (typeof value === 'number') {
      result[key] = value;
      return result;
    }

    if (typeof value !== 'string') {
      if (options.passthrough) {
        result[key] = value;
      }
      return result;
    }

    result[key] =
      options.raw && WHOLE_TOKEN.test(value)
        ? resolveToken(parseToken(value.slice(2, -2)), context, transforms)
        : interpolate(value, context, transforms);
    return result;
  }, {});
}

export default parser;

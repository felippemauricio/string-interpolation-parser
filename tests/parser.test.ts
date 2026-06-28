import { describe, expect, it } from 'vitest';
import parser, { parser as namedParser } from '../src';

describe('parser', () => {
  it('exposes the same function as the default and named export', () => {
    expect(namedParser).toBe(parser);
  });

  it('returns only string and number values', () => {
    const params = {
      param1: 'Hello World',
      param2: 2,
      param3: undefined,
      param4: [1],
      param5: { foo: 'bar' },
      param6: null,
      param7: true,
    };
    expect(parser(params, {})).toEqual({
      param1: 'Hello World',
      param2: 2,
    });
  });

  it('parses a string from shallow context', () => {
    const params = {
      welcome: 'Hello {{ user }}!',
      error: 'Something went wrong: {{ error }}',
    };
    const context = {
      user: 'Felippe',
      error: 'your session expired',
    };
    expect(parser(params, context)).toEqual({
      welcome: 'Hello Felippe!',
      error: 'Something went wrong: your session expired',
    });
  });

  it('parses strings with inconsistent spaces', () => {
    const params = {
      welcome: 'Hello {{user}}!',
      error: 'Something went wrong: {{       error}}',
    };
    const context = {
      user: 'Felippe',
      error: 'your session expired',
    };
    expect(parser(params, context)).toEqual({
      welcome: 'Hello Felippe!',
      error: 'Something went wrong: your session expired',
    });
  });

  it('parses multiple tokens from shallow context', () => {
    const params = { welcome: 'Hello {{ firstName }} {{ lastName }}!' };
    const context = { firstName: 'Felippe', lastName: 'Murakami' };
    expect(parser(params, context)).toEqual({
      welcome: 'Hello Felippe Murakami!',
    });
  });

  it('parses a string from deep context', () => {
    const params = { welcome: 'Hello {{ user.firstName }} {{ user.lastName }}!' };
    const context = { user: { firstName: 'Felippe', lastName: 'Murakami' } };
    expect(parser(params, context)).toEqual({
      welcome: 'Hello Felippe Murakami!',
    });
  });

  it('parses array indices from deep context', () => {
    const params = {
      welcome: 'Read now: {{ user.posts[0].title }}!',
      interest: 'Something that might interest you: {{ cart.items[0].tags[0] }}',
    };
    const context = {
      user: { posts: [{ title: 'Designing an API with GraphQL' }] },
      cart: { items: [{ name: 'Air Fryer', tags: ['sale'] }] },
    };
    expect(parser(params, context)).toEqual({
      welcome: 'Read now: Designing an API with GraphQL!',
      interest: 'Something that might interest you: sale',
    });
  });

  it('coerces a numeric context value to a string when interpolated', () => {
    const params = { stock: 'In stock: {{ product.count }}' };
    const context = { product: { count: 42 } };
    expect(parser(params, context)).toEqual({ stock: 'In stock: 42' });
  });

  it('yields an empty string for a missing leaf', () => {
    const params = { welcome: 'Hello {{ user.firstName }} {{ user.lastName }}' };
    const context = { user: { firstName: 'Felippe' } };
    expect(parser(params, context)).toEqual({ welcome: 'Hello Felippe ' });
  });

  it('yields an empty string when a path descends into a non-object', () => {
    const params = { welcome: 'Hello {{ user.name.first }}' };
    const context = { user: 'Felippe' };
    expect(parser(params, context)).toEqual({ welcome: 'Hello ' });
  });

  it('yields an empty string for a falsy context value (v1 collapse)', () => {
    const params = { count: 'You have {{ items }} items' };
    const context = { items: 0 };
    expect(parser(params, context)).toEqual({ count: 'You have  items' });
  });

  describe('fallbacks', () => {
    it('uses the fallback when the token would render empty', () => {
      const params = { greeting: 'Hi {{ user.name || Guest }}!' };
      expect(parser(params, {})).toEqual({ greeting: 'Hi Guest!' });
    });

    it('keeps spaces in a double-quoted fallback', () => {
      const params = { greeting: 'Hi {{ user.name || "no name on file" }}!' };
      expect(parser(params, { user: {} })).toEqual({ greeting: 'Hi no name on file!' });
    });

    it('keeps spaces in a single-quoted fallback', () => {
      const params = { greeting: "Hi {{ user.name || 'no name' }}!" };
      expect(parser(params, { user: {} })).toEqual({ greeting: 'Hi no name!' });
    });

    it('ignores the fallback when the value is present', () => {
      const params = { greeting: 'Hi {{ name || Guest }}!' };
      expect(parser(params, { name: 'Felippe' })).toEqual({ greeting: 'Hi Felippe!' });
    });
  });

  describe('filters', () => {
    const transforms = {
      upper: (value: unknown) => String(value).toUpperCase(),
      round: (value: unknown, digits: string | number) => Number(value).toFixed(Number(digits)),
      tag: (value: unknown, ...labels: Array<string | number>) => `${value} [${labels.join('/')}]`,
    };

    it('applies a single filter', () => {
      const params = { shout: '{{ name | upper }}' };
      expect(parser(params, { name: 'felippe' }, { transforms })).toEqual({ shout: 'FELIPPE' });
    });

    it('passes a numeric argument to a filter', () => {
      const params = { price: '$ {{ amount | round: 2 }}' };
      expect(parser(params, { amount: 9.5 }, { transforms })).toEqual({ price: '$ 9.50' });
    });

    it('passes multiple string arguments to a filter', () => {
      const params = { line: "{{ name | tag: 'a', 'b' }}" };
      expect(parser(params, { name: 'item' }, { transforms })).toEqual({ line: 'item [a/b]' });
    });

    it('parses single-quoted, double-quoted, bare, numeric and empty arguments', () => {
      const join = (value: unknown, ...args: Array<string | number>) =>
        `${value}|${args.map((arg) => `${typeof arg}:${arg}`).join(',')}`;
      const params = { out: '{{ name | join: \'a\', "b", c, 1, }}' };
      expect(parser(params, { name: 'n' }, { transforms: { join } })).toEqual({
        out: 'n|string:a,string:b,string:c,number:1,string:',
      });
    });

    it('throws for an unregistered transform', () => {
      const params = { x: '{{ name | missing }}' };
      expect(() => parser(params, { name: 'a' }, { transforms })).toThrow(
        'Unknown transform "missing"',
      );
    });
  });

  describe('escaping', () => {
    it('emits a literal token when escaped with a backslash', () => {
      const params = { doc: 'Use \\{{ token }} to interpolate {{ value }}.' };
      expect(parser(params, { value: 'this' })).toEqual({
        doc: 'Use {{ token }} to interpolate this.',
      });
    });
  });

  describe('passthrough', () => {
    it('keeps non-string and non-number values when enabled', () => {
      const params = { flag: true, list: [1], nested: { a: 1 }, text: 'Hi {{ name }}', n: 3 };
      expect(parser(params, { name: 'Felippe' }, { passthrough: true })).toEqual({
        flag: true,
        list: [1],
        nested: { a: 1 },
        text: 'Hi Felippe',
        n: 3,
      });
    });
  });

  describe('raw', () => {
    it('returns the resolved value with its real type for a single token', () => {
      const params = { user: '{{ account.user }}', label: 'Owner: {{ account.user.name }}' };
      const context = { account: { user: { name: 'Felippe', age: 30 } } };
      expect(parser(params, context, { raw: true })).toEqual({
        user: { name: 'Felippe', age: 30 },
        label: 'Owner: Felippe',
      });
    });

    it('falls back to the literal when a single raw token is absent', () => {
      const params = { user: '{{ account.user || none }}' };
      expect(parser(params, {}, { raw: true })).toEqual({ user: 'none' });
    });

    it('returns undefined for a missing single raw token without a fallback', () => {
      const params = { user: '{{ account.user }}' };
      expect(parser(params, {}, { raw: true })).toEqual({ user: undefined });
    });
  });
});

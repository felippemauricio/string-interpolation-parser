import parser from '../src';


test('returns only string and number values', () => {
  const params = {
    param1: 'Hello World',
    param2: 2,
    param3: undefined,
    param4: [1],
    param5: { foo: 'bar' },
  };
  expect(parser(params, {}))
    .toEqual({
      param1: 'Hello World',
      param2: 2,
    });
});

test('parses a string from shallow context', () => {
  const params = {
    welcome: 'Hello {{ user }}!',
    error: 'Something went wrong: {{ error }}',
  };
  const context = {
    user: 'Felippe',
    error: 'your session expired',
  };
  expect(parser(params, context))
    .toEqual({
      welcome: 'Hello Felippe!',
      error: 'Something went wrong: your session expired',
    });
});

test('parses strings with inconsistent spaces', () => {
  const params = {
    welcome: 'Hello {{user}}!',
    error: 'Something went wrong: {{       error}}',
  };
  const context = {
    user: 'Felippe',
    error: 'your session expired',
  };
  expect(parser(params, context))
    .toEqual({
      welcome: 'Hello Felippe!',
      error: 'Something went wrong: your session expired',
    });
});

test('parses multiple strings from shallow context', () => {
  const params = {
    welcome: 'Hello {{ firstName }} {{ lastName }}!',
  };
  const context = {
    firstName: 'Felippe',
    lastName: 'Murakami',
  };
  expect(parser(params, context))
    .toEqual({
      welcome: 'Hello Felippe Murakami!',
    });
});

test('parses a string from deep context', () => {
  const params = {
    welcome: 'Hello {{ user.firstName }} {{ user.lastName }}!',
  };
  const context = {
    user: {
      firstName: 'Felippe',
      lastName: 'Murakami',
    },
  };
  expect(parser(params, context))
    .toEqual({
      welcome: 'Hello Felippe Murakami!',
    });
});

test('parses an array from deep context', () => {
  const params = {
    welcome: 'Read now: {{ user.posts[0].title }}!',
    interest: 'Something that might interest you: {{ cart.items[0].tags[0] }}',
  };
  const context = {
    user: {
      posts: [
        { title: 'Desining an API with GraphQL' },
      ],
    },
    cart: {
      items: [
        {
          name: 'Air Fryer',
          tags: ['sale'],
        },
      ],
    },
  };
  expect(parser(params, context))
    .toEqual({
      welcome: 'Read now: Desining an API with GraphQL!',
      interest: 'Something that might interest you: sale',
    });
});

test('returns empty if non existing', () => {
  const params = {
    welcome: 'Hello {{ user.firstName }} {{ user.lastName }}',
  };
  const context = {
    user: {
      firstName: 'Felippe',
    },
  };
  expect(parser(params, context))
    .toEqual({
      welcome: 'Hello Felippe ',
    });
});

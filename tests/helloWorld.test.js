import helloWorld from '../src';


describe('Hello World Test', () => {
  it('Should return a Hello World string', () => {
    const result = helloWorld();
    expect(result).toBe('Hello World');
  });
});

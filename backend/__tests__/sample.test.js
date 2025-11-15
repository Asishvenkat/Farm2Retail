describe('Sample Test Suite', () => {
  test('should pass a basic arithmetic test', () => {
    expect(1 + 1).toBe(2);
  });

  test('should verify string equality', () => {
    expect('hello').toBe('hello');
  });

  test('should verify array contains element', () => {
    const arr = [1, 2, 3];
    expect(arr).toContain(2);
  });

  test('should verify object properties', () => {
    const user = { name: 'John', age: 30 };
    expect(user).toHaveProperty('name');
    expect(user.name).toBe('John');
  });

  test('should verify array length', () => {
    const items = ['apple', 'banana', 'orange'];
    expect(items.length).toBe(3);
  });
});

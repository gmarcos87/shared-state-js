const SharedState = require('../shared-state');

test('Envejecer los datos luego de hacer un bleach', () => {
  const sharedState = new SharedState({author: 'jest'})
  sharedState.insert('123',{name: 'test'}, 10, 'jest')
  expect(sharedState.show('jest').get('123').bleachTTL).toBe(10)
  sharedState.bleach('jest')
  expect(sharedState.show('jest').get('123').bleachTTL).toBe(9)
});


test('Los datos que llegan a cero son removidos', () => {
  const sharedState = new SharedState({author: 'jest'})
  sharedState.insert('123',{name: 'test'}, 1, 'jest')
  expect(sharedState.show('jest').has('123')).toBe(true)
  sharedState.bleach('jest')
  expect(sharedState.show('jest').has('123')).toBe(false)
});
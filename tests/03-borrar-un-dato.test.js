const SharedState = require('../shared-state');


test('Eliminar un dato de shared-state', () => {
  const sharedState = new SharedState({
    author: 'jest',
    storage: [
      ['test', new Map([['deleteme', true]])]
    ]
  })
  expect(sharedState.show("test").size).toBe(1)
  sharedState.remove("deleteme", "test")
  expect(sharedState.show("test").size).toBe(0)
})



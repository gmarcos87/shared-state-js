const SharedState = require('../shared-state');

const sharedState = new SharedState({author: 'jest'})

test('Agregar un dato en el storage shared-state', () => {
  const mockData = {"hello": "world"};
  sharedState.insert('test01', mockData, 2, 'jest')
  expect(sharedState.storage.size).toBe(1)
});

test('Si agrego sin bleach utiliza el defualt', () => {
  const mockData = {"hello": "world"};
  sharedState.insert('test02', mockData, undefined, 'jest')
  expect(sharedState.show('jest').get('test02').bleachTTL).toBe(30)
});

test('Obtener el dato recientemente agregado',() =>{
  const saved = sharedState.show('jest').get('test01')
  expect(saved.data.hello).toBe("world")
})

test('Crea la tabla si al consultarla no existe',() =>{
  expect(typeof sharedState.show('jest-dont-exist')).toBe('object')
})

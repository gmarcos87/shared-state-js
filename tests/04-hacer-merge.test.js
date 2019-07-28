const SharedState = require('../shared-state');

const sharedStateA = new SharedState({author: 'hello', storage: [['jest', new Map([['abc',{data: {}, bleachTTL: 30}]])]]})
const sharedStateB = new SharedState({author: 'world', storage: [
  ['jest',  new Map([['123',{data: {}, bleachTTL: 30 }]])],
  ['test', new Map([['ABC',{data: {}, bleachTTL: 30 }]])]
]});

test('Correr el merge de B en A', ()=>{
  let preStateA =  sharedStateA.show('jest')
  sharedStateA.merge(sharedStateB.show('jest'), false, 'jest')
  let posStateA = sharedStateA.show('jest')
  expect(posStateA.has('123')).toBe(true)
});

test('Crea la tabla si al momento del merge no existe', () => {
  sharedStateA.merge(sharedStateB.show('test'), true, 'test-unique')
  let stateA = sharedStateA.show('test-unique')
  expect(stateA.has('ABC')).toBe(true)
})

test('En el merge evita incluir información obsoleta', () => {
  sharedStateA.insert('test1',{name: 'old'}, 2, 'jest')
  sharedStateA.merge(new Map([['test2',{ bleachTTL: 0, data: {}, author: 'world'}]]),true, 'jest')
  let stateA = sharedStateA.show('jest')
  expect(stateA.has('test2')).toBe(false)
})

test('Sobreescribir con la informaci?n mas reciente', () => {
  sharedStateA.insert('test1',{name: 'hello'}, 2, 'jest')
  sharedStateA.merge(new Map([['test1',{ bleachTTL: 5, data: {name: 'word'}}]]),true, 'jest')
  let stateA = sharedStateA.show('jest')
  expect(stateA.get('test1').data.name).toBe('word')
})

test('Conservar la informaci?n mas reciente si es la propia', () => {
  sharedStateA.insert('test1',{name: 'hello'}, 20, 'jest')
  sharedStateA.merge(new Map([['test1',{ bleachTTL: 5, data: {name: 'word'}}]]),true, 'jest')
  let stateA = sharedStateA.show('jest')
  expect(stateA.get('test1').data.name).toBe('hello')
})

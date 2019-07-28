const SharedState = require('../shared-state');

test('Correr el hook luego de instanciado', done => {
  const hookTest = (ss)  => {
    expect(ss.author).toBe('jest');
    done();
  }
  SharedState.__proto__.hooks.afterCreate = [
    ...SharedState.__proto__.hooks.afterCreate,
    hookTest
  ]

  const sharedState = new SharedState({author: 'jest'})
});

test('Correr el hook luego de insertar un dato', done => {
  const hookTest = function(ss, {key, data, timeout, area}){
    expect(ss.author).toBe('jest');
    expect(key).toBe("hello");
    expect(data).toBe('world');
    done();
  }
  SharedState.__proto__.hooks.afterInsert = [
    ...SharedState.__proto__.hooks.afterInsert,
    hookTest
  ]
  const sharedState = new SharedState({author: 'jest'})
  sharedState.insert('hello', 'world', 3600,'test')
});


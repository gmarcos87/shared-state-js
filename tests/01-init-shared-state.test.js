const SharedState = require('../shared-state');

test('Al iniciar shared-state obtengo un objeto con el estado vacio', () => {
    const sharedState = new SharedState({author: 'test'})
    expect(sharedState.storage.size).toBe(0);
  });


test('Puedo inicializar shared-state con un listado de tablas', () => {
    const sharedState = new SharedState({author: 'test', storage: [['jest', new Map()]]});
    expect(sharedState.storage.keys()).toContain('jest');
  });

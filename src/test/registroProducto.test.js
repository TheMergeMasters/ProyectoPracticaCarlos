const registroProducto = require('./registroProducto');

console.log('Prueba 1: El producto no se puede registrar sin un nombre');
describe ("Validacion de productos",() => {
  it("No permite guardar campos vacios",() =>{
    const producto = {
      nombre_producto: '',
      id_categoria: '',
      precio_venta: '',
      stock: ''
    };
    const resultado = registroProducto(producto);
    expect(resultado.valido).toBe(false);
    expect(resultado.mensaje).toBe('Todos los campos son obligatorios');
  });

  console.log('Prueba 2: El precio del productos no puede ser negativo');
  it("No permite guardar un precio negativo",() =>{
    const producto = {
      nombre_producto: 'Martillo',
      id_categoria: '1',
      precio_venta: -10,
      stock: 5
    };
    const resultado = registroProducto(producto);
    expect(resultado.valido).toBe(false);
    expect(resultado.mensaje).toBe('El precio de venta debe ser un número positivo');
  });


  console.log('Prueba 3: El stock del producto no puede ser negativo');
  it("No permite guardar un stock negativo",() =>{
    const producto = {
      nombre_producto: 'Martillo',
      id_categoria: '1',
      precio_venta: 10,
      stock: -5
    };
    const resultado = registroProducto(producto);
    expect(resultado.valido).toBe(false);
    expect(resultado.mensaje).toBe('El stock debe ser un número positivo');
  });

  console.log('Prueba 4: Descripcion del producto no puede exceder los 255 caracteres');
  it("No permite descripcion muy larga",() =>{
    const producto = {
      nombre_producto: 'Martillo',
      id_categoria: '1',
      precio_venta: 10,
      stock: 5,
      descripcion: 'A'.repeat(300) // Genera una cadena de 300 caracteres
    };
    const resultado = registroProducto(producto);
    expect(resultado.valido).toBe(false);
    expect(resultado.mensaje).toBe('La descripción no puede exceder los 255 caracteres');
  });

  console.log('Prueba 5: Producto registrado correctamente');
  it("Agregar Producto Correctamente",() =>{
    const producto = {
      nombre_producto: 'Martillo',
      id_categoria: '1',
      precio_venta: 10,
      stock: 5,
      descripcion: 'Martillo de acero'
    };
    const resultado = registroProducto(producto);
    expect(resultado.valido).toBe(true);
    expect(resultado.mensaje).toBe('Producto registrado correctamente');
  });
});
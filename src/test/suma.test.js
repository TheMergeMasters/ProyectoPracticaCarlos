const sum = require('./suma');
test("La funcion suma debe devolver suma correcta", () => {
    expect(sum(1, 2)).toBe(3);
});
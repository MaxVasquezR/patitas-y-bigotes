import { EdadPipe } from './edad.pipe';

describe('EdadPipe', () => {
  const pipe = new EdadPipe();

  it('calcula años', () => {
    const hace2Anios = new Date();
    hace2Anios.setFullYear(hace2Anios.getFullYear() - 2);
    const fecha = hace2Anios.toISOString().split('T')[0];
    expect(pipe.transform(fecha)).toContain('año');
  });
});

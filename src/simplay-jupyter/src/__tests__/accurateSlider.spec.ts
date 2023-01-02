import { AccurateSlider } from '../accurateSlider';

describe('AccurateSlider tests', () => {
  it('should create a div', () => {
    const accurateSlider = new AccurateSlider('sli', 0, 100);
    expect(accurateSlider.slider).toBeInstanceOf(HTMLDivElement);
  });

  it('should create a div with id sli', () => {
    const accurateSlider = new AccurateSlider('sli', 0, 100);
    expect(accurateSlider.slider.id).toBe('sli');
  });

  it('should update id when changing id', () => {
    const accurateSlider = new AccurateSlider('sli', 0, 100);
    accurateSlider.id = 'newId';
    expect(accurateSlider.slider.id).toBe('newId');
  });

  it('should reject minVal > maxVal', () => {
    expect(() => new AccurateSlider('sli', 100, 0)).toThrow();
  });

  it('should reject minVal == maxVal', () => {
    expect(() => new AccurateSlider('sli', 100, 100)).toThrow();
  });

  it('should reject minVal < 0', () => {
    expect(() => new AccurateSlider('sli', -1, 100)).toThrow();
  });

  it('should reject minVal > maxVal when changing minVal', () => {
    const accurateSlider = new AccurateSlider('sli', 0, 100);
    expect(() => (accurateSlider.minVal = 100)).toThrow();
  });

  it('should reject minVal == maxVal when changing minVal', () => {
    const accurateSlider = new AccurateSlider('sli', 0, 100);
    expect(() => (accurateSlider.minVal = 100)).toThrow();
  });

  it('should reject minVal < 0 when changing minVal', () => {
    const accurateSlider = new AccurateSlider('sli', 0, 100);
    expect(() => (accurateSlider.minVal = -1)).toThrow();
  });

  it('should reject minVal > maxVal when changing maxVal', () => {
    const accurateSlider = new AccurateSlider('sli', 0, 100);
    expect(() => (accurateSlider.maxVal = 0)).toThrow();
  });

  it('should reject minVal == maxVal when changing maxVal', () => {
    const accurateSlider = new AccurateSlider('sli', 0, 100);
    expect(() => (accurateSlider.maxVal = 0)).toThrow();
  });

  it('should reject value < minVal', () => {
    expect(() => new AccurateSlider('sli', 0, 100, -10)).toThrow();
  });

  it('should reject value > maxVal', () => {
    expect(() => new AccurateSlider('sli', 0, 100, 110)).toThrow();
  });

  it('should correct value < minVal when changing value', () => {
    const accurateSlider = new AccurateSlider('sli', 0, 100);
    accurateSlider.value = -10;
    expect(accurateSlider.value).toBe(0);
  });

  it('should correct value > maxVal when changing value', () => {
    const accurateSlider = new AccurateSlider('sli', 0, 100);
    accurateSlider.value = 110;
    expect(accurateSlider.value).toBe(100);
  });

  it('should notify staged value change when changing value', () => {
    const accurateSlider = new AccurateSlider('sli', 0, 100);
    const spy = jest.fn();
    accurateSlider.addOnStagedValueChangedListener(spy);
    accurateSlider.value = 50;
    expect(spy).toBeCalledWith(50);
  });

  it('should update div heigth when setting heigth property', () => {
    const accurateSlider = new AccurateSlider('sli', 0, 100);
    accurateSlider.heigth = 100;
    expect(accurateSlider.slider.style.height).toBe('100px');
  });

  it('should notify staged value change when changing', () => {
    const accurateSlider = new AccurateSlider('sli', 0, 100);
    const spy = jest.fn();
    const spy2 = jest.fn();
    accurateSlider.addOnStagedValueChangedListener(spy);
    accurateSlider.addOnStagedValueChangedListener(spy2);
    accurateSlider.value = 50;
    expect(spy).toBeCalledWith(50);
    expect(spy2).toBeCalledWith(50);
    accurateSlider.removeOnStagedValueChangedListener(spy);
    accurateSlider.value = 60;
    expect(spy).not.toBeCalledWith(60);
    expect(spy2).toBeCalledWith(60);
  });
});

import { AccurateSlider } from '../accurateSlider';
import { makeCustomResizeObseverGloballyAvailable } from './CustomResizeObserver';

describe('AccurateSlider tests', () => {
  beforeAll(() => {
    makeCustomResizeObseverGloballyAvailable();
  });
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

  it('setting minVal updates minVal', () => {
    const accurateSlider = new AccurateSlider('sli', 0, 100);
    accurateSlider.minVal = 10;
    expect(accurateSlider.minVal).toBe(10);
  });

  it('setting maxVal updates maxVal', () => {
    const accurateSlider = new AccurateSlider('sli', 0, 100);
    accurateSlider.maxVal = 10;
    expect(accurateSlider.maxVal).toBe(10);
  });

  it('sets the correct color for left segment', () => {
    const accurateSlider = new AccurateSlider('sli', 0, 100, 50, 10, 'red');
    expect(accurateSlider.leftSegment.color).toBe('red');
  });

  it('sets the correct color for right segment', () => {
    const accurateSlider = new AccurateSlider(
      'sli',
      0,
      100,
      50,
      10,
      'red',
      'blue'
    );
    expect(accurateSlider.rightSegment.color).toBe('blue');
  });

  it('sets the correct color for left segment when changing color', () => {
    const accurateSlider = new AccurateSlider('sli', 0, 100, 50, 10, 'red');
    accurateSlider.leftSegment.color = 'blue';
    expect(accurateSlider.leftSegment.color).toBe('blue');
  });

  it('sets the correct color for right segment when changing color', () => {
    const accurateSlider = new AccurateSlider(
      'sli',
      0,
      100,
      50,
      10,
      'red',
      'blue'
    );
    accurateSlider.rightSegment.color = 'green';
    expect(accurateSlider.rightSegment.color).toBe('green');
  });

  it('updates the width of the left segment when changing value', () => {
    const accurateSlider = new AccurateSlider('sli', 0, 100, 50, 10, 'red');
    accurateSlider.leftSegment.width = 60;
    expect(accurateSlider.leftSegment.width).toBe(60);
  });

  it('updates the value when clicking on the slider', () => {
    const accurateSlider = new AccurateSlider('sli', 0, 100, 50, 10);
    const event = new MouseEvent('mousedown', {});
    Object.assign(event, {
      pageX: 60
    });
    accurateSlider.slider.getBoundingClientRect = () => ({
      left: 0,
      top: 0,
      width: 100,
      height: 10,
      right: 0,
      bottom: 0,
      x: 0,
      y: 0,
      toJSON: () => {}
    });

    accurateSlider.slider.dispatchEvent(event);
    expect(accurateSlider.value).toBe(60);
  });

  it('fires an event when updating the value from a click', () => {
    const accurateSlider = new AccurateSlider('sli', 0, 100, 50, 10);
    const event = new MouseEvent('mousedown', {});
    Object.assign(event, {
      pageX: 60
    });
    accurateSlider.slider.getBoundingClientRect = () => ({
      left: 0,
      top: 0,
      width: 100,
      height: 10,
      right: 0,
      bottom: 0,
      x: 0,
      y: 0,
      toJSON: () => {}
    });

    const spy = jest.fn();
    accurateSlider.addOnStagedValueChangedListener(spy);
    accurateSlider.slider.dispatchEvent(event);
    expect(spy).toBeCalledWith(60);
  });

  it('fires hoverchanegd information when hovering', () => {
    const accurateSlider = new AccurateSlider('sli', 0, 100, 50, 10);
    const event = new MouseEvent('mousemove', {});
    Object.assign(event, {
      pageX: 40
    });
    accurateSlider.slider.getBoundingClientRect = () => ({
      left: 0,
      top: 0,
      width: 100,
      height: 10,
      right: 0,
      bottom: 0,
      x: 0,
      y: 0,
      toJSON: () => {}
    });

    const spy = jest.fn();
    accurateSlider.addOnHoverPositionChangedListener(spy);
    accurateSlider.slider.dispatchEvent(event);
    expect(spy).toBeCalledWith(40);
  });

  it('fires staged value changes', () => {
    const accurateSlider = new AccurateSlider('sli', 0, 100, 50, 10);
    const event = new MouseEvent('mousedown', {});
    Object.assign(event, {
      pageX: 40
    });
    accurateSlider.slider.getBoundingClientRect = () => ({
      left: 0,
      top: 0,
      width: 100,
      height: 10,
      right: 0,
      bottom: 0,
      x: 0,
      y: 0,
      toJSON: () => {}
    });

    const spy = jest.fn();
    accurateSlider.addOnStagedValueChangedListener(spy);
    accurateSlider.slider.dispatchEvent(event);
    expect(spy).toBeCalledWith(40);
  });

  it('fires staged value changes when moving with mousedown', () => {
    const accurateSlider = new AccurateSlider('sli', 0, 100, 50, 10);
    const event = new MouseEvent('mousedown', {});
    Object.assign(event, {
      pageX: 40
    });
    accurateSlider.slider.getBoundingClientRect = () => ({
      left: 0,
      top: 0,
      width: 100,
      height: 10,
      right: 0,
      bottom: 0,
      x: 0,
      y: 0,
      toJSON: () => {}
    });

    const event2 = new MouseEvent('mousemove', {
      buttons: 1
    });
    Object.assign(event2, {
      pageX: 60
    });
    accurateSlider.slider.dispatchEvent(event);
    const spy = jest.fn();
    accurateSlider.addOnStagedValueChangedListener(spy);
    accurateSlider.slider.dispatchEvent(event2);
    expect(spy).toBeCalledWith(60);
  });

  it('fires after scribbling', () => {
    const accurateSlider = new AccurateSlider('sli', 0, 100, 50, 10);
    const event = new MouseEvent('mousedown', {});
    Object.assign(event, {
      pageX: 40
    });
    accurateSlider.slider.getBoundingClientRect = () => ({
      left: 0,
      top: 0,
      width: 100,
      height: 10,
      right: 0,
      bottom: 0,
      x: 0,
      y: 0,
      toJSON: () => {}
    });

    const event2 = new MouseEvent('mouseup', {});
    const spy = jest.fn();
    accurateSlider.addOnValueChangedListener(spy);
    accurateSlider.slider.dispatchEvent(event);
    document.dispatchEvent(event2);
    expect(spy).toBeCalledWith(40);
  });
});

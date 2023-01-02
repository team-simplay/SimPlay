import { SpeedSelector } from '../speedSelector';
describe('speedSelector tests', () => {
  it('should create a htmlbutton', () => {
    const callback = jest.fn();
    const speedSelector = new SpeedSelector(callback);
    expect(speedSelector.button).toBeInstanceOf(HTMLButtonElement);
  });

  it('should call callack', () => {
    const callback = jest.fn();
    const speedSelector = new SpeedSelector(callback);
    speedSelector.button.click();

    expect(speedSelector.slider).toBeInstanceOf(HTMLInputElement);

    const event = new Event('change');
    speedSelector.slider.dispatchEvent(event);

    expect(callback).toHaveBeenCalled();
  });
});

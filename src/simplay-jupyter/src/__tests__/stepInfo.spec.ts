import { StepInfo } from '../stepInfo';
describe('StepInfo tests', () => {
  it('should create the step info after calling render', () => {
    const stepInfo = new StepInfo('id', 0, 10);
    const element = stepInfo.render();
    expect(element.innerHTML).toEqual('0 / 10');
  });

  it('should handle mode change', () => {
    const stepInfo = new StepInfo('id', 0, 10);
    stepInfo.changeMode(StepInfo.TIME_MODE);
    const element = stepInfo.render();
    expect(element.innerHTML).toBe('00:00 / 00:10');
  });

  it('should inform a mode listener', () => {
    const stepInfo = new StepInfo('id', 0, 10);
    const modeListener = jest.fn();
    stepInfo.addModeListener(modeListener);
    stepInfo.changeMode(StepInfo.TIME_MODE);
    expect(modeListener).toHaveBeenCalled();
  });

  it('should remove mode listener', () => {
    const stepInfo = new StepInfo('id', 0, 10);
    const modeListener = jest.fn();
    stepInfo.addModeListener(modeListener);
    stepInfo.changeMode(StepInfo.TIME_MODE);
    expect(modeListener).toHaveBeenCalledTimes(1);
    stepInfo.removeModeListener(modeListener);
    stepInfo.changeMode(StepInfo.STEP_MODE);
    expect(modeListener).toHaveBeenCalledTimes(1);
  });

  it('should handle updates properly', () => {
    const stepInfo = new StepInfo('id', 0, 10);
    const element = stepInfo.render();
    stepInfo.currentStep = 2;
    stepInfo.totalSteps = 20;
    expect(element.innerHTML).toEqual('2 / 20');
    stepInfo.changeMode(StepInfo.TIME_MODE);
    stepInfo.currentStep = 5;
    stepInfo.totalSteps = 15;
    expect(element.innerHTML).toEqual('00:05 / 00:15');
  });

  it('should handle a click', () => {
    const stepInfo = new StepInfo('id', 0, 10);
    const element = stepInfo.render();
    const modeListener = jest.fn();
    stepInfo.addModeListener(modeListener);
    element.click();
    expect(modeListener).toHaveBeenCalledTimes(1);
    element.click();
    expect(modeListener).toHaveBeenCalledTimes(2);
  });

  it('should display a fractional totalSteps properly', () => {
    const stepInfo = new StepInfo('id', 0, 19.9990784);
    const element = stepInfo.render();
    expect(element.innerHTML).toBe('0 / 20');
  });
});

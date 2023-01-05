import { Handler, createButton, createIconSpan, tsToTime } from '../utils';

describe('Utils tests', () => {
  it('should create a button', () => {
    let icon = document.createElement('span');
    const className = 'clazz';
    const button = createButton(icon, [className]);
    expect(button).toBeDefined();
    expect(button.children.item(0)).toBe(icon);
    expect(button.classList).toContain(className);
  });

  it('should create icon span', () => {
    const svg = 'svg';
    const iconSpan = createIconSpan(svg);
    expect(iconSpan.innerHTML).toBe(svg);
    expect(iconSpan.classList).toContain('simplay-icon');
  });

  it('should convert timestamp with min and sec to time', () => {
    const ts = 100;
    const convertedTs = tsToTime(ts);
    expect(convertedTs).toBe('01:40');
  });

  it('should convert timestamp with hours sec and min to time', () => {
    const ts = 10000;
    const convertedTs = tsToTime(ts);
    expect(convertedTs).toBe('02:46:40');
  });

  it('should convert timestamp with fractionals into a displayable number', () => {
    const ts = 19.990201234;
    const convertedTs = tsToTime(ts);
    expect(convertedTs).toBe('00:20');
    const ts2 = 3659.990201234;
    const convertedTs2 = tsToTime(ts2);
    expect(convertedTs2).toBe('01:00:59');
  });

  it('should call all disable functions of ControlHandler', () => {
    const controlHandler = new Handler();
    const disable1 = jest.fn();
    const disable2 = jest.fn();
    controlHandler.attachDisable(disable1);
    controlHandler.attachDisable(disable2);
    controlHandler.disable();
    expect(disable1).toHaveBeenCalledTimes(1);
    expect(disable2).toHaveBeenCalledTimes(1);
    expect(controlHandler.state).toBe('disabled');
  });

  it('should call all enable functions of ControlHandler', () => {
    const controlHandler = new Handler();
    const enable1 = jest.fn();
    const enable2 = jest.fn();
    controlHandler.attachEnable(enable1);
    controlHandler.attachEnable(enable2);
    controlHandler.enable();
    expect(enable1).toHaveBeenCalledTimes(1);
    expect(enable2).toHaveBeenCalledTimes(1);
    expect(controlHandler.state).toBe('enabled');
  });
});

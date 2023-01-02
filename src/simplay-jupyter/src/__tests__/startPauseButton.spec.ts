import { StartPauseButton } from '../startPauseButton';

describe('StartPauseButton tests', () => {
  it('should create a htmlbutton', () => {
    const startPauseButton = new StartPauseButton(
      'playIcon',
      'pauseIcon',
      jest.fn,
      jest.fn
    );
    expect(startPauseButton.button).toBeInstanceOf(HTMLButtonElement);
  });

  it('should handle click events properly', () => {
    const pauseClickCallback = jest.fn();
    const playClickCallback = jest.fn();
    const playIcon = 'playIcon';
    const pauseIcon = 'pauseIcon';
    const startPauseButton = new StartPauseButton(
      playIcon,
      pauseIcon,
      pauseClickCallback,
      playClickCallback
    );
    expect(startPauseButton.button.children.item(0)?.innerHTML).toBe(playIcon);
    startPauseButton.button.click(); //click play
    expect(playClickCallback.mock.calls.length).toBe(1);
    expect(pauseClickCallback.mock.calls.length).toBe(0);
    expect(startPauseButton.playing).toBeTruthy();
    expect(startPauseButton.button.children.item(0)?.innerHTML).toBe(pauseIcon);

    startPauseButton.button.click(); // click pause
    expect(playClickCallback.mock.calls.length).toBe(1);
    expect(pauseClickCallback.mock.calls.length).toBe(1);
    expect(startPauseButton.playing).toBeFalsy();
    expect(startPauseButton.button.children.item(0)?.innerHTML).toBe(playIcon);
  });

  it('should handle reset properly', () => {
    const pauseClickCallback = jest.fn();
    const playClickCallback = jest.fn();
    const startPauseButton = new StartPauseButton(
      'playIcon',
      'pauseIcon',
      pauseClickCallback,
      playClickCallback
    );
    startPauseButton.button.click();
    expect(startPauseButton.playing).toBeTruthy();
    startPauseButton.reset();
    expect(startPauseButton.playing).toBeFalsy();
  });
});

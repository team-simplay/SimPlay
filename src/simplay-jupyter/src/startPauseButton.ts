import { createButton } from './utils';
import tippy, { Instance } from 'tippy.js';

export class StartPauseButton {
  private static TOOLTIP_PLAY = 'Play';
  private static TOOLTIP_PAUSE = 'Pause';

  public button: HTMLButtonElement;
  private iconSpan: HTMLSpanElement;
  private playIcon: string;
  private tooltip: Instance;

  private playing: boolean;

  constructor(
    playIcon: string,
    pauseIcon: string,
    pauseClickCallback: () => void,
    playClickCallback: () => void
  ) {
    this.playIcon = playIcon;
    this.playing = false;
    this.iconSpan = document.createElement('span');
    this.iconSpan.classList.add('simplay-icon');
    this.iconSpan.innerHTML = this.playIcon;
    this.button = createButton(this.iconSpan, ['simplay-button']);
    this.tooltip = tippy(this.button, {
      // default
      placement: 'top',
      content: StartPauseButton.TOOLTIP_PLAY,
      delay: [300, 50],
      arrow: false,
      theme: 'light'
    });

    this.button.addEventListener('click', () => {
      if (this.playing) {
        pauseClickCallback();
        this.playing = !this.playing;
        this.iconSpan.innerHTML = playIcon;
        this.tooltip.setContent(StartPauseButton.TOOLTIP_PLAY);
      } else {
        playClickCallback();
        this.playing = !this.playing;
        this.iconSpan.innerHTML = pauseIcon;
        this.tooltip.setContent(StartPauseButton.TOOLTIP_PAUSE);
      }
    });
  }

  public reset() {
    this.iconSpan.innerHTML = this.playIcon;
    this.tooltip.setContent(StartPauseButton.TOOLTIP_PLAY);
    this.playing = false;
  }
}

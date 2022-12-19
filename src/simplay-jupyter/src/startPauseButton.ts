import { createButton } from './utils';
import tippy, { Instance } from 'tippy.js';

export class StartPauseButton {
  private static TOOLTIP_PLAY = 'Play';
  private static TOOLTIP_PAUSE = 'Pause';

  public button: HTMLButtonElement;
  private iconSpan: HTMLSpanElement;
  private playIcon: string;
  private tooltip: Instance;

  private _playing: boolean;

  constructor(
    playIcon: string,
    pauseIcon: string,
    pauseClickCallback: () => void,
    playClickCallback: () => void
  ) {
    this.playIcon = playIcon;
    this._playing = false;
    this.iconSpan = document.createElement('span');
    this.iconSpan.classList.add('simplay-icon');
    this.iconSpan.innerHTML = this.playIcon;
    this.button = createButton(this.iconSpan, ['simplay-button']);
    this.button.setAttribute('aria-label', 'Play');
    this.tooltip = tippy(this.button, {
      placement: 'top',
      content: StartPauseButton.TOOLTIP_PLAY,
      delay: [300, 50],
      arrow: false,
      theme: 'light'
    });

    this.button.addEventListener('click', () => {
      if (this._playing) {
        pauseClickCallback();
        this._playing = !this._playing;
        this.iconSpan.innerHTML = playIcon;
        this.button.setAttribute('aria-label', 'Play');
        this.tooltip.setContent(StartPauseButton.TOOLTIP_PLAY);
      } else {
        playClickCallback();
        this._playing = !this._playing;
        this.iconSpan.innerHTML = pauseIcon;
        this.button.setAttribute('aria-label', 'Pause');
        this.tooltip.setContent(StartPauseButton.TOOLTIP_PAUSE);
      }
    });
  }

  get playing(): boolean {
    return this._playing;
  }

  public reset(): void {
    this.iconSpan.innerHTML = this.playIcon;
    this.tooltip.setContent(StartPauseButton.TOOLTIP_PLAY);
    this._playing = false;
  }
}

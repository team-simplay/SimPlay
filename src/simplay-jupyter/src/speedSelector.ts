import speedIcon from '../style/icons/speed.svg';
import { createButton, createIconSpan } from './utils';
import tippy from 'tippy.js';

export const SpeedSelectorValues = [0.5, 1, 2, 4, 10, 20, 50, 100];

export class SpeedSelector {
  button: HTMLButtonElement;
  slider: HTMLInputElement;

  constructor(changeCallback: (value: string) => void) {
    const containerTippy = document.createElement('div');
    containerTippy.classList.add('simplay-speed-container');
    this.slider = document.createElement('input');
    this.slider.type = 'range';
    this.slider.min = '0';
    this.slider.max = '7';
    this.slider.step = '1';
    this.slider.value = '1';
    this.slider.id = 'speedslider';
    this.slider.classList.add('simplay-speed-input');
    this.slider.addEventListener('change', e => {
      if (e.currentTarget) {
        changeCallback((e.currentTarget as HTMLInputElement).value);
      }
    });

    for (let i = 0; i < SpeedSelectorValues.length; i++) {
      const box = this.createDisplayParagraph(
        SpeedSelectorValues[i].toString(),
        (i + 1).toString()
      );
      containerTippy.appendChild(box);
    }

    containerTippy.appendChild(this.slider);

    const buttonSpan = createIconSpan(speedIcon);
    const button = createButton(buttonSpan, ['simplay-button']);
    tippy(button, {
      placement: 'top',
      content: containerTippy,
      allowHTML: true,
      delay: [300, 50],
      interactive: true,
      arrow: false,
      theme: 'light'
    });

    this.button = button;
  }

  createDisplayParagraph(
    innerText: string,
    classSuffix: string
  ): HTMLParagraphElement {
    const paragraph = document.createElement('p');
    paragraph.innerText = innerText;
    paragraph.classList.add(`simplay-speed-box${classSuffix}`);
    paragraph.classList.add('simplay-speed-box');
    return paragraph;
  }
}

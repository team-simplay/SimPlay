import speedIcon from '../style/icons/speed.svg';
import { createButton, createIconSpan } from './utils';
import tippy from 'tippy.js';

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

    const box100 = document.createElement('p');
    box100.innerText = '0.5';
    box100.classList.add('simplay-speed-box1');
    box100.classList.add('simplay-speed-box');

    const box50 = document.createElement('p');
    box50.innerText = '1';
    box50.classList.add('simplay-speed-box2');
    box50.classList.add('simplay-speed-box');

    const box20 = document.createElement('p');
    box20.innerText = '2';
    box20.classList.add('simplay-speed-box3');
    box20.classList.add('simplay-speed-box');

    const box10 = document.createElement('p');
    box10.innerText = '4';
    box10.classList.add('simplay-speed-box4');
    box10.classList.add('simplay-speed-box');

    const box8 = document.createElement('p');
    box8.innerText = '10';
    box8.classList.add('simplay-speed-box5');
    box8.classList.add('simplay-speed-box');

    const box4 = document.createElement('p');
    box4.innerText = '20';
    box4.classList.add('simplay-speed-box6');
    box4.classList.add('simplay-speed-box');

    const box2 = document.createElement('p');
    box2.innerText = '50';
    box2.classList.add('simplay-speed-box7');
    box2.classList.add('simplay-speed-box');

    const box1 = document.createElement('p');
    box1.innerText = '100';
    box1.classList.add('simplay-speed-box8');
    box1.classList.add('simplay-speed-box');

    containerTippy.appendChild(box100);
    containerTippy.appendChild(box50);
    containerTippy.appendChild(box20);
    containerTippy.appendChild(box10);
    containerTippy.appendChild(box8);
    containerTippy.appendChild(box4);
    containerTippy.appendChild(box2);
    containerTippy.appendChild(box1);
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
}

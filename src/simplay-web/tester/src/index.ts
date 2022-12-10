import { SimulationDataSerialized } from '../../src/SimulationDataSerialized';
import { SimulationSpooler } from '../../src/SimulationSpooler';

let data: SimulationDataSerialized;
const container = document.getElementById('simulationContainer');
let animation: SimulationSpooler;

async function readData(): Promise<void> {
  const response = await fetch('events.json', { cache: 'no-store' });
  data = await response.json();
}

async function init() {
  registerClicks();
  registerSpeedChangeListener();
  await readData();
  if (container) {
    animation = new SimulationSpooler(data, container);
  }
}

function registerClicks() {
  document.querySelector('#btnStart')?.addEventListener('click', async () => {
    animation.run();
  });
  document.querySelector('#btnPause')?.addEventListener('click', async () => {
    animation.pause();
  });
  document.querySelector('#btnReset')?.addEventListener('click', async () => {
    animation.reset();
  });
  document
    .querySelector('#btnNextStep')
    ?.addEventListener('click', async () => {
      animation.advanceOneStep();
    });
  document.querySelector('#btnSkip')?.addEventListener('click', async () => {
    const timestamp = parseInt(
      (document.querySelector('#skipToStep') as HTMLInputElement).value
    );
    animation.skipTo(timestamp);
  });
  document.querySelector('#btnIncreaseSpeed')?.addEventListener('click', () => {
    const newSpeed = animation.increaseSpeed(1);
    unregisterSpeedChangeListener();
    (document.querySelector('#speedFactor') as HTMLInputElement).value =
      newSpeed.toString();
    registerSpeedChangeListener();
  });
  document.querySelector('#btnDecreaseSpeed')?.addEventListener('click', () => {
    const newSpeed = animation.decreaseSpeed(1);
    unregisterSpeedChangeListener();
    (document.querySelector('#speedFactor') as HTMLInputElement).value =
      newSpeed.toString();
    registerSpeedChangeListener();
  });
}

function handleSpeedChange() {
  const speedFactor = parseInt(
    (document.querySelector('#speedFactor') as HTMLInputElement).value
  );
  animation.setSpeedFactor(speedFactor);
}

function unregisterSpeedChangeListener() {
  document
    .querySelector('#speedFactor')
    ?.removeEventListener('change', handleSpeedChange);
}

function registerSpeedChangeListener() {
  document
    .querySelector('#speedFactor')
    ?.addEventListener('change', handleSpeedChange);
}

init();

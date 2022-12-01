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
  await readData();
  if (container) {
    animation = new SimulationSpooler(data, container);
  }
}

function registerClicks() {
  document.querySelector('#btnStart')?.addEventListener('click', async () => {
    animation.run();
  });
}

init();

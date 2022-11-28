import { createGrid } from './Grid';
import { createContext, SimplayContext } from './SimplayContext';
import { SimulationData, simulationDataFactory } from './SimulationData';
import { SimulationDataSerialized } from './SimulationDataSerialized';
import { preloadImages } from './Visual';
import * as PIXI from 'pixi.js';
import * as PIXILAYERS from 'pixi-layers';

export class SimulationSpooler {
  private DOMContainer: HTMLElement;
  private simulationData: SimulationData;
  public readonly context: SimplayContext;

  constructor(
    simulationData: SimulationDataSerialized,
    container: HTMLElement
  ) {
    this.simulationData = simulationDataFactory(simulationData);
    preloadImages(this.simulationData.visuals);
    this.DOMContainer = container;
    const app = createApp(this.DOMContainer);
    this.context = createContext(app, this.simulationData);
    createGrid(this.context);
  }

  run(speedFactor = 1) {
    throw Error('TODO implement');
  }

  pause() {
    throw Error('TODO implement');
  }

  continue() {
    throw Error('TODO implement');
  }

  skipTo() {
    throw Error('TODO implement');
  }

  reset() {
    throw Error('TODO implement');
  }

  setSpeedFactor() {
    throw Error('TODO implement');
  }

  increaseSpeed(increaseBy: number) {
    throw Error('TODO implement');
  }

  decreaseSpeed(decreaseBy: number) {
    throw Error('TODO implement');
  }
}

function createApp(container: HTMLElement) {
  const app = new PIXI.Application({
    width: container.clientWidth,
    height: container.clientHeight,
    backgroundColor: 0xd3d3d3,
    antialias: true,
    powerPreference: 'high-performance',
  });
  container.appendChild(app.view as HTMLCanvasElement);

  app.stage = new PIXILAYERS.Stage();

  PIXI.settings.ROUND_PIXELS = true;
  PIXI.settings.MIPMAP_TEXTURES = PIXI.MIPMAP_MODES.ON;
  return app;
}

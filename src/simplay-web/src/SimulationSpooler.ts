import { createEntities } from './Entity';
import { create } from './Grid';
import { SimplayContext } from './SimplayContext';
import { SimplayGrid } from './SimplayGrid';
import { SimulationData, simulationDataFactory } from './SimulationData';
import { SimulationDataSerialized } from './SimulationDataSerialized';
import { preloadImages } from './Visual';
import * as PIXI from 'pixi.js';

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
    this.context = create(simulationData.grid, container);
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

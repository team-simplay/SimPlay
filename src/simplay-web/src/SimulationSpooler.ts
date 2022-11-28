import { createEntities, Entity } from './Entity';
import { Event } from './event/Event';
import { create } from './Grid';
import { SimplayGrid } from './SimplayGrid';
import { SimulationData, simulationDataFactory } from './SimulationData';
import { SimulationDataSerialized } from './SimulationDataSerialized';
import { Visual } from './Visual';
import * as PIXI from 'pixi.js';

export class SimulationSpooler {
  private DOMContainer: HTMLElement;
  private simulationData: SimulationData;

  constructor(
    simulationData: SimulationDataSerialized,
    container: HTMLElement
  ) {
    this.simulationData = simulationDataFactory(simulationData);
    this.DOMContainer = container;
    create(simulationData.grid, container);
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

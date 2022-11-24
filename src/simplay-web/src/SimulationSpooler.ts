import { Entity } from './Entity';
import { Event } from './Event';
import { create } from './Grid';
import { SimplayGrid } from './SimplayGrid';
import { SimulationData } from './SimulationData';
import { Visual } from './Visual';

export class SimulationSpooler {
  private DOMContainer: HTMLElement;
  private simulationData: SimulationData;

  constructor(simulationData: SimulationData, container: HTMLElement) {
    this.simulationData = simulationData;
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

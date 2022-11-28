import { createEntities } from './Entity';
import { create } from './Grid';
import { SimulationData, simulationDataFactory } from './SimulationData';
import { SimulationDataSerialized } from './SimulationDataSerialized';
import { preloadImages } from './Visual';
import * as PIXI from 'pixi.js';

export class SimulationSpooler {
  private DOMContainer: HTMLElement;
  private simulationData: SimulationData;

  constructor(
    simulationData: SimulationDataSerialized,
    container: HTMLElement
  ) {
    this.simulationData = simulationDataFactory(simulationData);
    preloadImages(this.simulationData.visuals);
    this.DOMContainer = container;
    const app = create(simulationData.grid, container);
    const context = {
      tileHeight: app.renderer.height / simulationData.grid.rows,
      tileWidth: app.renderer.width / simulationData.grid.cols,
      app,
      simulationData: this.simulationData,
      areaContainer: app.stage,
      entityContainer: new PIXI.Container(),
      interactionContainer: new PIXI.Container(),
    };
    app.stage.addChild(context.entityContainer);
    app.stage.addChild(context.interactionContainer);
    createEntities(context, simulationData.entities);

    context.entityContainer.getChildAt(0).x = 100;
    context.entityContainer.getChildAt(0).y = 100;
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

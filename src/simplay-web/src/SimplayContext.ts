import * as PIXI from 'pixi.js';
import { SimulationData } from './SimulationData';

export interface SimplayContext {
  tileHeight: number;
  tileWidth: number;
  simulationData: SimulationData;
  app: PIXI.Application;
  areaContainer: PIXI.Container;
  entityContainer: PIXI.Container;
  interactionContainer: PIXI.Container;
}

export function createContext(
  app: PIXI.Application,
  simulationData: SimulationData
): SimplayContext {
  const context: SimplayContext = {
    tileHeight: app.screen.height / simulationData.grid.rows,
    tileWidth: app.screen.width / simulationData.grid.cols,
    simulationData: simulationData,
    app: app,
    areaContainer: new PIXI.Container(),
    entityContainer: new PIXI.Container(),
    interactionContainer: new PIXI.Container(),
  };
  context.areaContainer.name = 'areaContainer';
  context.entityContainer.name = 'entityContainer';
  context.interactionContainer.name = 'interactionContainer';
  app.stage.addChild(context.areaContainer);
  app.stage.addChild(context.entityContainer);
  app.stage.addChild(context.interactionContainer);
  return context;
}

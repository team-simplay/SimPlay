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

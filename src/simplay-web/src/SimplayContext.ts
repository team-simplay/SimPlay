import * as PIXI from 'pixi.js';
import { SimulationData } from './SimulationData';

export interface SimplayContext {
  tileHeight: number;
  tileWidth: number;
  app: PIXI.Application;
  simulationData: SimulationData;
  areaContainer: PIXI.Container;
  entityContainer: PIXI.Container;
  interactionContainer: PIXI.Container;
}

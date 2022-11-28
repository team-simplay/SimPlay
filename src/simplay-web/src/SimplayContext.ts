import * as PIXI from 'pixi.js';


export interface SimplayContext {
  tileHeight: number;
  tileWidth: number;
  app: PIXI.Application;
  areaContainer: PIXI.Container;
  entityContainer: PIXI.Container;
  interactionContainer: PIXI.Container;
}

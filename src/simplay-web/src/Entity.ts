import { SimplayContext } from './SimplayContext';

export type EntityType =
  | 'CUSTOM'
  | 'STORE'
  | 'CONTAINER'
  | 'RESOURCE'
  | 'PROCESS';

export interface Entity {
  id: string;
  type: string;
  graphic: string;
  tint: number;
}

export function createEntities(context: SimplayContext, entities: Entity[]) {
  for (const entity of entities) {
    const sprite = context.app.loader.resources[entity.graphic].texture;
    const entitySprite = new PIXI.Sprite(sprite);
    entitySprite.tint = entity.tint;
    entitySprite.x = 0;
    entitySprite.y = 0;
    context.entityContainer.addChild(entitySprite);
  }
}

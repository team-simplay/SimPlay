import { SimplayContext } from './SimplayContext';
import * as PIXI from 'pixi.js';

export type EntityType =
  | 'CUSTOM'
  | 'STORE'
  | 'CONTAINER'
  | 'RESOURCE'
  | 'PROCESS';

export interface Entity {
  id: string;
  type: string;
  visual: string;
  tint: number;
}

export function createEntities(context: SimplayContext, entities: Entity[]) {
  for (const entity of entities) {
    const frames = context.simulationData.visuals.find(
      (visual) => visual.id === entity.visual
    )?.frames;
    if (!frames || frames.length === 0) {
      throw new Error(`No frames found for visual ${entity.visual}`);
    }
    const sprite = new PIXI.AnimatedSprite(
      frames.map((frame) => PIXI.Texture.from(frame))
    );
    sprite.animationSpeed = 0;
    sprite.loop = false;
    const { width, height } = sprite.getBounds();
    const scale = Math.min(
      context.tileWidth / width,
      context.tileHeight / height
    );
    sprite.scale.set(scale * 0.5, scale * 0.5);
    sprite.name = entity.id;
    if (entity.tint && entity.tint !== 0xffffff) {
      sprite.tint = entity.tint;
    }
    sprite.visible = false;

    context.entityContainer.addChild(sprite);
  }
}

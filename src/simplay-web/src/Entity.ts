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

export function getEntityDisplayObjectById(
  context: SimplayContext,
  id: string
): PIXI.DisplayObject {
  const entity = context.entityContainer.getChildByName(id);
  if (!entity) {
    throw new Error(`Entity with id ${id} not found`);
  }
  return entity;
}

export async function createEntities(context: SimplayContext) {
  for (const entity of context.simulationData.entities) {
    const frames = context.simulationData.visuals.find(
      (visual) => visual.id === entity.visual
    )?.frames;
    if (!frames) {
      throw new Error(`No visual found for entity ${entity.id}`);
    }
    if (frames.length === 0) {
      throw new Error(`No frames found for visual ${entity.visual}`);
    }
    const loadedFrames: PIXI.Texture[] = [];
    for (const frame of frames) {
      const loadedFrame = await PIXI.Texture.fromURL(frame);
      loadedFrames.push(loadedFrame);
    }
    const sprite = new PIXI.AnimatedSprite(loadedFrames);
    sprite.animationSpeed = 0;
    sprite.loop = false;
    const { width, height } = sprite.getBounds();
    const scale = Math.min(
      context.tileWidth / width,
      context.tileHeight / height
    );
    // multiplying by 0.5 is a design choice to make the entities look a bit smaller
    sprite.scale.set(scale * 0.5, scale * 0.5);
    sprite.name = entity.id;
    if (entity.tint && entity.tint !== 0xffffff) {
      sprite.tint = entity.tint;
    }
    sprite.visible = false;

    context.entityContainer.addChild(sprite);
  }
}

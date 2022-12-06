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

export interface ContainerEntity extends Entity {
  type: 'CONTAINER';
  capacity: number;
  level: number;
}

export interface DisplayEntity {
  animatedSprite: PIXI.AnimatedSprite;
  decoratingText: PIXI.Text;
  container: PIXI.Container;
}

export interface ExtendedDisplayEntity extends DisplayEntity {
  informationText: PIXI.Text;
}

export function getEntityDisplayObjectById(
  context: SimplayContext,
  id: string
): DisplayEntity {
  const entity = context.entityDictionary[id];
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
    const sprite = await createAnimatedSprite(context, entity, frames);
    const text = createDecoratingText(entity);
    text.y = sprite.y + sprite.height + 1;
    text.x = sprite.x + sprite.width / 2;

    const container = new PIXI.Container();
    container.name = entity.id;
    container.addChild(sprite);
    container.addChild(text);
    container.visible = false;

    let displayEntity = {
      animatedSprite: sprite,
      decoratingText: text,
      container: container,
    } as DisplayEntity;

    if (
      entity.type === 'CONTAINER' ||
      entity.type === 'STORE' ||
      entity.type === 'RESOURCE'
    ) {
      const informationText = createInformationText(entity);
      informationText.y = sprite.y + sprite.height + 6;
      informationText.x = sprite.x + sprite.width / 2;
      container.addChild(informationText);
      displayEntity = {
        ...displayEntity,
        informationText: informationText,
      } as ExtendedDisplayEntity;
    }

    context.entityContainer.addChild(container);
    context.entityDictionary[entity.id] = displayEntity;
  }
}

function createDecoratingText(entity: Entity): PIXI.Text {
  const text = new PIXI.Text(entity.id, {
    fontFamily: 'Arial',
    fontSize: 12,
    fill: 0xffffff,
    align: 'center',
  });
  text.anchor.set(0.5, 0.5);
  text.name = `${entity.id}-text`;
  return text;
}

function createInformationText(entity: Entity): PIXI.Text {
  const text = new PIXI.Text(entity.id, {
    fontFamily: 'Arial',
    fontSize: 12,
    fill: 0xffffff,
    align: 'center',
  });
  text.anchor.set(0.5, 0.5);
  text.name = `${entity.id}-text-information`;
  text.text = '';
  return text;
}

async function createAnimatedSprite(
  context: SimplayContext,
  entity: Entity,
  frames: string[]
): Promise<PIXI.AnimatedSprite> {
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
  sprite.name = `${entity.id}-sprite`;
  if (entity.tint && entity.tint !== 0xffffff) {
    sprite.tint = entity.tint;
  }

  return sprite;
}

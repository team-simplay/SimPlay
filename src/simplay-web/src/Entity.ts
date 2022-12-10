import { SimplayContext } from './SimplayContext';
import * as PIXI from 'pixi.js';
import { StoreContentItem } from './event/StoreSetContentEventArgs';
import { InteractionLine } from './event/InteractionLine';

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

export interface StoreEntity extends Entity {
  type: 'STORE';
  capacity: number;
  content: StoreContentItem[];
}

export interface ResourceEntity extends Entity {
  type: 'RESOURCE';
  capacity: number;
  utilization: number;
}

export interface DisplayEntity {
  animatedSprite: PIXI.AnimatedSprite;
  decoratingText: PIXI.Text;
  container: PIXI.Container;
  outgoingInteractions: Map<string, InteractionLine>;
  incomingInteractions: Map<string, InteractionLine>;
}

export interface ExtendedDisplayEntity extends DisplayEntity {
  informationText: PIXI.Text;
}

export function resetDisplayEntity(
  displayEntity: DisplayEntity,
  originalTint: number
) {
  displayEntity.container.visible = false;
  displayEntity.animatedSprite.currentFrame = 0;
  displayEntity.animatedSprite.tint = originalTint;
  displayEntity.container.x = 0;
  displayEntity.container.y = 0;
  displayEntity.decoratingText.text = '';
  displayEntity.outgoingInteractions.forEach((interactionLine) => {
    interactionLine.destroy();
  });
  displayEntity.outgoingInteractions.clear();
  // we do not need to loop through incomingInteractions, because they
  // are present in outgoingInteractions of the other entity
  displayEntity.incomingInteractions.clear();
  if ((displayEntity as ExtendedDisplayEntity).informationText) {
    (displayEntity as ExtendedDisplayEntity).informationText.text = '';
  }
}

export function getEntityDisplayObjectById(
  context: SimplayContext,
  id: string
): DisplayEntity {
  const entity = context.entityDictionary.get(id);
  if (!entity) {
    throw new Error(`Entity with id ${id} not found`);
  }
  return entity;
}

const verticalOffsetDecoratingText = 1;
const centerFactor = 0.5;

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
    text.y = sprite.y + sprite.height + verticalOffsetDecoratingText;
    text.x = sprite.x + sprite.width / centerFactor;

    const container = new PIXI.Container();
    container.name = entity.id;
    container.addChild(sprite);
    container.addChild(text);
    container.visible = false;

    let displayEntity = {
      animatedSprite: sprite,
      decoratingText: text,
      container: container,
      outgoingInteractions: new Map<string, InteractionLine>(),
      incomingInteractions: new Map<string, InteractionLine>(),
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
    context.entityDictionary.set(entity.id, displayEntity);
  }
}

const textStyle = new PIXI.TextStyle({
  fontFamily: 'Arial',
  fontSize: 12,
  fill: 0xffffff,
  align: 'center',
});

function createDecoratingText(entity: Entity): PIXI.Text {
  const text = new PIXI.Text(entity.id, textStyle);
  text.anchor.set(0.5, 0.5);
  text.name = `${entity.id}-text`;
  text.text = '';
  return text;
}

function createInformationText(entity: Entity): PIXI.Text {
  const text = new PIXI.Text(entity.id, textStyle);
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

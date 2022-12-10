import {
  createEntities,
  getEntityDisplayObjectById,
  resetDisplayEntity,
} from '../src/Entity';
import * as PIXI from 'pixi.js';
import * as PIXILAYERS from '@pixi/layers';
import { expect } from 'chai';
import { createContext } from '../src/SimplayContext';
import { SimulationData } from '../src/SimulationData';
import { getTestGrid } from './event/getTestGrid';
import { spy, when } from 'ts-mockito';
import chaiAsPromised from 'chai-as-promised';
import { ExtendedDisplayEntity } from '../src/Entity';
import * as chai from 'chai';
import { InteractionLine } from '../src/event/InteractionLine';
chai.use(chaiAsPromised);

// ensures that no URL is actually loaded
const spyTexture = spy(PIXI.Texture);
when(spyTexture.fromURL('frame1.png')).thenResolve(PIXI.Texture.WHITE);
when(spyTexture.fromURL('frame2.png')).thenResolve(PIXI.Texture.WHITE);

describe('Entity tests', async function () {
  const entities = [
    {
      id: 'entity1',
      name: 'Entity 1',
      tint: 0x4512fa,
      type: 'CUSTOM',
      visual: 'visual1',
    },
  ];
  const visuals = [
    {
      id: 'visual1',
      frames: ['frame1.png', 'frame2.png'],
    },
  ];
  const simulationData = {
    visuals,
    entities,
    grid: getTestGrid(),
    events: [],
  } as SimulationData;

  it('should initialize correctly', async () => {
    const app = new PIXI.Application({
      width: 500,
      height: 500,
    });
    app.stage = new PIXILAYERS.Stage();
    const context = createContext(app, simulationData);

    await createEntities(context);
    expect(context.entityContainer.children.length).to.equal(1);
    const container = context.entityContainer.children[0] as PIXI.Container;
    expect(container.visible).to.equal(false);
    expect(container.children.length).to.equal(2);
    const entity = container.children[0] as PIXI.AnimatedSprite;
    expect(entity).to.be.an.instanceof(PIXI.AnimatedSprite);
    expect(entity.tint).to.equal(entities[0].tint);
    expect(entity.animationSpeed).to.equal(0);
    expect(entity.loop).to.equal(false);
    expect(entity.textures.length).to.equal(2);
    expect(entity.currentFrame).to.equal(0);
    expect(entity.position.x).to.equal(0);
    expect(entity.position.y).to.equal(0);
    const text = container.children[1] as PIXI.Text;
    expect(text).to.be.an.instanceof(PIXI.Text);
  });

  it('should not set a tint if tint is white', async () => {
    const app = new PIXI.Application({
      width: 500,
      height: 500,
    });
    app.stage = new PIXILAYERS.Stage();
    const simData = {
      ...simulationData,
      entities: [
        {
          id: 'entity1',
          name: 'Entity 1',
          type: 'CUSTOM',
          tint: 0xffffff,
          visual: 'visual1',
        },
      ],
    };
    const context = createContext(app, simData);
    await createEntities(context);
    expect(context.entityContainer.children.length).to.equal(1);
    const container = context.entityContainer.children[0] as PIXI.Container;
    const entity = container.children[0] as PIXI.AnimatedSprite;
    expect(entity.tint).to.equal(0xffffff);
  });

  it('should be named correctly and be inside the container', async () => {
    const app = new PIXI.Application({
      width: 500,
      height: 500,
    });
    app.stage = new PIXILAYERS.Stage();
    const context = createContext(app, simulationData);

    await createEntities(context);
    const entity = context.entityContainer.children[0] as PIXI.AnimatedSprite;
    expect(entity.name).to.equal(entities[0].id);
    expect(entity.parent).to.equal(context.entityContainer);
  });

  it('should throw if there are no frames for the visual', async () => {
    const app = new PIXI.Application({
      width: 500,
      height: 500,
    });
    app.stage = new PIXILAYERS.Stage();
    const frames = simulationData.visuals[0].frames;
    simulationData.visuals[0].frames = [];
    const context = createContext(app, simulationData);

    await expect(createEntities(context)).to.eventually.be.rejectedWith(
      'No frames found for visual visual1'
    );
    simulationData.visuals[0].frames = frames;
  });

  it('should throw if there is no visual', async () => {
    const app = new PIXI.Application({
      width: 500,
      height: 500,
    });
    app.stage = new PIXILAYERS.Stage();
    const simData = {
      ...simulationData,
      visuals: [],
    };
    const context = createContext(app, simData);

    await expect(createEntities(context)).to.eventually.be.rejectedWith(
      'No visual found for entity entity1'
    );
  });

  it('should create an information text for the appropriate types', async () => {
    const app = new PIXI.Application({
      width: 500,
      height: 500,
    });
    app.stage = new PIXILAYERS.Stage();
    const simData = {
      ...simulationData,
      entities: [
        {
          id: 'container1',
          name: 'CONTAINER1',
          type: 'CONTAINER',
          tint: 0xffffff,
          visual: 'visual1',
        },
        {
          id: 'resource1',
          name: 'RESOURCE1',
          type: 'RESOURCE',
          tint: 0xffffff,
          visual: 'visual1',
        },
        {
          id: 'store1',
          name: 'STORE1',
          type: 'STORE',
          tint: 0xffffff,
          visual: 'visual1',
        },
      ],
    };
    const context = createContext(app, simData);
    await createEntities(context);
    expect(context.entityContainer.children.length).to.equal(3);
    expect(
      (context.entityDictionary.get('container1') as ExtendedDisplayEntity)
        .informationText
    ).to.not.be.null.and.not.be.undefined;
    expect(
      (context.entityDictionary.get('resource1') as ExtendedDisplayEntity)
        .informationText
    ).to.not.be.null.and.not.be.undefined;
    expect(
      (context.entityDictionary.get('store1') as ExtendedDisplayEntity)
        .informationText
    ).to.not.be.null.and.not.be.undefined;
  });
});

describe('getEntityDisplayObjectById tests', async function () {
  const entities = [
    {
      id: 'entity1',
      name: 'Entity 1',
      tint: 0x4512fa,
      type: 'CUSTOM',
      visual: 'visual1',
    },
  ];
  const visuals = [
    {
      id: 'visual1',
      frames: ['frame1.png', 'frame2.png'],
    },
  ];
  const simulationData = {
    visuals,
    entities,
    grid: getTestGrid(),
    events: [],
  } as SimulationData;

  it('should return the correct entity', async () => {
    const app = new PIXI.Application({
      width: 500,
      height: 500,
    });
    app.stage = new PIXILAYERS.Stage();
    const context = createContext(app, simulationData);

    await createEntities(context);
    const container = context.entityContainer.children[0] as PIXI.Container;
    const entity = container.children[0] as PIXI.AnimatedSprite;
    const text = container.children[1] as PIXI.Text;
    const displayEntity = getEntityDisplayObjectById(context, 'entity1');
    expect(displayEntity.animatedSprite).to.equal(entity);
    expect(displayEntity.decoratingText).to.equal(text);
    expect(displayEntity.container).to.equal(container);
  });

  it('should throw if the entity does not exist', async () => {
    const app = new PIXI.Application({
      width: 500,
      height: 500,
    });
    app.stage = new PIXILAYERS.Stage();
    const context = createContext(app, simulationData);

    await createEntities(context);
    expect(() => getEntityDisplayObjectById(context, 'entity2')).to.throw(
      'Entity with id entity2 not found'
    );
  });

  it('should reset the entities if requested to do so', async () => {
    const app = new PIXI.Application({
      width: 500,
      height: 500,
    });
    app.stage = new PIXILAYERS.Stage();
    const context = createContext(app, simulationData);

    await createEntities(context);
    // change up some things, so that reset does something
    const displayEntity = getEntityDisplayObjectById(context, 'entity1');
    displayEntity.animatedSprite.tint = 0xcafe42;
    displayEntity.decoratingText.text = 'new text';
    displayEntity.container.x = 42;
    displayEntity.container.y = 42;
    displayEntity.container.visible = true;
    displayEntity.outgoingInteractions.set(
      'entity1',
      new InteractionLine(displayEntity, displayEntity, context)
    );
    resetDisplayEntity(displayEntity, context.simulationData.entities[0].tint);
    expect(displayEntity.animatedSprite.tint).to.equal(0x4512fa);
    expect(displayEntity.decoratingText.text).to.equal('');
    expect(displayEntity.container.x).to.equal(0);
    expect(displayEntity.container.y).to.equal(0);
    expect(displayEntity.container.visible).to.be.false;
    expect(displayEntity.outgoingInteractions.size).to.equal(0);
  });
});

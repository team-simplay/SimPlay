import { createEntities } from '../src/Entity';
import * as PIXI from 'pixi.js';
import * as PIXILAYERS from '@pixi/layers';
import { expect } from 'chai';
import { createContext } from '../src/SimplayContext';
import { SimulationData } from '../src/SimulationData';
import { getTestGrid } from './event/getTestGrid';
import { mock, spy, when } from 'ts-mockito';
import chaiAsPromised from 'chai-as-promised';
import * as chai from 'chai';
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
    const entity = context.entityContainer.children[0] as PIXI.AnimatedSprite;
    expect(entity).to.be.an.instanceof(PIXI.AnimatedSprite);
    expect(entity.tint).to.equal(entities[0].tint);
    expect(entity.animationSpeed).to.equal(0);
    expect(entity.loop).to.equal(false);
    expect(entity.textures.length).to.equal(2);
    expect(entity.currentFrame).to.equal(0);
    expect(entity.position.x).to.equal(0);
    expect(entity.position.y).to.equal(0);
    expect(entity.visible).to.equal(false);
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
    const entity = context.entityContainer.children[0] as PIXI.AnimatedSprite;
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
    simulationData.visuals[0].frames = [];
    const context = createContext(app, simulationData);

    await expect(createEntities(context)).to.eventually.be.rejectedWith(
      'No frames found for visual visual1'
    );
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
});

import { createEntities, getEntityById } from '../src/Entity';
import * as PIXI from 'pixi.js';
import * as PIXILAYERS from '@pixi/layers';
import { expect } from 'chai';
import { createContext } from '../src/SimplayContext';
import { SimulationData } from '../src/SimulationData';
import { getTestGrid } from './event/getTestGrid';

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

describe('Entity tests', function () {
  it('should initialize correctly', async () => {
    const app = new PIXI.Application({
      width: 500,
      height: 500,
    });
    app.stage = new PIXILAYERS.Stage();
    const context = createContext(app, simulationData);

    createEntities(context);
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

  it('should not set a tint if tint is white', () => {
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
    createEntities(context);
    expect(context.entityContainer.children.length).to.equal(1);
    const entity = context.entityContainer.children[0] as PIXI.AnimatedSprite;
    expect(entity.tint).to.equal(0xffffff);
  });

  it('should be named correctly and be inside the container', () => {
    const app = new PIXI.Application({
      width: 500,
      height: 500,
    });
    app.stage = new PIXILAYERS.Stage();
    const context = createContext(app, simulationData);

    createEntities(context);
    const entity = context.entityContainer.children[0] as PIXI.AnimatedSprite;
    expect(entity.name).to.equal(entities[0].id);
    expect(entity.parent).to.equal(context.entityContainer);
  });

  it('should throw if there are no frames for the visual', () => {
    const app = new PIXI.Application({
      width: 500,
      height: 500,
    });
    app.stage = new PIXILAYERS.Stage();
    simulationData.visuals[0].frames = [];
    const context = createContext(app, simulationData);

    expect(() => createEntities(context)).to.throw(
      `No frames found for visual ${entities[0].visual}`
    );
  });

  it('should throw if there is no visual', () => {
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

    expect(() => createEntities(context)).to.throw(
      `No visual found for entity ${entities[0].id}`
    );
  });
});

describe('getEntityById tests', function () {
  it('should return the entity', () => {
    const app = new PIXI.Application({
      width: 500,
      height: 500,
    });
    app.stage = new PIXILAYERS.Stage();
    const context = createContext(app, simulationData);

    createEntities(context);
    const entity = getEntityById(context, 'entity1');
    expect(entity).to.not.be.undefined;
    expect(entity?.name).to.equal('entity1');
  });

  it('should throw if the entity does not exist', () => {
    const app = new PIXI.Application({
      width: 500,
      height: 500,
    });
    app.stage = new PIXILAYERS.Stage();
    const context = createContext(app, simulationData);

    createEntities(context);
    expect(() => getEntityById(context, 'entity2')).to.throw(
      'Entity with id entity2 not found'
    );
  });
});

import { createEntities } from '../src/Entity';
import * as PIXI from 'pixi.js';
import * as PIXILAYERS from '@pixi/layers';
import { expect } from 'chai';
import { mock, instance } from 'ts-mockito';
import { SimulationDataSerialized } from '../src/SimulationDataSerialized';
import { createContext } from '../src/SimplayContext';
import { SimulationData } from '../src/SimulationData';

describe('Entity tests', function () {
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
    grid: {
      cols: 5,
      rows: 5,
      areas: [
        {
          id: 'area1',
          name: 'Area 1',
          color: 0x1234af,
          gridDefinition: {
            x: 1,
            y: 1,
            width: 2,
            height: 2,
          },
        },
      ],
    },
    events: [],
  } as SimulationData;

  it('should initialize correctly', () => {
    const app = new PIXI.Application({
      width: 500,
      height: 500,
    });
    app.stage = new PIXILAYERS.Stage();
    const context = createContext(app, simulationData);

    createEntities(context, simulationData.entities);
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

  it('should be named correctly and be inside the container', () => {
    const app = new PIXI.Application({
      width: 500,
      height: 500,
    });
    app.stage = new PIXILAYERS.Stage();
    const context = createContext(app, simulationData);

    createEntities(context, simulationData.entities);
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

    expect(() => createEntities(context, simulationData.entities)).to.throw(
      `No frames found for visual ${entities[0].visual}`
    );
  });
});

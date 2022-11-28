import { createEntities } from '../src/Entity';
import * as PIXI from 'pixi.js';
import { expect } from 'chai';
import { mock, when, instance } from 'ts-mockito';
import { SimulationDataSerialized } from '../src/SimulationDataSerialized';
import { create } from '../src/Grid';

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
  } as SimulationDataSerialized;
  const containerMock = mock(HTMLElement);
  const container = instance(containerMock);

  it('should initialize correctly', () => {
    const context = create(simulationData.grid, container);

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
  });

  it('should be named correctly and be inside the container', () => {
    const context = create(simulationData.grid, container);

    createEntities(context, simulationData.entities);
    const entity = context.entityContainer.children[0] as PIXI.AnimatedSprite;
    expect(entity.name).to.equal(entities[0].id);
    expect(entity.parent).to.equal(context.entityContainer);
  });
});

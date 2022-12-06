import { ResourceSetUtilizationEvent } from '../../src/event/ResourceSetUtilizationEvent';
import { expect } from 'chai';
import { ResourceSetUtilizationEventArgs } from '../../src/event/ResourceSetUtilizationEventArgs';
import { EventAction } from '../../src/event/EventAction';
import { instance, mock, spy, when } from 'ts-mockito';
import * as PIXI from 'pixi.js';
import { getTestGrid } from './getTestGrid';
import { SimulationDataSerialized } from '../../src/SimulationDataSerialized';
import { SimulationSpooler } from '../../src/SimulationSpooler';
import {
  ResourceEntity,
  ExtendedDisplayEntity,
  getEntityDisplayObjectById,
} from '../../src/Entity';

const forId = 'leet';
const timestamp = 1337;
const utilization = 0.78;

const fromUrlSpy = spy(PIXI.Texture);
when(fromUrlSpy.fromURL('frame1.png')).thenResolve(PIXI.Texture.WHITE);
when(fromUrlSpy.fromURL('frame2.png')).thenResolve(PIXI.Texture.WHITE);

const simData = {
  entities: [
    {
      id: 'leet',
      visual: 'RESOURCE',
      type: 'RESOURCE',
      tint: 0xffffff,
    },
  ],
  visuals: [
    {
      id: 'RESOURCE',
      frames: ['frame1.png', 'frame2.png'],
    },
  ],
  events: [],
  grid: getTestGrid(),
} as SimulationDataSerialized;

describe('ResourceSetUtilizationEvent tests', function () {
  it('should initialize correctly', () => {
    const args = new ResourceSetUtilizationEventArgs({
      utilization: utilization,
    });
    const event = new ResourceSetUtilizationEvent(forId, timestamp, args);
    expect(event.forId).to.equal(forId);
    expect(event.timestamp).to.equal(timestamp);
    expect(event.action).to.equal(EventAction.RESOURCE_SET_UTILIZATION);
    expect(event.args.utilization).to.equal(utilization);
  });

  it('should update the entity correctly', async () => {
    const args = new ResourceSetUtilizationEventArgs({
      utilization: utilization,
    });
    const event = new ResourceSetUtilizationEvent(forId, timestamp, args);
    const containerMock = mock(HTMLDivElement);
    const container = instance(containerMock);

    const spooler = new SimulationSpooler(simData, container);
    await new Promise((resolve) => setTimeout(resolve, 100));
    event.execute(spooler.context);
    expect(
      (
        spooler.context.simulationData.entities.find(
          (entity) => entity.id === forId
        ) as ResourceEntity
      ).utilization
    ).to.equal(utilization);
  });

  it('should update the text correctly', async () => {
    const args = new ResourceSetUtilizationEventArgs({
      utilization: utilization,
    });
    const event = new ResourceSetUtilizationEvent(forId, timestamp, args);
    const containerMock = mock(HTMLDivElement);
    const container = instance(containerMock);

    const spooler = new SimulationSpooler(simData, container);
    await new Promise((resolve) => setTimeout(resolve, 100));

    // set the capacity to 0 so the text is predictable
    (
      spooler.context.simulationData.entities.find(
        (entity) => entity.id === forId
      ) as ResourceEntity
    ).capacity = 0;

    event.execute(spooler.context);
    const displayObject = getEntityDisplayObjectById(
      spooler.context,
      forId
    ) as ExtendedDisplayEntity;
    expect(displayObject.informationText.text).to.equal(`${utilization} / 0`);
  });
});

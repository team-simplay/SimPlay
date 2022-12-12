import { ResourceSetCapacityEvent } from '../../src/event/ResourceSetCapacityEvent';
import { expect } from 'chai';
import { ResourceSetCapacityEventArgs } from '../../src/event/ResourceSetCapacityEventArgs';
import { EventAction } from '../../src/event/EventAction';
import { instance, mock } from 'ts-mockito';
import { getTestGrid } from './getTestGrid';
import { SimulationDataSerialized } from '../../src/SimulationDataSerialized';
import { SimulationSpooler } from '../../src/SimulationSpooler';
import {
  ExtendedDisplayEntity,
  getEntityDisplayObjectById,
  ResourceEntity,
} from '../../src/Entity';
import { EMOJI, TRANSPARENT_PIXEL } from './testImages';

const forId = 'leet';
const timestamp = 1337;
const capacity = 1492;

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
      frames: [TRANSPARENT_PIXEL, EMOJI],
    },
  ],
  events: [],
  grid: getTestGrid(),
} as SimulationDataSerialized;

describe('ResourceSetCapacityEvent tests', function () {
  it('should initialize correctly', () => {
    const args = new ResourceSetCapacityEventArgs({ capacity: capacity });
    const event = new ResourceSetCapacityEvent(forId, timestamp, args);
    expect(event.forId).to.equal(forId);
    expect(event.timestamp).to.equal(timestamp);
    expect(event.action).to.equal(EventAction.RESOURCE_SET_CAPACITY);
    expect(event.args.capacity).to.equal(capacity);
  });

  it('should update the entity correctly', async () => {
    const args = new ResourceSetCapacityEventArgs({ capacity: capacity });
    const event = new ResourceSetCapacityEvent(forId, timestamp, args);
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
      ).capacity
    ).to.equal(capacity);
  });

  it('should update the text correctly', async () => {
    const args = new ResourceSetCapacityEventArgs({ capacity: capacity });
    const event = new ResourceSetCapacityEvent(forId, timestamp, args);
    const containerMock = mock(HTMLDivElement);
    const container = instance(containerMock);

    const spooler = new SimulationSpooler(simData, container);
    await new Promise((resolve) => setTimeout(resolve, 100));

    // set the utilization to 0 so the text is predictable
    (
      spooler.context.simulationData.entities.find(
        (entity) => entity.id === forId
      ) as ResourceEntity
    ).utilization = 0;

    event.execute(spooler.context);
    const displayObject = getEntityDisplayObjectById(
      spooler.context,
      forId
    ) as ExtendedDisplayEntity;
    expect(displayObject.informationText.text).to.equal(`0 / ${capacity}`);
  });
});

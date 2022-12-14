import { ContainerSetCapacityEvent } from '../../src/event/ContainerSetCapacityEvent';
import { expect } from 'chai';
import { ContainerSetCapacityEventArgs } from '../../src/event/ContainerSetCapacityEventArgs';
import { EventAction } from '../../src/event/EventAction';
import { instance, mock } from 'ts-mockito';
import { getTestGrid } from './getTestGrid';
import { SimulationDataSerialized } from '../../src/SimulationDataSerialized';
import { SimulationSpooler } from '../../src/SimulationSpooler';
import {
  ContainerEntity,
  ExtendedDisplayEntity,
  getEntityDisplayObjectById,
} from '../../src/Entity';
import { EMOJI, TRANSPARENT_PIXEL } from './testImages';

const forId = 'leet';
const timestamp = 1337;
const capacity = 1848;

const simData = {
  entities: [
    {
      id: 'leet',
      visual: 'CONTAINER',
      type: 'CONTAINER',
      tint: 0xffffff,
    },
  ],
  visuals: [
    {
      id: 'CONTAINER',
      frames: [TRANSPARENT_PIXEL, EMOJI],
    },
  ],
  events: [],
  grid: getTestGrid(),
} as SimulationDataSerialized;

describe('ContainerSetCapacityEvent tests', function () {
  it('should initialize correctly', () => {
    const args = new ContainerSetCapacityEventArgs({ capacity: capacity });
    const event = new ContainerSetCapacityEvent(forId, timestamp, args);
    expect(event.forId).to.equal(forId);
    expect(event.timestamp).to.equal(timestamp);
    expect(event.action).to.equal(EventAction.CONTAINER_SET_CAPACITY);
    expect(event.args.capacity).to.equal(capacity);
  });

  it('should update the entity correctly', async () => {
    const args = new ContainerSetCapacityEventArgs({ capacity: capacity });
    const event = new ContainerSetCapacityEvent(forId, timestamp, args);
    const containerMock = mock(HTMLDivElement);
    const container = instance(containerMock);

    const spooler = new SimulationSpooler(simData, container);
    await new Promise((resolve) => setTimeout(resolve, 10));

    event.execute(spooler.context);
    expect(
      (
        spooler.context.simulationData.entities.find(
          (entity) => entity.id === forId
        ) as ContainerEntity
      ).capacity
    ).to.equal(capacity);
  });

  it('should update the entity correctly when capacity is 0', async () => {
    const args = new ContainerSetCapacityEventArgs({ capacity: 0 });
    const event = new ContainerSetCapacityEvent(forId, timestamp, args);
    const containerMock = mock(HTMLDivElement);
    const container = instance(containerMock);

    const spooler = new SimulationSpooler(simData, container);
    await new Promise((resolve) => setTimeout(resolve, 10));

    event.execute(spooler.context);
    expect(
      (
        spooler.context.simulationData.entities.find(
          (entity) => entity.id === forId
        ) as ContainerEntity
      ).capacity
    ).to.equal(0);
  });

  it('should update the text correctly', async () => {
    const args = new ContainerSetCapacityEventArgs({ capacity: capacity });
    const event = new ContainerSetCapacityEvent(forId, timestamp, args);
    const containerMock = mock(HTMLDivElement);
    const container = instance(containerMock);

    const spooler = new SimulationSpooler(simData, container);
    await new Promise((resolve) => setTimeout(resolve, 10));

    // set the level to 0 so the text is predictable
    (
      spooler.context.simulationData.entities.find(
        (entity) => entity.id === forId
      ) as ContainerEntity
    ).level = 0;

    event.execute(spooler.context);
    const displayObject = getEntityDisplayObjectById(
      spooler.context,
      forId
    ) as ExtendedDisplayEntity;
    expect(displayObject.informationText.text).to.equal(`0 / ${capacity}`);
  });
});

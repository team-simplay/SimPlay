import { ContainerSetLevelEvent } from '../../src/event/ContainerSetLevelEvent';
import { expect } from 'chai';
import { ContainerSetLevelEventArgs } from '../../src/event/ContainerSetLevelEventArgs';
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
const level = 1848;

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

describe('ContainerSetLevelEvent tests', function () {
  it('should initialize correctly', () => {
    const args = new ContainerSetLevelEventArgs({ level: level });
    const event = new ContainerSetLevelEvent(forId, timestamp, args);
    expect(event.forId).to.equal(forId);
    expect(event.timestamp).to.equal(timestamp);
    expect(event.action).to.equal(EventAction.CONTAINER_SET_LEVEL);
    expect(event.args.level).to.equal(level);
  });

  it('should update the entity correctly', async () => {
    const args = new ContainerSetLevelEventArgs({ level: level });
    const event = new ContainerSetLevelEvent(forId, timestamp, args);
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
      ).level
    ).to.equal(level);
  });

  it('should update the text correctly', async () => {
    const args = new ContainerSetLevelEventArgs({ level: level });
    const event = new ContainerSetLevelEvent(forId, timestamp, args);
    const containerMock = mock(HTMLDivElement);
    const container = instance(containerMock);

    const spooler = new SimulationSpooler(simData, container);
    await new Promise((resolve) => setTimeout(resolve, 10));

    // set the capacity to 0 so the text is predictable
    (
      spooler.context.simulationData.entities.find(
        (entity) => entity.id === forId
      ) as ContainerEntity
    ).capacity = 0;

    event.execute(spooler.context);
    const displayObject = getEntityDisplayObjectById(
      spooler.context,
      forId
    ) as ExtendedDisplayEntity;
    expect(displayObject.informationText.text).to.equal(`${level} / 0`);
  });
});

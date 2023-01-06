import { ResourceSetUtilizationEvent } from '../../src/event/ResourceSetUtilizationEvent';
import { expect } from 'chai';
import { ResourceSetUtilizationEventArgs } from '../../src/event/ResourceSetUtilizationEventArgs';
import { EventAction } from '../../src/event/EventAction';
import { instance, mock } from 'ts-mockito';
import { getTestGrid } from './getTestGrid';
import { SimulationDataSerialized } from '../../src/SimulationDataSerialized';
import { SimulationSpooler } from '../../src/SimulationSpooler';
import {
  ResourceEntity,
  ExtendedDisplayEntity,
  getEntityDisplayObjectById,
} from '../../src/Entity';
import { EMOJI, TRANSPARENT_PIXEL } from './testImages';

const forId = 'leet';
const timestamp = 1337;
const utilization = 0.78;

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
    await new Promise((resolve) => setTimeout(resolve, 10));
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
    await new Promise((resolve) => setTimeout(resolve, 10));

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

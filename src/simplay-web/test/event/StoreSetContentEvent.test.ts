import { StoreSetContentEvent } from '../../src/event/StoreSetContentEvent';
import { expect } from 'chai';
import { StoreSetContentEventArgs } from '../../src/event/StoreSetContentEventArgs';
import { EventAction } from '../../src/event/EventAction';
import { instance, mock } from 'ts-mockito';
import { getTestGrid } from './getTestGrid';
import { SimulationDataSerialized } from '../../src/SimulationDataSerialized';
import { SimulationSpooler } from '../../src/SimulationSpooler';
import {
  ExtendedDisplayEntity,
  getEntityDisplayObjectById,
  StoreEntity,
} from '../../src/Entity';
import { EMOJI, TRANSPARENT_PIXEL } from './testImages';

const forId = 'leet';
const timestamp = 1337;
const content = "[{ resourceId: 'foo', amount: 76 }]";

const simData = {
  entities: [
    {
      id: 'leet',
      visual: 'STORE',
      type: 'STORE',
      tint: 0xffffff,
    },
  ],
  visuals: [
    {
      id: 'STORE',
      frames: [TRANSPARENT_PIXEL, EMOJI],
    },
  ],
  events: [],
  grid: getTestGrid(),
} as SimulationDataSerialized;

describe('StoreSetContentEvent tests', function () {
  it('should initialize correctly', () => {
    const args = new StoreSetContentEventArgs({ content: content });
    const event = new StoreSetContentEvent(forId, timestamp, args);
    expect(event.forId).to.equal(forId);
    expect(event.timestamp).to.equal(timestamp);
    expect(event.action).to.equal(EventAction.STORE_SET_CONTENT);
    expect(event.args.content).to.equal(content);
  });

  it('should update the entity correctly', async () => {
    const args = new StoreSetContentEventArgs({ content: content });
    const event = new StoreSetContentEvent(forId, timestamp, args);
    const containerMock = mock(HTMLDivElement);
    const container = instance(containerMock);

    const spooler = new SimulationSpooler(simData, container);
    await new Promise((resolve) => setTimeout(resolve, 100));

    event.execute(spooler.context);

    expect(
      (
        spooler.context.simulationData.entities.find(
          (entity) => entity.id === forId
        ) as StoreEntity
      ).content
    ).to.equal(content);
  });

  it('should update the text correctly', async () => {
    const args = new StoreSetContentEventArgs({ content: content });
    const event = new StoreSetContentEvent(forId, timestamp, args);
    const containerMock = mock(HTMLDivElement);
    const container = instance(containerMock);

    const spooler = new SimulationSpooler(simData, container);
    await new Promise((resolve) => setTimeout(resolve, 100));

    // set the capacity to 0 so the text is predictable
    (
      spooler.context.simulationData.entities.find(
        (entity) => entity.id === forId
      ) as StoreEntity
    ).capacity = 0;

    event.execute(spooler.context);
    const displayObject = getEntityDisplayObjectById(
      spooler.context,
      forId
    ) as ExtendedDisplayEntity;
    expect(displayObject.informationText.text).to.equal(
      `capacity: 0\n${content}`
    );
  });
});

import { StoreSetCapacityEvent } from '../../src/event/StoreSetCapacityEvent';
import { expect } from 'chai';
import { StoreSetCapacityEventArgs } from '../../src/event/StoreSetCapacityEventArgs';
import { EventAction } from '../../src/event/EventAction';
import { instance, mock, spy, when } from 'ts-mockito';
import * as PIXI from 'pixi.js';
import { getTestGrid } from './getTestGrid';
import { SimulationDataSerialized } from '../../src/SimulationDataSerialized';
import { SimulationSpooler } from '../../src/SimulationSpooler';
import {
  ExtendedDisplayEntity,
  getEntityDisplayObjectById,
  StoreEntity,
} from '../../src/Entity';

const forId = 'leet';
const timestamp = 1337;
const capacity = 1854;

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
      frames: ['frame1.png', 'frame2.png'],
    },
  ],
  events: [],
  grid: getTestGrid(),
} as SimulationDataSerialized;

const fromUrlSpy = spy(PIXI.Texture);
when(fromUrlSpy.fromURL('frame1.png')).thenResolve(PIXI.Texture.WHITE);
when(fromUrlSpy.fromURL('frame2.png')).thenResolve(PIXI.Texture.WHITE);

describe('StoreSetCapacityEvent tests', function () {
  it('should initialize correctly', () => {
    const args = new StoreSetCapacityEventArgs({ capacity: capacity });
    const event = new StoreSetCapacityEvent(forId, timestamp, args);
    expect(event.forId).to.equal(forId);
    expect(event.timestamp).to.equal(timestamp);
    expect(event.action).to.equal(EventAction.STORE_SET_CAPACITY);
    expect(event.args.capacity).to.equal(capacity);
  });

  it('should update the entity correctly', async () => {
    const args = new StoreSetCapacityEventArgs({ capacity: capacity });
    const event = new StoreSetCapacityEvent(forId, timestamp, args);
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
      ).capacity
    ).to.equal(capacity);
  });

  it('should update the text correctly', async () => {
    const args = new StoreSetCapacityEventArgs({ capacity: capacity });
    const event = new StoreSetCapacityEvent(forId, timestamp, args);
    const containerMock = mock(HTMLDivElement);
    const container = instance(containerMock);

    const spooler = new SimulationSpooler(simData, container);
    await new Promise((resolve) => setTimeout(resolve, 100));

    // set the content to [] to make the text predictable
    (
      spooler.context.simulationData.entities.find(
        (entity) => entity.id === forId
      ) as StoreEntity
    ).content = [];

    event.execute(spooler.context);
    const displayObject = getEntityDisplayObjectById(
      spooler.context,
      forId
    ) as ExtendedDisplayEntity;
    expect(displayObject.informationText.text).to.equal(
      `capacity: ${capacity}`
    );
  });
});

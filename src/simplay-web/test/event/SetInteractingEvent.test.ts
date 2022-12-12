import { SetInteractingEvent } from '../../src/event/SetInteractingEvent';
import { expect } from 'chai';
import { SetInteractingEventArgs } from '../../src/event/SetInteractingEventArgs';
import { EventAction } from '../../src/event/EventAction';
import { mock, instance } from 'ts-mockito';
import { SimulationSpooler } from '../../src/SimulationSpooler';
import { getTestGrid } from './getTestGrid';
import { SimulationDataSerialized } from '../../src/SimulationDataSerialized';
import { getEntityDisplayObjectById } from '../../src/Entity';
import { EMOJI, TRANSPARENT_PIXEL } from './testImages';

const forId = 'leet';
const timestamp = 1337;
const withId = 'foo';

describe('SetInteractingEvent tests', async function () {
  it('should initialize correctly', () => {
    const args = new SetInteractingEventArgs({ withId: withId });
    const event = new SetInteractingEvent(forId, timestamp, args);
    expect(event.forId).to.equal(forId);
    expect(event.timestamp).to.equal(timestamp);
    expect(event.action).to.equal(EventAction.SET_INTERACTING);
    expect(event.args.withId).to.equal(args.withId);
  });

  const simulationDataSerialized = {
    entities: [
      {
        id: 'leet',
        type: 'CUSTOM',
        visual: 'LEET',
        tint: 0x000000,
      },
      {
        id: 'foo',
        type: 'CUSTOM',
        visual: 'FOO',
        tint: 0x000000,
      },
    ],
    events: [],
    visuals: [
      {
        id: 'LEET',
        frames: [TRANSPARENT_PIXEL],
      },
      {
        id: 'FOO',
        frames: [EMOJI],
      },
    ],
    grid: getTestGrid(),
  } as SimulationDataSerialized;

  it('should create an interaction', async () => {
    const args = new SetInteractingEventArgs({ withId: withId });
    const event = new SetInteractingEvent(forId, timestamp, args);
    const containerMock = mock(HTMLDivElement);
    const container = instance(containerMock);
    const spooler = new SimulationSpooler(simulationDataSerialized, container);
    await new Promise((resolve) => setTimeout(resolve, 100));

    event.execute(spooler.context);
    const sourceEntity = getEntityDisplayObjectById(spooler.context, forId);
    const targetEntity = getEntityDisplayObjectById(spooler.context, withId);
    expect(sourceEntity.outgoingInteractions.size).to.equal(1);
    expect(sourceEntity.incomingInteractions.size).to.equal(0);
    expect(targetEntity.incomingInteractions.size).to.equal(1);
    expect(targetEntity.outgoingInteractions.size).to.equal(0);
  });
});

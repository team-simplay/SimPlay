import { SetNotInteractingEvent } from '../../src/event/SetNotInteractingEvent';
import { expect } from 'chai';
import { SetNotInteractingEventArgs } from '../../src/event/SetNotInteractingEventArgs';
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

describe('SetNotInteractingEvent tests', async function () {
  it('should initialize correctly', () => {
    const args = new SetNotInteractingEventArgs({ withId: withId });
    const event = new SetNotInteractingEvent(forId, timestamp, args);
    expect(event.forId).to.equal(forId);
    expect(event.timestamp).to.equal(timestamp);
    expect(event.action).to.equal(EventAction.SET_NOT_INTERACTING);
    expect(event.args.withId).to.equal(withId);
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

  it('should remove an interaction', async () => {
    const args = new SetNotInteractingEventArgs({ withId: withId });
    const event = new SetNotInteractingEvent(forId, timestamp, args);
    const containerMock = mock(HTMLDivElement);
    const container = instance(containerMock);
    const spooler = new SimulationSpooler(simulationDataSerialized, container);
    await new Promise((resolve) => setTimeout(resolve, 10));

    const createArgs = new SetNotInteractingEventArgs({ withId: withId });
    const createEvent = new SetNotInteractingEvent(
      forId,
      timestamp,
      createArgs
    );
    createEvent.execute(spooler.context);

    event.execute(spooler.context);
    const sourceEntity = getEntityDisplayObjectById(spooler.context, forId);
    const targetEntity = getEntityDisplayObjectById(spooler.context, withId);

    expect(sourceEntity.outgoingInteractions).to.have.lengthOf(0);
    expect(targetEntity.incomingInteractions).to.have.lengthOf(0);
  });
});

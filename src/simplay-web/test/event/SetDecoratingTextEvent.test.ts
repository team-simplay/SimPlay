import { SetDecoratingTextEvent } from '../../src/event/SetDecoratingTextEvent';
import { expect } from 'chai';
import { SetDecoratingTextEventArgs } from '../../src/event/SetDecoratingTextEventArgs';
import { EventAction } from '../../src/event/EventAction';
import { instance, mock } from 'ts-mockito';
import { getTestGrid } from './getTestGrid';
import { SimulationDataSerialized } from '../../src/SimulationDataSerialized';
import { SimulationSpooler } from '../../src/SimulationSpooler';
import { getEntityDisplayObjectById } from '../../src/Entity';
import { TRANSPARENT_PIXEL } from './testImages';

const forId = 'leet';
const timestamp = 1337;
const text = 'baz';

describe('SetDecoratingTextEvent tests', function () {
  it('should initialize correctly', () => {
    const args = new SetDecoratingTextEventArgs({ text: text });
    const event = new SetDecoratingTextEvent(forId, timestamp, args);
    expect(event.forId).to.equal(forId);
    expect(event.timestamp).to.equal(timestamp);
    expect(event.action).to.equal(EventAction.SET_DECORATING_TEXT);
    expect(event.args.text).to.equal(text);
  });

  const simData = {
    entities: [
      {
        id: 'leet',
        type: 'CUSTOM',
        tint: 0xffffff,
        visual: 'LEET',
      },
    ],
    visuals: [
      {
        id: 'LEET',
        frames: [TRANSPARENT_PIXEL],
      },
    ],
    events: [],
    grid: getTestGrid(),
  } as SimulationDataSerialized;

  it('should set the decorating text', async () => {
    const args = new SetDecoratingTextEventArgs({ text: text });
    const event = new SetDecoratingTextEvent(forId, timestamp, args);
    const containerMock = mock(HTMLDivElement);
    const container = instance(containerMock);
    const spooler = new SimulationSpooler(simData, container);
    await new Promise((resolve) => setTimeout(resolve, 100));
    event.execute(spooler.context);
    const displayObject = getEntityDisplayObjectById(spooler.context, forId);
    expect(displayObject.decoratingText.text).to.equal(text);
  });
});

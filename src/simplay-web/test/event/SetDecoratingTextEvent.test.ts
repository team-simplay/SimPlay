import { SetDecoratingTextEvent } from '../../src/event/SetDecoratingTextEvent';
import { expect } from 'chai';
import { SetDecoratingTextEventArgs } from '../../src/event/SetDecoratingTextEventArgs';
import { EventAction } from '../../src/event/EventAction';
import { instance, mock, spy, when } from 'ts-mockito';
import * as PIXI from 'pixi.js';
import { getTestGrid } from './getTestGrid';
import { SimulationDataSerialized } from '../../src/SimulationDataSerialized';
import { SimulationSpooler } from '../../src/SimulationSpooler';
import { getEntityDisplayObjectById } from '../../src/Entity';

const forId = 'leet';
const timestamp = 1337;
const text = 'baz';

const fromUrlSpy = spy(PIXI.Texture);
when(fromUrlSpy.fromURL('leet.png')).thenResolve(PIXI.Texture.WHITE);

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
        frames: ['leet.png'],
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

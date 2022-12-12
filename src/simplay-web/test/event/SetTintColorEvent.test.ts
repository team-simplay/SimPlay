import { SetTintColorEvent } from '../../src/event/SetTintColorEvent';
import { expect } from 'chai';
import { SetTintColorEventArgs } from '../../src/event/SetTintColorEventArgs';
import { EventAction } from '../../src/event/EventAction';
import { instance, mock } from 'ts-mockito';
import { SimulationDataSerialized } from '../../src/SimulationDataSerialized';
import { getTestGrid } from './getTestGrid';
import { SimulationSpooler } from '../../src/SimulationSpooler';
import { getEntityDisplayObjectById } from '../../src/Entity';
import { TRANSPARENT_PIXEL } from './testImages';

const forId = 'leet';
const timestamp = 1337;
const color = 0x123456;

describe('SetTintColorEvent tests', function () {
  it('should initialize correctly', () => {
    const args = new SetTintColorEventArgs({ color: color });
    const event = new SetTintColorEvent(forId, timestamp, args);
    expect(event.forId).to.equal(forId);
    expect(event.timestamp).to.equal(timestamp);
    expect(event.action).to.equal(EventAction.SET_TINT_COLOR);
    expect(event.args.color).to.equal(color);
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

  it('should execute correctly', async () => {
    const args = new SetTintColorEventArgs({ color: color });
    const event = new SetTintColorEvent(forId, timestamp, args);
    const containerMock = mock(HTMLDivElement);
    const container = instance(containerMock);
    const spooler = new SimulationSpooler(simData, container);
    await new Promise((resolve) => setTimeout(resolve, 100));
    event.execute(spooler.context);
    const displayObject = getEntityDisplayObjectById(
      spooler.context,
      forId
    ).animatedSprite;
    expect(displayObject.tint).to.equal(color);
  });

  it('should throw error if color is invalid', async () => {
    const args = new SetTintColorEventArgs({ color: 0x1234567 });
    const event = new SetTintColorEvent(forId, timestamp, args);
    const containerMock = mock(HTMLDivElement);
    const container = instance(containerMock);
    const spooler = new SimulationSpooler(simData, container);
    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(() => event.execute(spooler.context)).to.throw(
      `Invalid color value ${args.color} for entity ${forId}`
    );
  });
});

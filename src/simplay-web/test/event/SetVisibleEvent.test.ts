import { SetVisibleEvent } from '../../src/event/SetVisibleEvent';
import { expect } from 'chai';
import { SetVisibleEventArgs } from '../../src/event/SetVisibleEventArgs';
import { EventAction } from '../../src/event/EventAction';
import { SimulationDataSerialized } from '../../src/SimulationDataSerialized';
import { getTestGrid } from './getTestGrid';
import { mock, instance } from 'ts-mockito';
import { SimulationSpooler } from '../../src/SimulationSpooler';
import { TRANSPARENT_PIXEL } from './testImages';

const forId = 'leet';
const timestamp = 1337;
const visible = true;

describe('SetVisibleEvent tests', async function () {
  it('should initialize correctly', async () => {
    const args = new SetVisibleEventArgs({ visible: visible });
    const event = new SetVisibleEvent(forId, timestamp, args);
    expect(event.forId).to.equal(forId);
    expect(event.timestamp).to.equal(timestamp);
    expect(event.action).to.equal(EventAction.SET_VISIBLE);
    expect(event.args.visible).to.equal(visible);
  });

  const simulationDataSerialized = {
    entities: [
      {
        id: 'leet',
        type: 'CUSTOM',
        visual: 'LEET',
        tint: 0x000000,
      },
    ],
    events: [
      {
        forId: 'leet',
        timestamp: 1337,
        action: 'SET_VISIBLE',
        args: {
          visible: true,
        },
      },
    ],
    visuals: [
      {
        id: 'LEET',
        frames: [TRANSPARENT_PIXEL],
      },
    ],
    grid: getTestGrid(),
  } as SimulationDataSerialized;

  it('should throw error when no entity found', async () => {
    const args = new SetVisibleEventArgs({ visible: visible });
    const event = new SetVisibleEvent(forId, timestamp, args);

    const containerMock = mock(HTMLDivElement);
    const container = instance(containerMock);

    const simData = {
      ...simulationDataSerialized,
      entities: [],
    };

    const spooler = new SimulationSpooler(simData, container);

    expect(() => event.execute(spooler.context)).to.throw();
  });

  it('should set visibility to true', async () => {
    const args = new SetVisibleEventArgs({ visible: visible });
    const event = new SetVisibleEvent(forId, timestamp, args);

    const containerMock = mock(HTMLDivElement);
    const container = instance(containerMock);

    const spooler = new SimulationSpooler(simulationDataSerialized, container);
    await new Promise((resolve) => setTimeout(resolve, 10));
    event.execute(spooler.context);

    const entity = spooler.context.entityContainer.getChildByName(forId);
    expect(entity.visible).to.equal(visible);
  });

  it('should set visibility to false', async () => {
    const args = new SetVisibleEventArgs({ visible: !visible });
    const event = new SetVisibleEvent(forId, timestamp, args);

    const containerMock = mock(HTMLDivElement);
    const container = instance(containerMock);

    const spooler = new SimulationSpooler(simulationDataSerialized, container);
    await new Promise((resolve) => setTimeout(resolve, 10));
    event.execute(spooler.context);

    const entity = spooler.context.entityContainer.getChildByName(forId);
    expect(entity.visible).to.equal(!visible);
  });
});

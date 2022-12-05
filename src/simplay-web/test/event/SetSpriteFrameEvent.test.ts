import { SetSpriteFrameEvent } from '../../src/event/SetSpriteFrameEvent';
import { expect } from 'chai';
import { SetSpriteFrameEventArgs } from '../../src/event/SetSpriteFrameEventArgs';
import { EventAction } from '../../src/event/EventAction';
import { instance, mock, spy, when } from 'ts-mockito';
import * as PIXI from 'pixi.js';
import { SimulationDataSerialized } from '../../src/SimulationDataSerialized';
import { getTestGrid } from './getTestGrid';
import { SimulationSpooler } from '../../src/SimulationSpooler';
import { getEntityDisplayObjectById } from '../../src/Entity';
import { AnimatedSprite } from 'pixi.js';

const forId = 'leet';
const timestamp = 1337;
const frame = 9;

const fromUrlSpy = spy(PIXI.Texture);
when(fromUrlSpy.fromURL('frame1.png')).thenResolve(PIXI.Texture.WHITE);
when(fromUrlSpy.fromURL('frame2.png')).thenResolve(PIXI.Texture.WHITE);

const simData = {
  entities: [
    {
      id: 'leet',
      visual: 'LEET',
      type: 'CUSTOM',
      tint: 0xffffff,
    },
  ],
  visuals: [
    {
      id: 'LEET',
      frames: ['frame1.png', 'frame2.png'],
    },
  ],
  events: [],
  grid: getTestGrid(),
} as SimulationDataSerialized;

describe('SetSpriteFrameEvent tests', function () {
  it('should initialize correctly', () => {
    const args = new SetSpriteFrameEventArgs({ frame: frame });
    const event = new SetSpriteFrameEvent(forId, timestamp, args);
    expect(event.forId).to.equal(forId);
    expect(event.timestamp).to.equal(timestamp);
    expect(event.action).to.equal(EventAction.SET_SPRITE_FRAME);
    expect(event.args.frame).to.equal(frame);
  });

  it('should change the frame of the entity', async () => {
    const args = new SetSpriteFrameEventArgs({ frame: 1 });
    const event = new SetSpriteFrameEvent(forId, timestamp, args);
    const containerMock = mock(HTMLDivElement);
    const container = instance(containerMock);
    const spooler = new SimulationSpooler(simData, container);
    await new Promise((resolve) => setTimeout(resolve, 100));
    event.execute(spooler.context);
    const entityObject = getEntityDisplayObjectById(
      spooler.context,
      forId
    ) as AnimatedSprite;
    expect(entityObject.currentFrame).to.equal(1);
  });

  it('should throw an error if the frame does not exist', async () => {
    const args = new SetSpriteFrameEventArgs({ frame: 2 });
    const event = new SetSpriteFrameEvent(forId, timestamp, args);
    const containerMock = mock(HTMLDivElement);
    const container = instance(containerMock);
    const spooler = new SimulationSpooler(simData, container);
    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(() => event.execute(spooler.context)).to.throw(
      `Frame ${args.frame} does not exist for entity ${forId}`
    );
  });
});

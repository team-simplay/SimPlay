import { EventFactory } from '../src/EventFactory';
import { EventSerialized } from '../src/EventSerialized';
import { expect } from 'chai';
import { SetVisibleEvent } from '../src/SetVisibleEvent';
import { EventAction } from '../src/EventAction';
import { SetPositionEvent } from '../src/SetPositionEvent';
import { SetInteractingEvent } from '../src/SetInteractingEvent';
import { SetNotInteractingEvent } from '../src/SetNotInteractingEvent';
import { MoveNearEvent } from '../src/MoveNearEvent';
import { MoveNearCellEvent } from '../src/MoveNearCellEvent';
import { SetTintColorEvent } from '../src/SetTintColorEvent';
import { SetDecoratingTextEvent } from '../src/SetDecoratingTextEvent';
import { SetSpriteFrameEvent } from '../src/SetSpriteFrameEvent';
import { ResourceSetCapacityEvent } from '../src/ResourceSetCapacityEvent';
import { ResourceSetUtilizationEvent } from '../src/ResourceSetUtilizationEvent';
import { ContainerSetCapacityEvent } from '../src/ContainerSetCapacityEvent';
import { ContainerSetLevelEvent } from '../src/ContainerSetLevelEvent';
import { StoreSetCapacityEvent } from '../src/StoreSetCapacityEvent';
import { StoreSetContentEvent } from '../src/StoreSetContentEvent';

const forId = 'leet';
const timestamp = 1337;

describe('EventFactory tests', function () {
  it('should initialize SetVisibleEvent', () => {
    const event = EventFactory.fromSerialized({
      action: EventAction.SET_VISIBLE,
      forId: forId,
      timestamp: timestamp,
      args: { visible: true },
    } as EventSerialized) as SetVisibleEvent;
    expect(event instanceof SetVisibleEvent).to.be.true;
  });

  it('should initialize SetPositionEvent', () => {
    const event = EventFactory.fromSerialized({
      action: EventAction.SET_POSITION,
      forId: forId,
      timestamp: timestamp,
      args: { x: 0, y: 0 },
    } as EventSerialized);
    expect(event instanceof SetPositionEvent).to.be.true;
  });

  it('should initialize SetInteractingEvent', () => {
    const event = EventFactory.fromSerialized({
      action: EventAction.SET_INTERACTING,
      forId: forId,
      timestamp: timestamp,
      args: { withId: 'foo' },
    } as EventSerialized);
    expect(event instanceof SetInteractingEvent).to.be.true;
  });

  it('should initialize SetNotInteractingEvent', () => {
    const event = EventFactory.fromSerialized({
      action: EventAction.SET_NOT_INTERACTING,
      forId: forId,
      timestamp: timestamp,
      args: { withId: 'foo' },
    } as EventSerialized);
    expect(event instanceof SetNotInteractingEvent).to.be.true;
  });

  it('should initialize MoveNearEvent', () => {
    const event = EventFactory.fromSerialized({
      action: EventAction.MOVE_NEAR,
      forId: forId,
      timestamp: timestamp,
      args: { target: 'bar' },
    } as EventSerialized);
    expect(event instanceof MoveNearEvent).to.be.true;
  });

  it('should initialize MoveNearCellEvent', () => {
    const event = EventFactory.fromSerialized({
      action: EventAction.MOVE_NEAR_CELL,
      forId: forId,
      timestamp: timestamp,
      args: { x: 0, y: 0 },
    } as EventSerialized);
    expect(event instanceof MoveNearCellEvent).to.be.true;
  });

  it('should initialize SetTintColorEvent', () => {
    const event = EventFactory.fromSerialized({
      action: EventAction.SET_TINT_COLOR,
      forId: forId,
      timestamp: timestamp,
      args: { color: 0x123456 },
    } as EventSerialized);
    expect(event instanceof SetTintColorEvent).to.be.true;
  });

  it('should initialize SetDecoratingTextEvent', () => {
    const event = EventFactory.fromSerialized({
      action: EventAction.SET_DECORATING_TEXT,
      forId: forId,
      timestamp: timestamp,
      args: { text: 'baz' },
    } as EventSerialized);
    expect(event instanceof SetDecoratingTextEvent).to.be.true;
  });

  it('should initialize SetSpriteFrameEvent', () => {
    const event = EventFactory.fromSerialized({
      action: EventAction.SET_SPRITE_FRAME,
      forId: forId,
      timestamp: timestamp,
      args: { frame: 12 },
    } as EventSerialized);
    expect(event instanceof SetSpriteFrameEvent).to.be.true;
  });

  it('should initialize ResourceSetCapacityEvent', () => {
    const event = EventFactory.fromSerialized({
      action: EventAction.RESOURCE_SET_CAPACITY,
      forId: forId,
      timestamp: timestamp,
      args: { capacity: 12 },
    } as EventSerialized);
    expect(event instanceof ResourceSetCapacityEvent).to.be.true;
  });

  it('should initialize ResourceSetUtilizationEvent', () => {
    const event = EventFactory.fromSerialized({
      action: EventAction.RESOURCE_SET_UTILIZATION,
      forId: forId,
      timestamp: timestamp,
      args: { utilization: 0.01 },
    } as EventSerialized);
    expect(event instanceof ResourceSetUtilizationEvent).to.be.true;
  });

  it('should initialize ContainerSetCapacityEvent', () => {
    const event = EventFactory.fromSerialized({
      action: EventAction.CONTAINER_SET_CAPACITY,
      forId: forId,
      timestamp: timestamp,
      args: { capacity: 12 },
    } as EventSerialized);
    expect(event instanceof ContainerSetCapacityEvent).to.be.true;
  });

  it('should initialize ContainerSetLevelEvent', () => {
    const event = EventFactory.fromSerialized({
      action: EventAction.CONTAINER_SET_LEVEL,
      forId: forId,
      timestamp: timestamp,
      args: { level: 12 },
    } as EventSerialized);
    expect(event instanceof ContainerSetLevelEvent).to.be.true;
  });

  it('should initialize StoreSetCapacityEvent', () => {
    const event = EventFactory.fromSerialized({
      action: EventAction.STORE_SET_CAPACITY,
      forId: forId,
      timestamp: timestamp,
      args: { capacity: 12 },
    } as EventSerialized);
    expect(event instanceof StoreSetCapacityEvent).to.be.true;
  });

  it('should initialize StoreSetContentEvent', () => {
    const event = EventFactory.fromSerialized({
      action: EventAction.STORE_SET_CONTENT,
      forId: forId,
      timestamp: timestamp,
      args: { content: [{ resourceId: 45, amount: 3 }] },
    } as EventSerialized);
    expect(event instanceof StoreSetContentEvent).to.be.true;
  });
});

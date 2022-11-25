import { eventFactory } from '../../src/event/EventFactory';
import { EventSerialized } from '../../src/event/EventSerialized';
import { expect } from 'chai';
import { SetVisibleEvent } from '../../src/event/SetVisibleEvent';
import { EventAction } from '../../src/event/EventAction';
import { SetPositionEvent } from '../../src/event/SetPositionEvent';
import { SetInteractingEvent } from '../../src/event/SetInteractingEvent';
import { SetNotInteractingEvent } from '../../src/event/SetNotInteractingEvent';
import { MoveNearEvent } from '../../src/event/MoveNearEvent';
import { MoveNearCellEvent } from '../../src/event/MoveNearCellEvent';
import { SetTintColorEvent } from '../../src/event/SetTintColorEvent';
import { SetDecoratingTextEvent } from '../../src/event/SetDecoratingTextEvent';
import { SetSpriteFrameEvent } from '../../src/event/SetSpriteFrameEvent';
import { ResourceSetCapacityEvent } from '../../src/event/ResourceSetCapacityEvent';
import { ResourceSetUtilizationEvent } from '../../src/event/ResourceSetUtilizationEvent';
import { ContainerSetCapacityEvent } from '../../src/event/ContainerSetCapacityEvent';
import { ContainerSetLevelEvent } from '../../src/event/ContainerSetLevelEvent';
import { StoreSetCapacityEvent } from '../../src/event/StoreSetCapacityEvent';
import { StoreSetContentEvent } from '../../src/event/StoreSetContentEvent';

const forId = 'leet';
const timestamp = 1337;

describe('EventFactory tests', function () {
  it('should initialize SetVisibleEvent', () => {
    const event = eventFactory({
      action: EventAction.SET_VISIBLE,
      forId: forId,
      timestamp: timestamp,
      args: { visible: true },
    } as EventSerialized) as SetVisibleEvent;
    expect(event).to.be.an.instanceOf(SetVisibleEvent);
  });

  it('should initialize SetPositionEvent', () => {
    const event = eventFactory({
      action: EventAction.SET_POSITION,
      forId: forId,
      timestamp: timestamp,
      args: { x: 0, y: 0 },
    } as EventSerialized);
    expect(event).to.be.an.instanceOf(SetPositionEvent);
  });

  it('should initialize SetInteractingEvent', () => {
    const event = eventFactory({
      action: EventAction.SET_INTERACTING,
      forId: forId,
      timestamp: timestamp,
      args: { withId: 'foo' },
    } as EventSerialized);
    expect(event).to.be.an.instanceOf(SetInteractingEvent);
  });

  it('should initialize SetNotInteractingEvent', () => {
    const event = eventFactory({
      action: EventAction.SET_NOT_INTERACTING,
      forId: forId,
      timestamp: timestamp,
      args: { withId: 'foo' },
    } as EventSerialized);
    expect(event).to.be.an.instanceOf(SetNotInteractingEvent);
  });

  it('should initialize MoveNearEvent', () => {
    const event = eventFactory({
      action: EventAction.MOVE_NEAR,
      forId: forId,
      timestamp: timestamp,
      args: { target: 'bar' },
    } as EventSerialized);
    expect(event).to.be.an.instanceOf(MoveNearEvent);
  });

  it('should initialize MoveNearCellEvent', () => {
    const event = eventFactory({
      action: EventAction.MOVE_NEAR_CELL,
      forId: forId,
      timestamp: timestamp,
      args: { x: 0, y: 0 },
    } as EventSerialized);
    expect(event).to.be.an.instanceOf(MoveNearCellEvent);
  });

  it('should initialize SetTintColorEvent', () => {
    const event = eventFactory({
      action: EventAction.SET_TINT_COLOR,
      forId: forId,
      timestamp: timestamp,
      args: { color: 0x123456 },
    } as EventSerialized);
    expect(event).to.be.an.instanceOf(SetTintColorEvent);
  });

  it('should initialize SetDecoratingTextEvent', () => {
    const event = eventFactory({
      action: EventAction.SET_DECORATING_TEXT,
      forId: forId,
      timestamp: timestamp,
      args: { text: 'baz' },
    } as EventSerialized);
    expect(event).to.be.an.instanceOf(SetDecoratingTextEvent);
  });

  it('should initialize SetSpriteFrameEvent', () => {
    const event = eventFactory({
      action: EventAction.SET_SPRITE_FRAME,
      forId: forId,
      timestamp: timestamp,
      args: { frame: 12 },
    } as EventSerialized);
    expect(event).to.be.an.instanceOf(SetSpriteFrameEvent);
  });

  it('should initialize ResourceSetCapacityEvent', () => {
    const event = eventFactory({
      action: EventAction.RESOURCE_SET_CAPACITY,
      forId: forId,
      timestamp: timestamp,
      args: { capacity: 12 },
    } as EventSerialized);
    expect(event).to.be.an.instanceOf(ResourceSetCapacityEvent);
  });

  it('should initialize ResourceSetUtilizationEvent', () => {
    const event = eventFactory({
      action: EventAction.RESOURCE_SET_UTILIZATION,
      forId: forId,
      timestamp: timestamp,
      args: { utilization: 0.01 },
    } as EventSerialized);
    expect(event).to.be.an.instanceOf(ResourceSetUtilizationEvent);
  });

  it('should initialize ContainerSetCapacityEvent', () => {
    const event = eventFactory({
      action: EventAction.CONTAINER_SET_CAPACITY,
      forId: forId,
      timestamp: timestamp,
      args: { capacity: 12 },
    } as EventSerialized);
    expect(event).to.be.an.instanceOf(ContainerSetCapacityEvent);
  });

  it('should initialize ContainerSetLevelEvent', () => {
    const event = eventFactory({
      action: EventAction.CONTAINER_SET_LEVEL,
      forId: forId,
      timestamp: timestamp,
      args: { level: 12 },
    } as EventSerialized);
    expect(event).to.be.an.instanceOf(ContainerSetLevelEvent);
  });

  it('should initialize StoreSetCapacityEvent', () => {
    const event = eventFactory({
      action: EventAction.STORE_SET_CAPACITY,
      forId: forId,
      timestamp: timestamp,
      args: { capacity: 12 },
    } as EventSerialized);
    expect(event).to.be.an.instanceOf(StoreSetCapacityEvent);
  });

  it('should initialize StoreSetContentEvent', () => {
    const event = eventFactory({
      action: EventAction.STORE_SET_CONTENT,
      forId: forId,
      timestamp: timestamp,
      args: { content: [{ resourceId: 45, amount: 3 }] },
    } as EventSerialized);
    expect(event).to.be.an.instanceOf(StoreSetContentEvent);
  });

  it('should also work from plain JSON', () => {
    const jsonEvent =
      '{"action":"SET_VISIBLE","forId":"leet","timestamp":1337,"args":{"visible":true}}';
    const event = eventFactory(
      JSON.parse(jsonEvent) as EventSerialized
    ) as SetVisibleEvent;
    expect(event).to.be.an.instanceOf(SetVisibleEvent);
  });

  it('should throw error on unknown action', () => {
    expect(() =>
      eventFactory({
        action: 'foo' as EventAction,
        forId: forId,
        timestamp: timestamp,
        args: {},
      } as EventSerialized)
    ).to.throw();
  });
});

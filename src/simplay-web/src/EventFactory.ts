import { ContainerSetCapacityEvent } from './ContainerSetCapacityEvent';
import { ContainerSetCapacityEventArgs } from './ContainerSetCapacityEventArgs';
import { ContainerSetLevelEvent } from './ContainerSetLevelEvent';
import { ContainerSetLevelEventArgs } from './ContainerSetLevelEventArgs';
import { EventAction } from './EventAction';
import { EventArgs } from './EventArgs';
import { EventArgsCtor } from './EventArgsCtor';
import { EventCtor } from './EventCtor';
import { EventSerialized } from './EventSerialized';
import { MoveNearCellEvent } from './MoveNearCellEvent';
import { MoveNearCellEventArgs } from './MoveNearCellEventArgs';
import { MoveNearEvent } from './MoveNearEvent';
import { MoveNearEventArgs } from './MoveNearEventArgs';
import { ResourceSetCapacityEvent } from './ResourceSetCapacityEvent';
import { ResourceSetCapacityEventArgs } from './ResourceSetCapacityEventArgs';
import { ResourceSetUtilizationEvent } from './ResourceSetUtilizationEvent';
import { ResourceSetUtilizationEventArgs } from './ResourceSetUtilizationEventArgs';
import { SetDecoratingTextEvent } from './SetDecoratingTextEvent';
import { SetDecoratingTextEventArgs } from './SetDecoratingTextEventArgs';
import { SetInteractingEvent } from './SetInteractingEvent';
import { SetInteractingEventArgs } from './SetInteractingEventArgs';
import { SetNotInteractingEvent } from './SetNotInteractingEvent';
import { SetNotInteractingEventArgs } from './SetNotInteractingEventArgs';
import { SetPositionEvent } from './SetPositionEvent';
import { SetPositionEventArgs } from './SetPositionEventArgs';
import { SetSpriteFrameEvent } from './SetSpriteFrameEvent';
import { SetSpriteFrameEventArgs } from './SetSpriteFrameEventArgs';
import { SetTintColorEvent } from './SetTintColorEvent';
import { SetTintColorEventArgs } from './SetTintColorEventArgs';
import { SetVisibleEvent } from './SetVisibleEvent';
import { SetVisibleEventArgs } from './SetVisibleEventArgs';
import { StoreSetCapacityEvent } from './StoreSetCapacityEvent';
import { StoreSetCapacityEventArgs } from './StoreSetCapacityEventArgs';
import { StoreSetContentEvent } from './StoreSetContentEvent';
import { StoreSetContentEventArgs } from './StoreSetContentEventArgs';
import { Event } from './Event';

export class EventFactory {
  public static fromSerialized(serialized: EventSerialized): Event {
    switch (serialized.action) {
      case EventAction.SET_VISIBLE:
        return EventFactory.factory(
          SetVisibleEvent,
          SetVisibleEventArgs,
          serialized
        );
      case EventAction.SET_POSITION:
        return EventFactory.factory(
          SetPositionEvent,
          SetPositionEventArgs,
          serialized
        );
      case EventAction.SET_DECORATING_TEXT:
        return EventFactory.factory(
          SetDecoratingTextEvent,
          SetDecoratingTextEventArgs,
          serialized
        );
      case EventAction.SET_INTERACTING:
        return EventFactory.factory(
          SetInteractingEvent,
          SetInteractingEventArgs,
          serialized
        );
      case EventAction.SET_NOT_INTERACTING:
        return EventFactory.factory(
          SetNotInteractingEvent,
          SetNotInteractingEventArgs,
          serialized
        );
      case EventAction.MOVE_NEAR:
        return EventFactory.factory(
          MoveNearEvent,
          MoveNearEventArgs,
          serialized
        );
      case EventAction.MOVE_NEAR_CELL:
        return EventFactory.factory(
          MoveNearCellEvent,
          MoveNearCellEventArgs,
          serialized
        );
      case EventAction.SET_TINT_COLOR:
        return EventFactory.factory(
          SetTintColorEvent,
          SetTintColorEventArgs,
          serialized
        );
      case EventAction.SET_SPRITE_FRAME:
        return EventFactory.factory(
          SetSpriteFrameEvent,
          SetSpriteFrameEventArgs,
          serialized
        );
      case EventAction.RESOURCE_SET_CAPACITY:
        return EventFactory.factory(
          ResourceSetCapacityEvent,
          ResourceSetCapacityEventArgs,
          serialized
        );
      case EventAction.RESOURCE_SET_UTILIZATION:
        return EventFactory.factory(
          ResourceSetUtilizationEvent,
          ResourceSetUtilizationEventArgs,
          serialized
        );
      case EventAction.CONTAINER_SET_LEVEL:
        return EventFactory.factory(
          ContainerSetLevelEvent,
          ContainerSetLevelEventArgs,
          serialized
        );
      case EventAction.CONTAINER_SET_CAPACITY:
        return EventFactory.factory(
          ContainerSetCapacityEvent,
          ContainerSetCapacityEventArgs,
          serialized
        );
      case EventAction.STORE_SET_CAPACITY:
        return EventFactory.factory(
          StoreSetCapacityEvent,
          StoreSetCapacityEventArgs,
          serialized
        );
      case EventAction.STORE_SET_CONTENT:
        return EventFactory.factory(
          StoreSetContentEvent,
          StoreSetContentEventArgs,
          serialized
        );
      default:
        throw new Error(`Unknown event action: ${serialized.action}`);
    }
  }

  static factory<T extends Event, A extends EventArgs>(
    eventCtor: EventCtor<T>,
    eventArgsCtor: EventArgsCtor<A>,
    serialized: EventSerialized
  ): T {
    return new eventCtor(
      serialized.forId,
      serialized.timestamp,
      new eventArgsCtor(serialized.args) as A
    );
  }
}

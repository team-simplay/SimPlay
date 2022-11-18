from .primitives import ErrorText, EventAction
from simpy.core import SimTime
from typing import Union
from simpy.resources.container import ContainerAmount


class VisualEvent:
    """
    Base class for all visual events.

    :param for_id: The if of the component this event is for.
    :param timestamp: The timestamp of the event.
    :param action: The action to be performed.
    :param kwargs: The arguments for the action.
    :raises TypeError: If component is not a string.
    :raises TypeError: If timestamp is not a number.
    :raises TypeError: If action is not a string.
    """

    def __init__(
            self,
            for_id: str,
            timestamp: SimTime,
            action: EventAction,
            **kwargs: dict):
        if not isinstance(for_id, str):
            raise TypeError(ErrorText.ID_MUST_BE_STRING)
        if not isinstance(timestamp, (int, float)):
            raise TypeError(ErrorText.TIMESTAMP_MUST_BE_INT_OR_FLOAT)
        if not isinstance(action, EventAction):
            raise TypeError(ErrorText.ACTION_MUST_BE_EVENTACTION)
        self.for_id = for_id
        self.timestamp = timestamp
        self.action = action.value
        self.args = kwargs


class SetVisible(VisualEvent):
    """
    Event to set the visibility of a component.

    :param for_id: The if of the component this event is for.
    :param timestamp: The timestamp of the event.
    :param visible: Whether the component should be visible or not.
    :raises TypeError: If visible is not a boolean.
    """

    def __init__(self, for_id: str,
                 timestamp: SimTime, visible: bool):
        if not isinstance(visible, bool):
            raise TypeError(ErrorText.VISIBLE_MUST_BE_BOOL)
        super().__init__(for_id, timestamp, EventAction.SET_VISIBLE,
                         visible=visible)


class SetPosition(VisualEvent):
    """
    Event to set the position of a component.

    :param for_id: The if of the component this event is for.
    :param timestamp: The timestamp of the event.
    :param x: The x coordinate of the component.
    :param y: The y coordinate of the component.
    :raises TypeError: If x is not an integer.
    :raises TypeError: If y is not an integer.
    """

    def __init__(self, for_id: str,
                 timestamp: SimTime, x: int, y: int):
        if not isinstance(x, int):
            raise TypeError(ErrorText.X_MUST_BE_INT)
        if not isinstance(y, int):
            raise TypeError(ErrorText.Y_MUST_BE_INT)
        super().__init__(for_id, timestamp,
                         EventAction.SET_POSITION, x=x, y=y)


class SetInteracting(VisualEvent):
    """
    Event to set the interaction of a component.

    :param for_id: The if of the component this event is for.
    :param timestamp: The timestamp of the event.
    :param with_id: The id of the component the first component is interacting
        with.
    :raises TypeError: If with_id is not a string.
    """

    def __init__(self, for_id: str,
                 timestamp: SimTime, with_id: str):
        if not isinstance(with_id, str):
            raise TypeError(ErrorText.WITHID_MUST_BE_STRING)
        super().__init__(for_id, timestamp, EventAction.SET_INTERACTING,
                         with_id=with_id)


class SetNotInteracting(VisualEvent):
    """
    Event to set the interaction of a component.

    :param for_id: The if of the component this event is for.
    :param timestamp: The timestamp of the event.
    :param with_id: The id of the component the first component is interacting
     with.
    :raises TypeError: If with_id is not a string.
    """

    def __init__(self, for_id: str,
                 timestamp: SimTime, with_id: str):
        if not isinstance(with_id, str):
            raise TypeError(ErrorText.WITHID_MUST_BE_STRING)
        super().__init__(for_id, timestamp, EventAction.SET_NOT_INTERACTING,
                         with_id=with_id)


class MoveNear(VisualEvent):
    """
    Event to move a component near another component.

    :param for_id: The if of the component this event is for.
    :param timestamp: The timestamp of the event.
    :param target_id: The id of the component the first component should move
        near.
    :raises TypeError: If target_id is not a string.
    """

    def __init__(self, for_id: str,
                 timestamp: SimTime, target_id: str):
        if not isinstance(target_id, str):
            raise TypeError(ErrorText.TARGETID_MUST_BE_STRING)
        super().__init__(for_id, timestamp, EventAction.MOVE_NEAR,
                         target_id=target_id)


class MoveNearCell(VisualEvent):
    """
    Event to move a component near a cell in the grid.

    :param for_id: The if of the component this event is for.
    :param timestamp: The timestamp of the event.
    :param x: The x coordinate (column) of the cell.
    :param y: The y coordinate (row) of the cell.
    :raises TypeError: If x is not an integer.
    :raises TypeError: If y is not an integer.
    """

    def __init__(self, for_id: str,
                 timestamp: SimTime, x: int, y: int):
        if not isinstance(x, int):
            raise TypeError(ErrorText.X_MUST_BE_INT)
        if not isinstance(y, int):
            raise TypeError(ErrorText.Y_MUST_BE_INT)
        super().__init__(for_id, timestamp, EventAction.MOVE_NEAR_CELL,
                         x=x, y=y)


class SetTintColor(VisualEvent):
    """
    Event to set the tint color of a component.

    :param for_id: The if of the component this event is for.
    :param timestamp: The timestamp of the event.
    :param color: The tint of the component. This only works with visuals and
        sprites that have transparent pixels. The tint is applied to the
        pixelsthat are not transparent. To use HEX values, write them as
        0xRRGGBB. For example: 0xFF0000 is red, 0x00FF00 is green,
        0x0000FF is blue.
    :raises TypeError: If color is not a string.
    """

    def __init__(self, for_id: str,
                 timestamp: SimTime, color: int):
        if not isinstance(color, int):
            raise TypeError(ErrorText.COLOR_MUST_BE_INT)
        super().__init__(for_id, timestamp, EventAction.SET_TINT_COLOR,
                         color=color)


class SetDecoratingText(VisualEvent):
    """
    Event to set the decorating text of a component.

    :param for_id: The if of the component this event is for.
    :param timestamp: The timestamp of the event.
    :param text: The text to set as decorating text.
    :raises TypeError: If text is not a string.
    """

    def __init__(self, for_id: str,
                 timestamp: SimTime, text: str):
        if not isinstance(text, str):
            raise TypeError(ErrorText.TEXT_MUST_BE_STRING)
        super().__init__(for_id, timestamp, EventAction.SET_DECORATING_TEXT,
                         text=text)


class SetSpriteFrame(VisualEvent):
    """
    Event to set the sprite frame of a component.

    :param for_id: The if of the component this event is for.
    :param timestamp: The timestamp of the event.
    :param frame: The frame to set the sprite to.
    :raises TypeError: If frame is not an integer.
    """

    def __init__(self, for_id: str,
                 timestamp: SimTime, frame: int):
        if not isinstance(frame, int):
            raise TypeError(ErrorText.FRAME_MUST_BE_INT)
        super().__init__(for_id, timestamp, EventAction.SET_SPRITE_FRAME,
                         frame=frame)


class ResourceSetCapacity(VisualEvent):
    """
    Event to set the capacity of a resource.

    :param for_id: The if of the component this event is for.
    :param timestamp: The timestamp of the event.
    :param capacity: The capacity to set the resource to.
    :raises TypeError: If capacity is not a positive integer.
    """

    def __init__(self, for_id: str,
                 timestamp: SimTime, capacity: int):
        if not isinstance(capacity, int):
            raise TypeError(ErrorText.CAPACITY_MUST_BE_POSITIVE_INT)
        super().__init__(for_id, timestamp,
                         EventAction.RESOURCE_SET_CAPACITY,
                         capacity=capacity)


class ResourceSetUtilization(VisualEvent):
    """
    Event to set the utilization of a resource.

    :param for_id: The if of the component this event is for.
    :param timestamp: The timestamp of the event.
    :param utilization: The utilization to set the resource to.
    :raises TypeError: If utilization is not a integer.
    """

    def __init__(self, for_id: str,
                 timestamp: SimTime, utilization: int):
        if not isinstance(utilization, int):
            raise TypeError(ErrorText.UTILIZATION_MUST_BE_INT)
        super().__init__(
            for_id,
            timestamp,
            EventAction.RESOURCE_SET_UTILIZATION,
            utilization=utilization)


class ContainerSetCapacity(VisualEvent):
    """
    Event to set the capacity of a container.

    :param for_id: The if of the component this event is for.
    :param timestamp: The timestamp of the event.
    :param capacity: The capacity to set the container to.
    :raises TypeError: If capacity is not a positive integer.
    """

    def __init__(self, for_id: str,
                 timestamp: SimTime, capacity: Union[int, float]):
        if not isinstance(capacity, int) and not isinstance(capacity, float):
            raise TypeError(ErrorText.CAPACITY_MUST_BE_POSITIVE_INT_OR_FLOAT)
        super().__init__(for_id, timestamp,
                         EventAction.CONTAINER_SET_CAPACITY,
                         capacity=capacity)


class ContainerSetLevel(VisualEvent):
    """
    Event to set the level of a container.

    :param for_id: The if of the component this event is for.
    :param timestamp: The timestamp of the event.
    :param level: The level to set the container to.
    :raises TypeError: If level is not a positive integer or float.
    """

    def __init__(
            self,
            for_id: str,
            timestamp: SimTime,
            level: ContainerAmount):
        if not isinstance(level, int) and not isinstance(level, float):
            raise TypeError(ErrorText.LEVEL_MUST_BE_POSITIVE_INT_OR_FLOAT)
        super().__init__(for_id, timestamp, EventAction.CONTAINER_SET_LEVEL,
                         level=level)


class StoreSetCapacity(VisualEvent):
    """
    Event to set the capacity of a store.

    :param for_id: The if of the component this event is for.
    :param timestamp: The timestamp of the event.
    :param capacity: The capacity to set the store to.
    :raises TypeError: If capacity is not a positive integer or float.
    """

    def __init__(self, for_id: str, timestamp: SimTime,
                 capacity: Union[float, int]):
        if not isinstance(capacity, (float, int)):
            raise TypeError(ErrorText.CAPACITY_MUST_BE_POSITIVE_INT_OR_FLOAT)
        super().__init__(for_id, timestamp, EventAction.STORE_SET_CAPACITY,
                         capacity=capacity)


class StoreSetContent(VisualEvent):
    """
    Event to set the content of a store.

    :param for_id: The if of the component this event is for.
    :param timestamp: The timestamp of the event.
    :param content: The content to set the store to.
    """

    def __init__(self, for_id: str,
                 timestamp: SimTime, content):
        super().__init__(for_id, timestamp, EventAction.STORE_SET_CONTENT,
                         content=content)

from typing import Union
from simpy.resources.container import ContainerAmount
from simpy.core import SimTime


class VisualEvent:
    """
    Base class for all visual events.

    :param for_id: The id of the component this event is for.
    :param timestamp: The timestamp of the event.
    :param action: The action to be performed.
    :param kwargs: The arguments for the action.
    """

    def __init__(
            self,
            for_id: str,
            timestamp: SimTime,
            action: str,
            **kwargs: dict):
        if not isinstance(for_id, str):
            raise ValueError("for_id must be a string")
        if not isinstance(timestamp, (int, float)):
            raise ValueError("timestamp must be a number")
        if not isinstance(action, str):
            raise ValueError("action must be a string")
        self.for_id = for_id
        self.timestamp = timestamp
        self.action = action
        self.args = kwargs


class SetVisible(VisualEvent):
    """
    Event to set the visibility of a component.

    :param for_id: The id of the component this event is for.
    :param timestamp: The timestamp of the event.
    :param visible: Whether the component should be visible or not.
    """

    def __init__(self, for_id: str, timestamp: SimTime, visible: bool):
        if not isinstance(visible, bool):
            raise ValueError("visible must be a boolean")
        super().__init__(for_id, timestamp, "SET_VISIBLE", visible=visible)


class SetPosition(VisualEvent):
    """
    Event to set the position of a component.

    :param for_id: The id of the component this event is for.
    :param timestamp: The timestamp of the event.
    :param x: The x coordinate of the component.
    :param y: The y coordinate of the component.
    """

    def __init__(self, for_id: str, timestamp: SimTime, x: int, y: int):
        if not isinstance(x, int):
            raise ValueError("x must be an integer")
        if not isinstance(y, int):
            raise ValueError("y must be an integer")
        super().__init__(for_id, timestamp, "SET_POSITION", x=x, y=y)


class SetInteracting(VisualEvent):
    """
    Event to set the interaction of a component.

    :param for_id: The id of the component this event is for.
    :param timestamp: The timestamp of the event.
    :param with_id: The id of the component the first component is interacting with.
    """

    def __init__(self, for_id: str, timestamp: SimTime, with_id: str):
        if not isinstance(with_id, str):
            raise ValueError("with_id must be a string")
        super().__init__(for_id, timestamp, "SET_INTERACTING", with_id=with_id)


class SetNotInteracting(VisualEvent):
    """
    Event to set the interaction of a component.

    :param for_id: The id of the component this event is for.
    :param timestamp: The timestamp of the event.
    :param with_id: The id of the component the first component is interacting with.
    """

    def __init__(self, for_id: str, timestamp: SimTime, with_id: str):
        if not isinstance(with_id, str):
            raise ValueError("with_id must be a string")
        super().__init__(for_id, timestamp, "SET_NOT_INTERACTING", with_id=with_id)


class MoveNear(VisualEvent):
    """
    Event to move a component near another component.

    :param for_id: The id of the component this event is for.
    :param timestamp: The timestamp of the event.
    :param target_id: The id of the component the first component should move near.
    """

    def __init__(self, for_id: str, timestamp: SimTime, target_id: str):
        if not isinstance(target_id, str):
            raise ValueError("target_id must be a string")
        super().__init__(for_id, timestamp, "MOVE_NEAR", target_id=target_id)


class MoveNearCell(VisualEvent):
    """
    Event to move a component near a cell in the grid.

    :param for_id: The id of the component this event is for.
    :param timestamp: The timestamp of the event.
    :param x: The x coordinate (column) of the cell.
    :param y: The y coordinate (row) of the cell.
    """

    def __init__(self, for_id: str, timestamp: SimTime, x: int, y: int):
        if not isinstance(x, int):
            raise ValueError("x must be an integer")
        if not isinstance(y, int):
            raise ValueError("y must be an integer")
        super().__init__(for_id, timestamp, "MOVE_NEAR_CELL", x=x, y=y)


class SetTintColor(VisualEvent):
    """
    Event to set the tint color of a component.

    :param for_id: The id of the component this event is for.
    :param timestamp: The timestamp of the event.
    :param color: The color to tint the component.
    """

    def __init__(self, for_id: str, timestamp: SimTime, color: int):
        if not isinstance(color, int):
            raise ValueError("color must be an integer")
        super().__init__(for_id, timestamp, "SET_TINT_COLOR", color=color)


class SetDecoratingText(VisualEvent):
    """
    Event to set the decorating text of a component.

    :param for_id: The id of the component this event is for.
    :param timestamp: The timestamp of the event.
    :param text: The text to set as decorating text.
    """

    def __init__(self, for_id: str, timestamp: SimTime, text: str):
        if not isinstance(text, str):
            raise ValueError("text must be a string")
        super().__init__(for_id, timestamp, "SET_DECORATING_TEXT", text=text)


class SetSpriteFrame(VisualEvent):
    """
    Event to set the sprite frame of a component.

    :param for_id: The id of the component this event is for.
    :param timestamp: The timestamp of the event.
    :param frame: The frame to set the sprite to.
    """

    def __init__(self, for_id: str, timestamp: SimTime, frame: int):
        if not isinstance(frame, int):
            raise ValueError("frame must be an integer")
        super().__init__(for_id, timestamp, "SET_SPRITE_FRAME", frame=frame)


class ResourceSetCapacity(VisualEvent):
    """
    Event to set the capacity of a resource.

    :param for_id: The id of the component this event is for.
    :param timestamp: The timestamp of the event.
    :param capacity: The capacity to set the resource to.
    """

    def __init__(self, for_id: str, timestamp: SimTime, capacity: int):
        if not isinstance(capacity, int):
            raise ValueError("capacity must be an integer")
        super().__init__(for_id, timestamp, "RESOURCE.SET_CAPACITY", capacity=capacity)


class ResourceSetUtilization(VisualEvent):
    """
    Event to set the utilization of a resource.

    :param for_id: The id of the component this event is for.
    :param timestamp: The timestamp of the event.
    :param utilization: The utilization to set the resource to.
    """

    def __init__(self, for_id: str, timestamp: SimTime, utilization: int):
        if not isinstance(utilization, int):
            raise ValueError("utilization must be an integer")
        super().__init__(
            for_id,
            timestamp,
            "RESOURCE.SET_UTILIZATION",
            utilization=utilization)


class ContainerSetCapacity(VisualEvent):
    """
    Event to set the capacity of a container.

    :param for_id: The id of the component this event is for.
    :param timestamp: The timestamp of the event.
    :param capacity: The capacity to set the container to.
    """

    def __init__(self, for_id: str, timestamp: SimTime, capacity: int):
        if not isinstance(capacity, int):
            raise ValueError("capacity must be an integer")
        super().__init__(for_id, timestamp, "CONTAINER.SET_CAPACITY", capacity=capacity)


class ContainerSetLevel(VisualEvent):
    """
    Event to set the level of a container.

    :param for_id: The id of the component this event is for.
    :param timestamp: The timestamp of the event.
    :param level: The level to set the container to.
    """

    def __init__(
            self,
            for_id: str,
            timestamp: SimTime,
            level: ContainerAmount):
        if not isinstance(level, int) and not isinstance(level, float):
            raise ValueError("level must be a number")
        super().__init__(for_id, timestamp, "CONTAINER.SET_LEVEL", level=level)


class StoreSetCapacity(VisualEvent):
    """
    Event to set the capacity of a store.

    :param for_id: The id of the component this event is for.
    :param timestamp: The timestamp of the event.
    :param capacity: The capacity to set the store to.
    """

    def __init__(self, for_id: str, timestamp: SimTime,
                 capacity: Union[float, int]):
        if not isinstance(capacity, (float, int)):
            raise ValueError("capacity must be a float or integer")
        super().__init__(for_id, timestamp, "STORE.SET_CAPACITY", capacity=capacity)


class StoreSetContent(VisualEvent):
    """
    Event to set the content of a store.

    :param for_id: The id of the component this event is for.
    :param timestamp: The timestamp of the event.
    :param content: The content to set the store to.
    """

    def __init__(self, for_id: str, timestamp: SimTime, content):
        super().__init__(for_id, timestamp, "STORE.SET_CONTENT", content=content)

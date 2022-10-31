from typing import Union
from simpy.resources.container import ContainerAmount
from simpy.core import SimTime


class VisualEvent:
    """
    Base class for all visual events.
    """

    def __init__(self, for_id: str, timestamp: SimTime, action: str, **kwargs: dict):
        """
        :param for_id: The id of the component this event is for.
        :param timestamp: The timestamp of the event.
        :param action: The action to be performed.
        :param kwargs: The arguments for the action.
        """
        self.for_id = for_id
        self.timestamp = timestamp
        self.action = action
        self.kwargs = kwargs


class SetVisible(VisualEvent):
    """
    Event to set the visibility of a component.
    """

    def __init__(self, for_id: str, timestamp: SimTime, visible: bool):
        """
        :param for_id: The id of the component this event is for.
        :param timestamp: The timestamp of the event.
        :param visible: Whether the component should be visible or not.
        """
        super().__init__(for_id, timestamp, "SET_VISIBLE", visible=visible)


class SetPosition(VisualEvent):
    """
    Event to set the position of a component.
    """

    def __init__(self, for_id: str, timestamp: SimTime, x: int, y: int):
        """
        :param for_id: The id of the component this event is for.
        :param timestamp: The timestamp of the event.
        :param x: The x coordinate of the component.
        :param y: The y coordinate of the component.
        """
        super().__init__(for_id, timestamp, "SET_POSITION", x=x, y=y)


class SetInteracting(VisualEvent):
    """
    Event to set the interaction of a component.
    """

    def __init__(self, for_id: str, timestamp: SimTime, with_id: str):
        """
        :param for_id: The id of the component this event is for.
        :param timestamp: The timestamp of the event.
        :param with_id: The id of the component the first component is interacting with.
        """
        super().__init__(for_id, timestamp, "SET_INTERACTING", with_id=with_id)


class SetNotInteracting(VisualEvent):
    """
    Event to set the interaction of a component.
    """

    def __init__(self, for_id: str, timestamp: SimTime, with_id: str):
        """
        :param for_id: The id of the component this event is for.
        :param timestamp: The timestamp of the event.
        :param with_id: The id of the component the first component is interacting with.
        """
        super().__init__(for_id, timestamp, "SET_NOT_INTERACTING", with_id=with_id)


class MoveNear(VisualEvent):
    """
    Event to move a component near another component.
    """

    def __init__(self, for_id: str, timestamp: SimTime, target_id: str):
        """
        :param for_id: The id of the component this event is for.
        :param timestamp: The timestamp of the event.
        :param target_id: The id of the component the first component should move near.
        """
        super().__init__(for_id, timestamp, "MOVE_NEAR", target_id=target_id)


class MoveNearCell(VisualEvent):
    """
    Event to move a component near a cell in the grid.
    """

    def __init__(self, for_id: str, timestamp: SimTime, x: int, y: int):
        """
        :param for_id: The id of the component this event is for.
        :param timestamp: The timestamp of the event.
        :param x: The x coordinate (column) of the cell.
        :param y: The y coordinate (row) of the cell.
        """
        super().__init__(for_id, timestamp, "MOVE_NEAR_CELL", x=x, y=y)


class SetTintColor(VisualEvent):
    """
    Event to set the tint color of a component.
    """

    def __init__(self, for_id: str, timestamp: SimTime, color: int):
        """
        :param for_id: The id of the component this event is for.
        :param timestamp: The timestamp of the event.
        :param color: The color to tint the component.
        """
        super().__init__(for_id, timestamp, "SET_TINT_COLOR", color=color)


class SetDecoratingText(VisualEvent):
    """
    Event to set the decorating text of a component.
    """

    def __init__(self, for_id: str, timestamp: SimTime, text: str):
        """
        :param for_id: The id of the component this event is for.
        :param timestamp: The timestamp of the event.
        :param text: The text to set as decorating text.
        """
        super().__init__(for_id, timestamp, "SET_DECORATING_TEXT", text=text)


class SetSpriteFrame(VisualEvent):
    """
    Event to set the sprite frame of a component.
    """

    def __init__(self, for_id: str, timestamp: SimTime, frame: int):
        """
        :param for_id: The id of the component this event is for.
        :param timestamp: The timestamp of the event.
        :param frame: The frame to set the sprite to.
        """
        super().__init__(for_id, timestamp, "SET_SPRITE_FRAME", frame=frame)


class ResourceSetCapacity(VisualEvent):
    """
    Event to set the capacity of a resource.
    """

    def __init__(self, for_id: str, timestamp: SimTime, capacity: int):
        """
        :param for_id: The id of the component this event is for.
        :param timestamp: The timestamp of the event.
        :param capacity: The capacity to set the resource to.
        """
        super().__init__(for_id, timestamp, "RESOURCE.SET_CAPACITY", capacity=capacity)


class ResourceSetUtilization(VisualEvent):
    """
    Event to set the utilization of a resource.
    """

    def __init__(self, for_id: str, timestamp: SimTime, utilization: int):
        """
        :param for_id: The id of the component this event is for.
        :param timestamp: The timestamp of the event.
        :param utilization: The utilization to set the resource to.
        """
        super().__init__(
            for_id, timestamp, "RESOURCE.SET_UTILIZATION", utilization=utilization
        )


class ContainerSetCapacity(VisualEvent):
    """
    Event to set the capacity of a container.
    """

    def __init__(self, for_id: str, timestamp: SimTime, capacity: int):
        """
        :param for_id: The id of the component this event is for.
        :param timestamp: The timestamp of the event.
        :param capacity: The capacity to set the container to.
        """
        super().__init__(for_id, timestamp, "CONTAINER.SET_CAPACITY", capacity=capacity)


class ContainerSetLevel(VisualEvent):
    """
    Event to set the level of a container.
    """

    def __init__(self, for_id: str, timestamp: SimTime, level: ContainerAmount):
        """
        :param for_id: The id of the component this event is for.
        :param timestamp: The timestamp of the event.
        :param level: The level to set the container to.
        """
        super().__init__(for_id, timestamp, "CONTAINER.SET_LEVEL", level=level)


class StoreSetCapacity(VisualEvent):
    """
    Event to set the capacity of a store.
    """

    def __init__(self, for_id: str, timestamp: SimTime, capacity: Union[float, int]):
        """
        :param for_id: The id of the component this event is for.
        :param timestamp: The timestamp of the event.
        :param capacity: The capacity to set the store to.
        """
        super().__init__(for_id, timestamp, "STORE.SET_CAPACITY", capacity=capacity)


class StoreSetContent(VisualEvent):
    """
    Event to set the content of a store.
    """

    def __init__(self, for_id: str, timestamp: SimTime, content):
        """
        :param for_id: The id of the component this event is for.
        :param timestamp: The timestamp of the event.
        :param content: The content to set the store to.
        """
        super().__init__(for_id, timestamp, "STORE.SET_CONTENT", content=content)

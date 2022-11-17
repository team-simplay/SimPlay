from typing import List, Union
import jsons
from simpy.core import SimTime, Environment
from simpy.resources.container import ContainerAmount

from .internals import EventAction, ComponentType, ErrorText
from .visualization import VisualGrid


class VisualEnvironment(Environment):
    """
    Extends the :class:`~simpy.core.Environment` class with visualization.
    """

    def __init__(self, initial_time: SimTime = 0):
        super().__init__(initial_time)
        self.visualization_manager = VisualizationManager()


class VisualComponent:
    """
    Base class for all visual components.

    :param env: The environment instance.
    :param id: The id of the component.
    :param type: The type of the component, one of ``ComponentType``.
    :param graphic: The graphic of the component, either a 'simple' visual or
        a collection of sprites. Must be registered in the
        ``VisualizationManager``.
    :param tint: The tint of the component. This only works with visuals and
        sprites that have transparent pixels. The tint is applied to the
        pixelsthat are not transparent. To use HEX values, write them as
        0xRRGGBB. For example: 0xFF0000 is red, 0x00FF00 is green,
        0x0000FF is blue.
    :raises TypeError: If the type is invalid.
    :raises TypeError: If the id is not a string.
    :raises TypeError: If the environment is not a `VisualEnvironment`.
    :raises TypeError: If the graphic is not a string.
    :raises TypeError: If the tint is not an integer.
    """

    def __init__(
            self,
            env: VisualEnvironment,
            id: str,
            type: ComponentType,
            graphic: str,
            tint: int):
        if not isinstance(type, ComponentType):
            raise TypeError(ErrorText.INVALID_COMPONENT_TYPE)
        if not isinstance(id, str):
            raise TypeError(ErrorText.ID_MUST_BE_STRING)
        if not isinstance(env, VisualEnvironment):
            raise TypeError(ErrorText.ENV_MUST_BE_VISUAL_ENVIRONMENT)
        if not isinstance(graphic, str):
            raise TypeError(ErrorText.GRAPHIC_MUST_BE_STRING)
        if not isinstance(tint, int):
            raise TypeError(ErrorText.TINT_MUST_BE_INTEGER)
        self.env = env
        self.id = id
        self.type = type
        self.graphic = graphic
        self.tint = tint
        self.env.visualization_manager.add_entity(self, type)


class VisualEvent:
    """
    Base class for all visual events.

    :param component: The component this event is for.
    :param timestamp: The timestamp of the event.
    :param action: The action to be performed.
    :param kwargs: The arguments for the action.
    :raises TypeError: If component is not a string.
    :raises TypeError: If timestamp is not a number.
    :raises TypeError: If action is not a string.
    """

    def __init__(
            self,
            component: VisualComponent,
            timestamp: SimTime,
            action: EventAction,
            **kwargs: dict):
        if not isinstance(component, VisualComponent):
            raise TypeError(ErrorText.COMPONENT_MUST_BE_VISUAL_COMPONENT)
        if not isinstance(timestamp, (int, float)):
            raise TypeError(ErrorText.TIMESTAMP_MUST_BE_INT_OR_FLOAT)
        if not isinstance(action, EventAction):
            raise TypeError(ErrorText.ACTION_MUST_BE_EVENTACTION)
        self.for_id = component.id
        self.timestamp = timestamp
        self.action = action.value
        self.args = kwargs


class VisualizationManager:
    """
    This class acts as a central point for all entities, visuals, sprites and
    events.
    """

    def __init__(self):
        self.events = []
        """
        The events that happened in the simulation.
        """
        self.entities = []
        """
        The entities of the simulation.
        """
        self.visuals = []
        """
        The visuals that have been registered with the manager.
        """
        self.sprites = []
        """
        The sprites that have been registered with the manager.
        """
        self.grid = None
        """
        The grid that is used for the visualization.
        """

    def add_entity(self, entity: VisualComponent, type: ComponentType):
        """
        Add an entity to the visualization.

        :param entity: The entity to add.
        :param type: The type of the entity, one of ``ComponentType``.
        :raises TypeError: If the type is invalid.
        :raises TypeError: If the entity is not a ``VisualComponent``.

        """
        if not isinstance(type, ComponentType):
            raise TypeError(ErrorText.INVALID_COMPONENT_TYPE)
        if not isinstance(entity, VisualComponent):
            raise TypeError(ErrorText.ENTITY_MUST_BE_VISUAL_COMPONENT)

        self.entities.append(
            {
                "id": entity.id,
                "type": type.value,
                "graphic": entity.graphic,
                "tint": entity.tint,
            }
        )

    def add_event(self, event: VisualEvent):
        """
        Add an event to the visualization.

        :param event: The event to add.
        """
        self.events.append(event)
        self.events.sort(key=lambda x: x.timestamp)

    def register_visual(self, id: str, path: str):
        """
        Register a visual with the manager.

        :param id: The id of the visual, it must be unique and can be used to
            reference the graphic in components.
        :param path: The path to the visual.
        :raises TypeError: If the id is not a string.
        :raises TypeError: If the path is not a string.
        :raises ValueError: If the id is not unique.
        :raises ValueError: If the path is empty.
        """
        for v in self.visuals:
            if v["id"] == id:
                raise ValueError(ErrorText.ID_NOT_UNIQUE)
        if path is None or path == "":
            raise ValueError(ErrorText.PATH_EMPTY)
        if not isinstance(path, str):
            raise TypeError(ErrorText.PATH_MUST_BE_STRING)
        if not isinstance(id, str):
            raise TypeError(ErrorText.ID_MUST_BE_STRING)
        self.visuals.append({"id": id, "path": path})

    def register_sprite(self, id: str, frames: List[str]):
        """
        Register a sprite with the manager.

        :param id: The id of the sprite, it must be unique and can be used to
            reference the graphic in components.
        :param frames: A list of paths to the frames of the sprite.
        :raises TypeError: If the id is not a string.
        :raises TypeError: If the frames are not a list.
        :raises ValueError: If the id is not unique.
        :raises ValueError: If the frames are empty.
        """
        for s in self.sprites:
            if s["id"] == id:
                raise ValueError(ErrorText.ID_NOT_UNIQUE)
        if frames is None or len(frames) == 0:
            raise ValueError(ErrorText.FRAMES_MUST_NOT_BE_EMPTY)
        if not all(isinstance(f, str) for f in frames):
            raise TypeError(ErrorText.FRAMES_MUST_BE_LIST_OF_STRINGS)
        if not isinstance(id, str):
            raise TypeError(ErrorText.ID_MUST_BE_STRING)

        self.sprites.append({"id": id, "frames": frames})

    def set_grid(self, grid: VisualGrid):
        """
        Set the grid for the visualization.

        :param grid: The grid to use.
        :raises TypeError: If the grid is not a `VisualGrid`.
        :raises ValueError: If the grid is None.
        """
        if grid is None:
            raise ValueError(ErrorText.GRID_MUST_NOT_BE_NONE)
        if not isinstance(grid, VisualGrid):
            raise TypeError(ErrorText.GRID_MUST_BE_VISUAL_GRID)
        self.grid = grid

    def serialize(self) -> str:
        """
        Serialize the visualization to a JSON string.
        """
        return jsons.dumps(
            {
                "events": self.events,
                "entities": self.entities,
                "visuals": self.visuals,
                "sprites": self.sprites,
                "grid": self.grid,
            },
            strip_privates=True,
            key_transformer=jsons.KEY_TRANSFORMER_CAMELCASE,
        )

    def write_to_file(self, filename: str):
        """
        Write the visualization to a file.

        :param filename: The name of the file to write to.
        """
        with open(filename, "w") as f:
            f.write(self.serialize())


class SetVisible(VisualEvent):
    """
    Event to set the visibility of a component.

    :param component: The component this event is for.
    :param timestamp: The timestamp of the event.
    :param visible: Whether the component should be visible or not.
    :raises TypeError: If visible is not a boolean.
    """

    def __init__(self, component: VisualComponent,
                 timestamp: SimTime, visible: bool):
        if not isinstance(visible, bool):
            raise TypeError(ErrorText.VISIBLE_MUST_BE_BOOL)
        super().__init__(component, timestamp, EventAction.SET_VISIBLE,
                         visible=visible)


class SetPosition(VisualEvent):
    """
    Event to set the position of a component.

    :param component: The component this event is for.
    :param timestamp: The timestamp of the event.
    :param x: The x coordinate of the component.
    :param y: The y coordinate of the component.
    :raises TypeError: If x is not an integer.
    :raises TypeError: If y is not an integer.
    """

    def __init__(self, component: VisualComponent,
                 timestamp: SimTime, x: int, y: int):
        if not isinstance(x, int):
            raise TypeError(ErrorText.X_MUST_BE_INT)
        if not isinstance(y, int):
            raise TypeError(ErrorText.Y_MUST_BE_INT)
        super().__init__(component, timestamp,
                         EventAction.SET_POSITION, x=x, y=y)


class SetInteracting(VisualEvent):
    """
    Event to set the interaction of a component.

    :param component: The component this event is for.
    :param timestamp: The timestamp of the event.
    :param with_id: The id of the component the first component is interacting
        with.
    :raises TypeError: If with_id is not a string.
    """

    def __init__(self, component: VisualComponent,
                 timestamp: SimTime, with_id: str):
        if not isinstance(with_id, str):
            raise TypeError(ErrorText.WITHID_MUST_BE_STRING)
        super().__init__(component, timestamp, EventAction.SET_INTERACTING,
                         with_id=with_id)


class SetNotInteracting(VisualEvent):
    """
    Event to set the interaction of a component.

    :param component: The component this event is for.
    :param timestamp: The timestamp of the event.
    :param with_id: The id of the component the first component is interacting
     with.
    :raises TypeError: If with_id is not a string.
    """

    def __init__(self, component: VisualComponent,
                 timestamp: SimTime, with_id: str):
        if not isinstance(with_id, str):
            raise TypeError(ErrorText.WITHID_MUST_BE_STRING)
        super().__init__(component, timestamp, EventAction.SET_NOT_INTERACTING,
                         with_id=with_id)


class MoveNear(VisualEvent):
    """
    Event to move a component near another component.

    :param component: The component this event is for.
    :param timestamp: The timestamp of the event.
    :param target_id: The id of the component the first component should move
        near.
    :raises TypeError: If target_id is not a string.
    """

    def __init__(self, component: VisualComponent,
                 timestamp: SimTime, target_id: str):
        if not isinstance(target_id, str):
            raise TypeError(ErrorText.TARGETID_MUST_BE_STRING)
        super().__init__(component, timestamp, EventAction.MOVE_NEAR,
                         target_id=target_id)


class MoveNearCell(VisualEvent):
    """
    Event to move a component near a cell in the grid.

    :param component: The component this event is for.
    :param timestamp: The timestamp of the event.
    :param x: The x coordinate (column) of the cell.
    :param y: The y coordinate (row) of the cell.
    :raises TypeError: If x is not an integer.
    :raises TypeError: If y is not an integer.
    """

    def __init__(self, component: VisualComponent,
                 timestamp: SimTime, x: int, y: int):
        if not isinstance(x, int):
            raise TypeError(ErrorText.X_MUST_BE_INT)
        if not isinstance(y, int):
            raise TypeError(ErrorText.Y_MUST_BE_INT)
        super().__init__(component, timestamp, EventAction.MOVE_NEAR_CELL,
                         x=x, y=y)


class SetTintColor(VisualEvent):
    """
    Event to set the tint color of a component.

    :param component: The component this event is for.
    :param timestamp: The timestamp of the event.
    :param color: The tint of the component. This only works with visuals and
        sprites that have transparent pixels. The tint is applied to the
        pixelsthat are not transparent. To use HEX values, write them as
        0xRRGGBB. For example: 0xFF0000 is red, 0x00FF00 is green,
        0x0000FF is blue.
    :raises TypeError: If color is not a string.
    """

    def __init__(self, component: VisualComponent,
                 timestamp: SimTime, color: int):
        if not isinstance(color, int):
            raise TypeError(ErrorText.COLOR_MUST_BE_INT)
        super().__init__(component, timestamp, EventAction.SET_TINT_COLOR,
                         color=color)


class SetDecoratingText(VisualEvent):
    """
    Event to set the decorating text of a component.

    :param component: The component this event is for.
    :param timestamp: The timestamp of the event.
    :param text: The text to set as decorating text.
    :raises TypeError: If text is not a string.
    """

    def __init__(self, component: VisualComponent,
                 timestamp: SimTime, text: str):
        if not isinstance(text, str):
            raise TypeError(ErrorText.TEXT_MUST_BE_STRING)
        super().__init__(component, timestamp, EventAction.SET_DECORATING_TEXT,
                         text=text)


class SetSpriteFrame(VisualEvent):
    """
    Event to set the sprite frame of a component.

    :param component: The component this event is for.
    :param timestamp: The timestamp of the event.
    :param frame: The frame to set the sprite to.
    :raises TypeError: If frame is not an integer.
    """

    def __init__(self, component: VisualComponent,
                 timestamp: SimTime, frame: int):
        if not isinstance(frame, int):
            raise TypeError(ErrorText.FRAME_MUST_BE_INT)
        super().__init__(component, timestamp, EventAction.SET_SPRITE_FRAME,
                         frame=frame)


class ResourceSetCapacity(VisualEvent):
    """
    Event to set the capacity of a resource.

    :param component: The component this event is for.
    :param timestamp: The timestamp of the event.
    :param capacity: The capacity to set the resource to.
    :raises TypeError: If capacity is not a positive integer.
    """

    def __init__(self, component: VisualComponent,
                 timestamp: SimTime, capacity: int):
        if not isinstance(capacity, int):
            raise TypeError(ErrorText.CAPACITY_MUST_BE_POSITIVE_INT)
        super().__init__(component, timestamp,
                         EventAction.RESOURCE_SET_CAPACITY,
                         capacity=capacity)


class ResourceSetUtilization(VisualEvent):
    """
    Event to set the utilization of a resource.

    :param component: The component this event is for.
    :param timestamp: The timestamp of the event.
    :param utilization: The utilization to set the resource to.
    :raises TypeError: If utilization is not a integer.
    """

    def __init__(self, component: VisualComponent,
                 timestamp: SimTime, utilization: int):
        if not isinstance(utilization, int):
            raise TypeError(ErrorText.UTILIZATION_MUST_BE_INT)
        super().__init__(
            component,
            timestamp,
            EventAction.RESOURCE_SET_UTILIZATION,
            utilization=utilization)


class ContainerSetCapacity(VisualEvent):
    """
    Event to set the capacity of a container.

    :param component: The component this event is for.
    :param timestamp: The timestamp of the event.
    :param capacity: The capacity to set the container to.
    :raises TypeError: If capacity is not a positive integer.
    """

    def __init__(self, component: VisualComponent,
                 timestamp: SimTime, capacity: Union[int, float]):
        if not isinstance(capacity, int) and not isinstance(capacity, float):
            raise TypeError(ErrorText.CAPACITY_MUST_BE_POSITIVE_INT_OR_FLOAT)
        super().__init__(component, timestamp,
                         EventAction.CONTAINER_SET_CAPACITY,
                         capacity=capacity)


class ContainerSetLevel(VisualEvent):
    """
    Event to set the level of a container.

    :param component: The component this event is for.
    :param timestamp: The timestamp of the event.
    :param level: The level to set the container to.
    :raises TypeError: If level is not a positive integer or float.
    """

    def __init__(
            self,
            component: VisualComponent,
            timestamp: SimTime,
            level: ContainerAmount):
        if not isinstance(level, int) and not isinstance(level, float):
            raise TypeError(ErrorText.LEVEL_MUST_BE_POSITIVE_INT_OR_FLOAT)
        super().__init__(component, timestamp, EventAction.CONTAINER_SET_LEVEL,
                         level=level)


class StoreSetCapacity(VisualEvent):
    """
    Event to set the capacity of a store.

    :param component: The component this event is for.
    :param timestamp: The timestamp of the event.
    :param capacity: The capacity to set the store to.
    :raises TypeError: If capacity is not a positive integer or float.
    """

    def __init__(self, component: VisualComponent, timestamp: SimTime,
                 capacity: Union[float, int]):
        if not isinstance(capacity, (float, int)):
            raise TypeError(ErrorText.CAPACITY_MUST_BE_POSITIVE_INT_OR_FLOAT)
        super().__init__(component, timestamp, EventAction.STORE_SET_CAPACITY,
                         capacity=capacity)


class StoreSetContent(VisualEvent):
    """
    Event to set the content of a store.

    :param component: The component this event is for.
    :param timestamp: The timestamp of the event.
    :param content: The content to set the store to.
    """

    def __init__(self, component: VisualComponent,
                 timestamp: SimTime, content):
        super().__init__(component, timestamp, EventAction.STORE_SET_CONTENT,
                         content=content)

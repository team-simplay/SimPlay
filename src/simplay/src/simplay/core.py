from typing import List, Union
import jsons
from simpy.core import SimTime, Environment
from simpy.resources.container import ContainerAmount

from .primitives import EventAction, ComponentType, ErrorText
from .visualization import VisualGrid
from .events import VisualEvent


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
    :param type: The type of the component, one of
        :class:`~simplay.primitives.ComponentType`..
    :param graphic: The graphic of the component, either a 'simple' visual or
        a collection of sprites. Must be registered in the
        :class:`~simplay.core.VisualizationManager`.
    :param tint: The tint of the component. This only works with visuals and
        sprites that have transparent pixels. The tint is applied to the
        pixelsthat are not transparent. To use HEX values, write them as
        0xRRGGBB. For example: 0xFF0000 is red, 0x00FF00 is green,
        0x0000FF is blue.
    :raises TypeError: If the type is invalid.
    :raises TypeError: If the id is not a string.
    :raises TypeError: If the environment is not a
        :class:`~simplay.core.VisualEnvironment`.
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
        :param type: The type of the entity, one of
            :class:`~simplay.primitives.ComponentType`.
        :raises TypeError: If the type is invalid.
        :raises TypeError: If the entity is not a
            :class:`~simplay.core.VisualComponent`.

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
        :raises TypeError: If the grid is not a
            :class:`~simplay.visualization.VisualGrid`.
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

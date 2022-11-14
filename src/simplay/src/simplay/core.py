from typing import List
import jsons
from simpy.core import SimTime, Environment
from .events import VisualEvent
from .visualization import VisualGrid


class VisualEnvironment(Environment):
    """Extends the :class:`~simpy.core.Environment` class with visualization."""

    def __init__(self, initial_time: SimTime = 0):
        super().__init__(initial_time)
        self.visualization_manager = VisualizationManager()


class VisualComponent:
    """
    Base class for all visual components.

    :param env: The environment instance.
    :param id: The id of the component.
    :param type: The type of the component, one of ``'RESOURCE'``, ``'CONTAINER'``, ``'STORE'``, ``'PROCESS'`` or ``'CUSTOM'``.
    :param graphic: The graphic of the component, either a 'simple' visual or a collection of sprites. Must be registered in the ``VisualizationManager``.
    :param tint: The tint of the component. This only works with visuals and sprites that have transparent pixels. The tint is applied to the pixels that are not transparent.
    """

    def __init__(
            self,
            env: VisualEnvironment,
            id: str,
            type: str,
            graphic: str,
            tint: int):
        if type not in ["RESOURCE", "CONTAINER", "STORE", "PROCESS", "CUSTOM"]:
            raise ValueError("Invalid component type.")
        if not isinstance(id, str):
            raise ValueError("Id must be a string.")
        if not isinstance(env, VisualEnvironment):
            raise ValueError("Env must be of type VisualEnvironment.")
        if not isinstance(graphic, str):
            raise ValueError("Graphic must be a string.")
        if not isinstance(tint, int):
            raise ValueError("Tint must be an integer.")
        self.env = env
        self.id = id
        self.type = type
        self.graphic = graphic
        self.tint = tint
        self.env.visualization_manager.add_entity(self, type)


class VisualizationManager:
    """
    This class acts as a central point for all entities, visuals, sprites and events.
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

    def add_entity(self, entity: VisualComponent, type: str):
        """
        Add an entity to the visualization.

        :param entity: The entity to add.
        :param type: The type of the entity, one of ``'PROCESS'``, ``'RESOURCE'``, ``'CONTAINER'``, ``'STORE'``, ``'CUSTOM'``.
        """
        if type not in ["PROCESS", "RESOURCE", "CONTAINER", "STORE", "CUSTOM"]:
            raise ValueError("Invalid entity type.")
        if not isinstance(entity, VisualComponent):
            raise ValueError("Entity must be of type VisualComponent.")

        self.entities.append(
            {
                "id": entity.id,
                "type": type,
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

        :param id: The id of the visual, it must be unique and can be used to reference the graphic in components.
        :param path: The path to the visual.
        """
        for v in self.visuals:
            if v["id"] == id:
                raise ValueError("Visual id must be unique.")
        if path is None or path == "":
            raise ValueError("Visual path must not be None / empty.")
        if not isinstance(path, str):
            raise ValueError("Visual path must be a string.")
        if not isinstance(id, str):
            raise ValueError("Visual id must be a string.")
        self.visuals.append({"id": id, "path": path})

    def register_sprite(self, id: str, frames: List[str]):
        """
        Register a sprite with the manager.

        :param id: The id of the sprite, it must be unique and can be used to reference the graphic in components.
        :param frames: A list of paths to the frames of the sprite.
        """
        for s in self.sprites:
            if s["id"] == id:
                raise ValueError("Sprite id must be unique.")
        if frames is None or len(frames) == 0:
            raise ValueError("Sprite frames must not be None / empty.")
        if not all(isinstance(f, str) for f in frames):
            raise ValueError("Sprite frames must be a list of strings.")
        if not isinstance(id, str):
            raise ValueError("Sprite id must be a string.")

        self.sprites.append({"id": id, "frames": frames})

    def set_grid(self, grid: VisualGrid):
        """
        Set the grid for the visualization.

        :param grid: The grid to use.
        """
        if grid is None:
            raise ValueError("Grid must not be None.")

        if not isinstance(grid, VisualGrid):
            raise ValueError("Grid must be of type VisualGrid.")
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

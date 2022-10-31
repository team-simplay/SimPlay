from typing import List
import jsons
from simpy.core import SimTime, Environment
from simplay.events import VisualEvent

from simplay.visualization import VisualGrid

class VisualEnvironment(Environment):
    """Extends the :class:`~simpy.core.Environment` class with visualization."""

    def __init__(self, initial_time: SimTime = 0):
        super().__init__(initial_time)
        self.visualization_manager = VisualizationManager(self)


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
        self, env: VisualEnvironment, id: str, type: str, graphic: str, tint: int
    ):
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
        """
        The simulation environment that is visualized.
        """
        self.events = []
        """
        The events that happened in the simulation.
        """
        self.entities = []
        """
        The entities which exist in the simulation.
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
        self.entities.append(
            {
                "id": entity.id,
                "type": type,
                "visual": entity.graphic,
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

    def register_visual(self, id: str, visual: str):
        """
        Register a visual with the manager.

        :param id: The id of the visual, it must be unique and can be used to reference the graphic in components.
        :param visual: The path to the visual.
        """
        self.visuals.append({"id": id, "visual": visual})

    def register_sprite(self, id: str, frames: List[str]):
        """
        Register a sprite with the manager.

        :param id: The id of the sprite, it must be unique and can be used to reference the graphic in components.
        :param frames: A list of paths to the frames of the sprite.
        """
        self.sprites.append({"id": id, "frames": frames})

    def set_grid(self, grid: VisualGrid):
        """
        Set the grid for the visualization.

        :param grid: The grid to use.
        """
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

